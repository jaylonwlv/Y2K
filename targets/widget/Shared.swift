import Foundation
import ImageIO
import UIKit

/// Settings and files written by the app (src/lib/widget-bridge.ts) into the shared App Group.
enum SharedSettings {
  /// "group.<app bundle id>". The widget's bundle id is "<app bundle id>.widget",
  /// so deriving it keeps a single source of truth in app.json.
  static var appGroup: String {
    let widgetId = Bundle.main.bundleIdentifier ?? ""
    let appId = widgetId.hasSuffix(".widget") ? String(widgetId.dropLast(".widget".count)) : widgetId
    return "group.\(appId)"
  }

  private static var defaults: UserDefaults? { UserDefaults(suiteName: appGroup) }

  /// "y2k", "aero" or "night"; see AppTheme.
  static var themeName: String { defaults?.string(forKey: "theme") ?? "" }

  static var calendarShowsEvents: Bool {
    guard let value = defaults?.object(forKey: "calendar.showEvents") else { return true }
    return (value as? Int ?? 1) != 0
  }

  /// Objects are stored as JSON data by ExtensionStorage.set(key, {...}).
  static func object(_ key: String) -> [String: Any] {
    guard let data = defaults?.data(forKey: key),
          let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any]
    else { return [:] }
    return json
  }

  /// Loads an image the app saved into the shared container, downsampled so it stays well
  /// inside the widget extension's memory limit.
  static func image(_ fileName: String, maxPixelSize: CGFloat) -> UIImage? {
    guard let url = FileManager.default
      .containerURL(forSecurityApplicationGroupIdentifier: appGroup)?
      .appendingPathComponent(fileName),
      let source = CGImageSourceCreateWithURL(url as CFURL, nil)
    else { return nil }
    let options: [CFString: Any] = [
      kCGImageSourceCreateThumbnailFromImageAlways: true,
      kCGImageSourceCreateThumbnailWithTransform: true,
      kCGImageSourceThumbnailMaxPixelSize: maxPixelSize,
    ]
    guard let cgImage = CGImageSourceCreateThumbnailAtIndex(source, 0, options as CFDictionary) else { return nil }
    return UIImage(cgImage: cgImage)
  }
}

struct MixtapeSettings {
  var title = "Baby Tee Summer"
  var subtitle = "y2k mixtape"
  var link = ""
  var hasCover = false

  static func load() -> MixtapeSettings {
    let json = SharedSettings.object("mixtape")
    var settings = MixtapeSettings()
    if let title = json["title"] as? String, !title.isEmpty { settings.title = title }
    if let subtitle = json["subtitle"] as? String { settings.subtitle = subtitle }
    if let link = json["link"] as? String { settings.link = link }
    settings.hasCover = (json["cover"] as? Int ?? 0) != 0
    return settings
  }
}

struct VibeSettings {
  var caption = "main character era"
  var subcaption = "✧ add your photo in the app"
  var hasPhoto = false

  static func load() -> VibeSettings {
    let json = SharedSettings.object("vibe")
    var settings = VibeSettings()
    if let caption = json["caption"] as? String { settings.caption = caption }
    if let subcaption = json["subcaption"] as? String { settings.subcaption = subcaption }
    settings.hasPhoto = (json["photo"] as? Int ?? 0) != 0
    if settings.hasPhoto && json["subcaption"] == nil { settings.subcaption = "" }
    return settings
  }
}

/// Deep links back into the app (see src/app/play.tsx and the widgets tab).
enum AppLink {
  static let widgets = URL(string: "y2khome://widgets")!

  static func play(_ link: String) -> URL {
    var components = URLComponents(string: "y2khome://play")!
    components.queryItems = [URLQueryItem(name: "url", value: link)]
    return components.url ?? widgets
  }
}
