# Gay Cloudstream Plugins

> **18 gay-only, de-duplicated, fixed, and enhanced Cloudstream 3 plugins** — merged from 4 separate repositories into one unified, buildable repo.
>
> **Adult content. All plugins are gay-focused and carry `tvType = NSFW`.**

---

## 🗂 What's Inside

| Category | Plugins |
|---|---|
| **Gay (English)** | BestHDgayporn, BoyfriendTV, Fullboys, Fxggxt, Gaycock4U, GayStream, GEPorner, GPornOne, GPorntrex, GXtapes, Javgaytv, Jayboys, Justthegays, Nurgay, topHDgayporn |
| **Gay (Vietnamese/Asian)** | Gayxx, HDgay, XhamsterVi |
| **Bonus: Stremio** | [`stremio-addon/`](./stremio-addon/) — separate Node.js gay torrent addon |

**Total: 18 Cloudstream plugins + 1 Stremio addon**

---

## 📦 Source Repositories Merged

| Repo | Plugins Used |
|---|---|
| `GayXXX-main / cloudstream-master` | Fullboys, Javgaytv, Nurgay (base), Fxggxt (base) |
| `cs-gayvn_updated-main` | BestHDgayporn, BoyfriendTV, Fxggxt (updated), Gaycock4U, GayStream, Gayxx, GEPorner, GPornOne, GPorntrex, GXtapes, HDgay, Jayboys, Justthegays, Nurgay (extractors), topHDgayporn, XhamsterVi |
| `TestPlugins-cloudstream` | No gay source available (Dvdgayonline was pre-built only, dropped) |
| `anonymous-gaytorrents-addon` | Stremio addon → `stremio-addon/` |

---

## 🔧 Fixes Applied

| Plugin | Issue Found | Fix Applied |
|---|---|---|
| **Nurgay** | Syntax errors: unmatched parentheses in `toSearchResult()` and `search()`, broken `quality` assignment, references to undefined `directUrl` | Full rewrite of affected methods; `directUrl` replaced with `mainUrl`; return type set to `TvType.NSFW` |
| **XhamsterVi** | Missing `com.` package prefix (`package Xhamster` → `package com.XhamsterVi`) | Package renamed in both `.kt` files; directory restructured from `com/Xhamster/` to `com/XhamsterVi/` |
| **Jayboys** | Source files in `com/Javboys/` directory but package declared as `com.Jayboys` | Directory renamed from `Javboys` to `Jayboys` to match package declaration |
| **build.gradle.kts** | Hardcoded repo URL pointing to old owner | Updated to use `GITHUB_REPOSITORY` env var with a placeholder fallback |
| **settings.gradle.kts** | Auto-includes all dirs; would try to Gradle-build `stremio-addon/` and `gradle/` | Explicit exclusion list added |
| **stremio-addon files** | Original ZIP contained corrupt/empty placeholder files | Fully reconstructed with working Stremio SDK implementation |

---

## 🔑 Deduplication Decisions

When the same plugin appeared in multiple repos, the best version was kept:

| Plugin | Decision |
|---|---|
| `BoyfriendTV` | **cs-gayvn** — newer, explicitly gay-focused |
| `Fxggxt` | **cs-gayvn** — richer extractor support (StreamTape, Extractor.kt) |
| `Nurgay` | **cloudstream-master** source + cs-gayvn Extractors.kt as supplement |
| `XhamsterVi` | Renamed from `Xhamster` in cs-gayvn to avoid collision with the (now removed) general EN version |

---

## 🚀 Quick Start

### Option 1 – Install pre-built plugins (easiest)

1. In Cloudstream, go to **Settings → Repositories → Add Repository**
2. Paste this URL (replace `YOUR_GITHUB_USERNAME` after forking):
   ```
   https://raw.githubusercontent.com/YOUR_GITHUB_USERNAME/combined-cloudstream-plugins/main/plugins.json
   ```
3. All 18 plugins will appear in the repository browser

### Option 2 – Build from source

**Requirements:** JDK 17, Android SDK

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/combined-cloudstream-plugins
cd combined-cloudstream-plugins
chmod +x gradlew
./gradlew make makePluginsJson
```

Built `.cs3` files appear in each plugin's `build/` directory.

### Option 3 – GitHub Actions (recommended — no local SDK needed)

Fork this repo → push to `main` → GitHub Actions automatically builds all plugins and commits the `.cs3` files back to `main`.

---

## 📁 Repository Structure

```
combined-cloudstream-plugins/
├── .github/workflows/build.yml   ← Auto-build CI (JDK 17 + Android SDK)
├── build.gradle.kts              ← Root Gradle config (Cloudstream gradle plugin)
├── settings.gradle.kts           ← Auto-discovers all plugin subdirectories
├── gradle.properties             ← JVM args, AndroidX flags
├── gradle/wrapper/               ← Gradle 8.12 wrapper
├── gradlew / gradlew.bat         ← Gradle wrapper scripts
├── plugins.json                  ← Plugin registry (18 entries — update URLs after fork)
│
├── BestHDgayporn/               ← Each plugin folder contains:
│   ├── build.gradle.kts          │  version, description, authors, iconUrl, tvTypes
│   └── src/main/kotlin/com/…/   │
│       ├── PluginName.kt         │  Main API: getMainPage, search, load, loadLinks
│       └── PluginNameProvider.kt │  Plugin entry point: registerMainAPI + extractors
│
├── BoyfriendTV/
├── Fullboys/
├── Fxggxt/
├── Gaycock4U/
├── GayStream/
├── Gayxx/
├── GEPorner/
├── GPornOne/
├── GPorntrex/
├── GXtapes/
├── HDgay/
├── Javgaytv/
├── Jayboys/
├── Justthegays/
├── Nurgay/
├── topHDgayporn/
├── XhamsterVi/
│
└── stremio-addon/               ← STREMIO addon (Node.js, different platform)
    ├── server.js                 │  Stremio SDK server + torrent catalog/stream handler
    ├── api/index.js              │  Vercel serverless entry point
    ├── vercel.json               │  Vercel deployment config
    ├── package.json              │  stremio-addon-sdk dependency
    └── README.md                 │  Stremio-specific instructions
```

---

## 🧠 How Cloudstream Plugins Work

```
Plugin Entry (XxxProvider.kt)
  └── @CloudstreamPlugin class XxxProvider : Plugin()
        └── load(context) {
              registerMainAPI(Xxx())          ← the scraper
              registerExtractorAPI(Voe())     ← optional custom video extractors
              registerExtractorAPI(Dood())
            }

Main API (Xxx.kt)
  └── class Xxx : MainAPI() {
        mainUrl = "https://site.com"
        mainPage = mainPageOf("/" to "Latest", "/gay" to "Gay", …)

        getMainPage(page, request) → HomePageResponse   ← browse listings
        search(query) → List<SearchResponse>            ← search
        load(url) → LoadResponse                        ← video/series page
        loadLinks(data, …, callback) → Boolean          ← extract stream URLs
      }
```

### Plugin Lifecycle

1. User adds repository URL → Cloudstream downloads `plugins.json`
2. User installs a plugin → Cloudstream downloads the `.cs3` file
3. `.cs3` = compiled Android library loaded at runtime via `Plugin.load()`
4. On browse/search, Cloudstream calls `getMainPage()` / `search()` → JSoup HTML parsing
5. On video open, `load()` → `loadLinks()` → extractors resolve the final stream URL

---

## 📝 Adding a New Plugin

1. Create a directory: `MyGayPlugin/`
2. Add `build.gradle.kts`:
   ```kotlin
   version = 1
   cloudstream {
       authors = listOf("YourName")
       language = "en"
       description = "My gay plugin"
       status = 1
       tvTypes = listOf("NSFW")
       iconUrl = "https://example.com/favicon.ico"
   }
   ```
3. Add `src/main/AndroidManifest.xml`:
   ```xml
   <?xml version="1.0" encoding="utf-8"?>
   <manifest xmlns:android="http://schemas.android.com/apk/res/android"/>
   ```
4. Implement `MyPlugin.kt` (extends `MainAPI`) and `MyPluginProvider.kt` (extends `Plugin`)
5. Add an entry to `plugins.json`
6. Push → GitHub Actions builds it automatically

---

## ⚠️ Notes

- `Gayxx` is marked `status = 0` — the source site may be offline
- `Fxggxt` is marked `(VPN)` — may require a VPN in some regions
- **XhamsterVi** targets the Vietnamese xHamster mirror (`vi.xhspot.com`) — separate from the general English xHamster
- After forking, replace `YOUR_GITHUB_USERNAME` in `plugins.json` and `build.gradle.kts`
- The `stremio-addon/` folder is a completely separate Node.js project for Stremio (not Cloudstream)

---

## 📜 Credits

Original plugin authors are credited in each `build.gradle.kts`. Source repositories:
- GayXXX / cloudstream-master
- cs-gayvn_updated
