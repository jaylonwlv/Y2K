# Y2K Home

An iOS home-screen customization app with themed wallpapers and matching widgets.
Built with Expo (React Native), plus a native SwiftUI WidgetKit extension.

**First time? Start with [docs/SETUP.md](docs/SETUP.md)**, which goes from this repo to your phone without a Mac.
For day-to-day work, use the `development` build profile (dev client plus Metro). Use `production` for TestFlight.

## What's in v0.1

- **Y2K Pink Chrome** theme: an original holographic wallpaper (1320×2868) you can preview and save to Photos.
- **Chrome Calendar** widget (small): today's date in chrome plus your next two events from the Calendar app, via EventKit.
  The widget has frosted pink glass over a blurred crop of the same wallpaper, so it looks see-through.
  *Edit Widget, then Position* chooses which part of the wallpaper it crops.
- Frutiger Aero and Aero Night appear as "coming soon" cards.

## Layout

| Path | What |
| --- | --- |
| `src/app/` | Screens (Expo Router). `(tabs)/index.tsx` Themes, `(tabs)/widgets.tsx` widget setup, `preview/[id].tsx` full-screen preview. |
| `src/lib/widget-bridge.ts` | Writes settings to the shared App Group and reloads widgets. |
| `targets/widget/` | The SwiftUI widget extension (linked into Xcode by `@bacons/apple-targets` at build time). |
| `tools/art/` | Original wallpaper, icon and splash art as HTML/CSS. `node tools/render-art.mjs` renders it to PNGs in `assets/` (needs Playwright). |
| `eas.json`, `.eas/workflows/` | Cloud build and TestFlight submission. |

`ios/` isn't committed. EAS generates it on every build (`npx expo prebuild`).

## Rules for art

All art and icons are original. No real app logos, no Apple or Microsoft artwork, no Frutiger font,
and only freely licensed fonts.
