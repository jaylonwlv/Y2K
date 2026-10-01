# Y2K Home

An iOS home-screen customization app with themed wallpapers and matching widgets.
Built with Expo (React Native), plus a native SwiftUI WidgetKit extension.

**First time? Start with [docs/SETUP.md](docs/SETUP.md)**, which goes from this repo to your phone without a Mac.
For day-to-day work, use the `development` build profile (dev client plus Metro). Use `production` for TestFlight.

## What's in v0.4

- **Three themes**, each with an original wallpaper (1320×2868), themed icons and a matching home layout:
  - **Y2K Pink Chrome**: holo foil, chrome spheres, chrome and jelly-pink icons.
  - **Frutiger Aero**: sky, sea, grassy hills and bubbles, glossy aqua icons.
  - **Aero Night**: aurora and stars, dark tinted tiles with neon glyphs.
- **Home-screen preview** of each theme on the real grid, with **Shuffle** between layouts and **Use theme**
  (switches every widget to the theme and saves its wallpaper to Photos).
- **Icon packs**: save themed icons to Photos, then either **Install all at once** (one unsigned configuration
  profile of Web Clips that open each app by URL scheme, handed to Safari by the local `modules/profile-server`
  module; app list in `src/lib/app-links.ts`) or set them up one by one with the Shortcuts walkthrough.
- **Export for TikTok**: a 1080×1920 post with theme-specific hook lines, saved to Photos or shared.
- **Widgets** that restyle with the chosen theme (glass, colours, numbers), all built to `home2.html`:
  - **Calendar** (small): today's date plus your next two events.
  - **Mixtape** (small): a song you pick, with your own cover. Tapping it opens the song link.
  - **Vibe Card** (small and medium): your photo with a caption.
  - **Clock** (small): chrome digital in Y2K, an analog dial in Aero and Aero Night.
  - **World Clocks** (medium): home plus three cities you pick; dials light up where it's daytime.
  - **Weather** (small, medium): live WeatherKit forecast for a city you pick with Edit Widget, refreshed every 30 minutes. Needs WeatherKit ticked (Capabilities and App Services) for `com.jaylonwlv.y2khome.widget` at developer.apple.com.
- The glass is a blurred crop of the wallpaper (Night's is opaque). *Edit Widget › Side / Starts on icon row*
  tells a widget where it sits. The grid comes from iOS 26 measurements (`src/lib/home-grid.ts`).
- Previews and exports show sample weather for real cities (San Diego for Aero, Reykjavík for Aero Night).

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
