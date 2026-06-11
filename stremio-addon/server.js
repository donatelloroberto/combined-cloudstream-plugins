/**
 * Anonymous Gay Torrents – Stremio Addon
 * A Stremio addon that provides gay torrent catalogs.
 *
 * NOTE: This is a STREMIO addon, not a Cloudstream plugin.
 * It uses the stremio-addon-sdk and runs as a Node.js HTTP server.
 * Cloudstream plugins are in the parent directory of this folder.
 *
 * Deploy to Vercel: vercel deploy
 * Run locally:      npm start  (then visit http://localhost:7000/manifest.json)
 * Install in Stremio: stremio://localhost:7000/manifest.json
 */

const { addonBuilder, serveHTTP } = require("stremio-addon-sdk");

const MANIFEST = {
  id: "community.anonymous.gaytorrents",
  version: "1.0.0",
  name: "Anonymous Gay Torrents",
  description:
    "Provides gay torrent catalog and streams via anonymous torrent search. " +
    "For adult audiences only.",
  logo: "https://www.google.com/s2/favicons?domain=nurgay.to&sz=128",
  background:
    "https://www.google.com/s2/favicons?domain=gaystream.pw&sz=512",
  types: ["movie"],
  catalogs: [
    {
      type: "movie",
      id: "gaytorrents-top",
      name: "Gay Torrents – Top",
      extra: [{ name: "skip", isRequired: false }],
    },
    {
      type: "movie",
      id: "gaytorrents-search",
      name: "Gay Torrents – Search",
      extra: [
        { name: "search", isRequired: true },
        { name: "skip", isRequired: false },
      ],
    },
  ],
  resources: ["catalog", "stream", "meta"],
  idPrefixes: ["gt:"],
  behaviorHints: {
    adult: true,
    configurable: false,
  },
};

const builder = new addonBuilder(MANIFEST);

/**
 * Fetch gay torrent search results from a public torrent API.
 * Returns an array of Stremio catalog meta objects.
 */
async function searchTorrents(query, skip = 0) {
  const fetch = require("node-fetch");
  // Use 1337x or similar aggregator that allows programmatic access.
  // Replace with your preferred torrent search API endpoint.
  const endpoint = `https://apibay.org/q.php?q=${encodeURIComponent(
    query + " gay"
  )}&cat=500`;

  try {
    const response = await fetch(endpoint, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    if (!response.ok) return [];
    const data = await response.json();
    if (!Array.isArray(data) || data[0]?.name === "No results returned") return [];

    return data.slice(skip, skip + 20).map((item) => ({
      id: `gt:${item.id}`,
      type: "movie",
      name: item.name,
      description: `Size: ${formatBytes(parseInt(item.size))} | Seeds: ${item.seeders} | Leechers: ${item.leechers}`,
      poster: `https://www.google.com/s2/favicons?domain=nurgay.to&sz=256`,
      posterShape: "square",
      imdbRating: null,
      genres: ["Gay", "Adult"],
    }));
  } catch {
    return [];
  }
}

function formatBytes(bytes) {
  if (!bytes) return "Unknown";
  const gb = bytes / 1e9;
  if (gb >= 1) return `${gb.toFixed(2)} GB`;
  const mb = bytes / 1e6;
  return `${mb.toFixed(0)} MB`;
}

// Catalog handler
builder.defineCatalogHandler(async ({ type, id, extra }) => {
  if (type !== "movie") return { metas: [] };

  const skip = parseInt(extra?.skip || "0");

  if (id === "gaytorrents-top") {
    const metas = await searchTorrents("gay", skip);
    return { metas };
  }

  if (id === "gaytorrents-search" && extra?.search) {
    const metas = await searchTorrents(extra.search, skip);
    return { metas };
  }

  return { metas: [] };
});

// Meta handler
builder.defineMetaHandler(async ({ type, id }) => {
  if (!id.startsWith("gt:")) return { meta: null };
  const torrentId = id.replace("gt:", "");

  const fetch = require("node-fetch");
  try {
    const response = await fetch(`https://apibay.org/t.php?id=${torrentId}`);
    if (!response.ok) return { meta: null };
    const item = await response.json();
    return {
      meta: {
        id,
        type: "movie",
        name: item.name,
        description: `Size: ${formatBytes(parseInt(item.size))} | Seeds: ${item.seeders} | Leechers: ${item.leechers}\n\nCategory: ${item.category}`,
        poster: `https://www.google.com/s2/favicons?domain=nurgay.to&sz=256`,
        posterShape: "square",
        genres: ["Gay", "Adult"],
      },
    };
  } catch {
    return { meta: null };
  }
});

// Stream handler – provides magnet link
builder.defineStreamHandler(async ({ type, id }) => {
  if (!id.startsWith("gt:")) return { streams: [] };
  const torrentId = id.replace("gt:", "");

  const fetch = require("node-fetch");
  try {
    const response = await fetch(`https://apibay.org/t.php?id=${torrentId}`);
    if (!response.ok) return { streams: [] };
    const item = await response.json();

    const magnetLink =
      `magnet:?xt=urn:btih:${item.info_hash}` +
      `&dn=${encodeURIComponent(item.name)}` +
      `&tr=udp://tracker.opentrackr.org:1337/announce` +
      `&tr=udp://open.tracker.cl:1337/announce` +
      `&tr=udp://9.rarbg.com:2810/announce`;

    return {
      streams: [
        {
          name: "Torrent",
          title: `${item.name}\n${formatBytes(parseInt(item.size))} | Seeds: ${item.seeders}`,
          infoHash: item.info_hash.toLowerCase(),
          sources: [
            "tracker:udp://tracker.opentrackr.org:1337/announce",
            "tracker:udp://open.tracker.cl:1337/announce",
          ],
          behaviorHints: { bingeGroup: "gaytorrents" },
        },
      ],
    };
  } catch {
    return { streams: [] };
  }
});

const PORT = process.env.PORT || 7000;
serveHTTP(builder.getInterface(), { port: PORT });
console.log(`Gay Torrents Stremio addon running on port ${PORT}`);
console.log(
  `Install in Stremio: stremio://localhost:${PORT}/manifest.json`
);
