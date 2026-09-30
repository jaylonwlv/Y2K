/** @type {import('@bacons/apple-targets/app.plugin').ConfigFunction} */
module.exports = (config) => ({
  type: 'widget',
  name: 'widget',
  displayName: 'Y2K Widgets',
  bundleIdentifier: '.widget',
  deploymentTarget: '17.0',
  colors: {
    $accent: '#E3268F',
    $widgetBackground: '#F8D3EF',
  },
  images: {
    // Blurred behind the glass to fake a "transparent" widget (see WallpaperGlass.swift).
    // Aero Night's glass is opaque, so it needs no wallpaper here.
    wallpaper_y2k: '../../assets/wallpapers/widget/y2k-pink-chrome-widget.png',
    wallpaper_aero: '../../assets/wallpapers/widget/frutiger-aero-widget.png',
  },
  entitlements: {
    // Same App Group as the app, so the app can hand settings to the widget.
    'com.apple.security.application-groups': config.ios.entitlements['com.apple.security.application-groups'],
    // Live forecasts for the Weather widget. WeatherKit must also be ticked for this App ID
    // (Capabilities and App Services) at developer.apple.com.
    'com.apple.developer.weatherkit': true,
  },
});
