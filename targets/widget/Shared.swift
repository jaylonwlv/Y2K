import Foundation

/// Settings written by the app (via ExtensionStorage in src/lib/widget-bridge.ts)
/// into the shared App Group, read here by the widgets.
enum SharedSettings {
  /// "group.<app bundle id>". The widget's bundle id is "<app bundle id>.widget",
  /// so deriving it keeps a single source of truth in app.json.
  static var appGroup: String {
    let widgetId = Bundle.main.bundleIdentifier ?? ""
    let appId = widgetId.hasSuffix(".widget") ? String(widgetId.dropLast(".widget".count)) : widgetId
    return "group.\(appId)"
  }

  private static var defaults: UserDefaults? { UserDefaults(suiteName: appGroup) }

  static var calendarShowsEvents: Bool {
    guard let value = defaults?.object(forKey: "calendar.showEvents") else { return true }
    return (value as? Int ?? 1) != 0
  }
}
