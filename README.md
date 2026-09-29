# Y2K Home

An iOS home-screen customization app with themed wallpapers and matching widgets.
Built with Expo (React Native), plus a native SwiftUI WidgetKit extension.

**First time? Start with [docs/SETUP.md](docs/SETUP.md)**, which goes from this repo to your phone without a Mac.
For day-to-day work, use the `development` build profile (dev client plus Metro). Use `production` for TestFlight.

## What's in v0.3

- **Y2K Pink Chrome** theme: an original holographic wallpaper (1320×2868) you can preview and save to Photos.
- **Home-screen preview**: the full themed home screen (widgets, 12 chrome and jelly-pink icons, search, dock)
  on the real grid, with **Shuffle** between the four layouts in `home2.html`.
- **Export for TikTok**: a 1080×1920 post (hook line, blurred backdrop, phone frame) you can save to Photos or share.
- **Widgets**, all built to the mockup in `home2.html` (Geist font, chrome lettering, frosted pink glass):
  - **Chrome Calendar** (small): today's date plus your next two events from the Calendar app.
  - **Mixtape** (small): a song you pick, with your own cover. Tapping it opens the song link.
  - **Vibe Card** (small and medium): your photo with a caption.
  - **Chrome Clock** (small).
- The glass is a blurred crop of the wallpaper. *Edit Widget › Side / Starts on icon row* tells a widget where it sits.
  The grid comes from iOS 26 measurements (`src/lib/home-grid.ts`, `targets/widget/WallpaperGlass.swift`).
- Frutiger Aero and Aero Night appear as "coming soon" cards.

## Layout

| Path | What |
| --- | --- |
| `src/app/` | Screens (Expo Router). `(tabs)/index.tsx` Themes, `(tabs)/widgets.tsx` widget setup, `preview/[id].tsx` full-screen preview, `export/[id].tsx` TikTok export. |
| `src/components/home/` | The themed home screen: original icon glyphs, chrome/jelly icons, layouts, TikTok post. |
| `src/lib/widget-bridge.ts` | Writes settings to the shared App Group and reloads widgets. |
| `targets/widget/` | The SwiftUI widget extension (linked into Xcode by `@bacons/apple-targets` at build time). |
| `home2.html` | The visual spec: mockups with the measured iOS 26 grid. |
| `tools/art/` | Original wallpaper, icon and splash art as HTML/CSS. `node tools/render-art.mjs` renders it to PNGs in `assets/` (needs Playwright). |
| `eas.json`, `.eas/workflows/` | Cloud build and TestFlight submission. |

`ios/` isn't committed. EAS generates it on every build (`npx expo prebuild`).

## Rules for art

All art and icons are original. No real app logos, no Apple or Microsoft artwork, no Frutiger font,
and only freely licensed fonts.
