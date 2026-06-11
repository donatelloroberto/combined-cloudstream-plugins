# Anonymous Gay Torrents – Stremio Addon

> **Platform:** Stremio (not Cloudstream)  
> **Type:** Node.js HTTP server / Vercel serverless function

This is a **Stremio** addon that provides gay torrent catalogs and streams via magnet links. It is completely separate from the Cloudstream plugins in the parent directory — they serve different applications.

## Quick Start

```bash
# Install & run locally
cd stremio-addon
npm install
npm start
# Then install in Stremio:  stremio://localhost:7000/manifest.json
```

## Deploy to Vercel

```bash
npm i -g vercel
vercel deploy
```

After deploying, copy the Vercel URL and install it in Stremio:  
`stremio://YOUR_VERCEL_URL/manifest.json`

## Features

- **Top catalog** – Browse top gay torrents
- **Search catalog** – Search by title
- **Magnet streams** – Direct magnet links, no sign-up required
- **Metadata** – File size, seeders, leechers

## How It Works

The addon uses the [Stremio Addon SDK](https://github.com/Stremio/stremio-addon-sdk) and queries the [Pirate Bay API](https://apibay.org) for torrent metadata and magnet links. No personal data is collected — hence "anonymous."

## Difference from Cloudstream Plugins

| Feature | This (Stremio addon) | Parent folder (Cloudstream) |
|---|---|---|
| Platform | Stremio | Cloudstream 3 |
| Language | Node.js | Kotlin (Android) |
| Install | `stremio://` URL | `.cs3` plugin file |
| Streams | Magnet/BitTorrent | Direct HTTP streams |
