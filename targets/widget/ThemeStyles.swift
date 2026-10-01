import AppIntents
import SwiftUI
import WidgetKit

/// The theme the app picked for all widgets (App Group key "theme", written by setWidgetTheme in
/// src/lib/widget-bridge.ts). Mirrors WIDGET_STYLES in src/components/widgets/tokens.ts.
enum AppTheme: String {
  case y2k, aero, night

  static var current: AppTheme { (AppTheme(rawValue: SharedSettings.themeName) ?? .y2k).unlocked }

  /// Aero and Aero Night are Plus; without it widgets fall back to Y2K.
  var unlocked: AppTheme { self == .y2k || SharedSettings.isPlus ? self : .y2k }

  var style: ThemeStyle {
    switch self {
    case .y2k:
      ThemeStyle(
        accent: Y2K.hotPink,
        ink: Y2K.ink,
        numeral: .chrome,
        wallpaper: "wallpaper_y2k",
        glass: [.white.opacity(0.62), Y2K.glassTint.opacity(0.38)],
        glassIsOpaque: false,
        edge: .white.opacity(0.85),
        gloss: false,
        pill: [.white.opacity(0.78), Y2K.glassTint.opacity(0.6)],
        pillEdge: .white.opacity(0.9),
        face: .y2k
      )
    case .aero:
      ThemeStyle(
        accent: Color(hex: 0x0B6FC2),
        ink: Color(hex: 0x063A66),
        numeral: .aqua,
        wallpaper: "wallpaper_aero",
        glass: [.white.opacity(0.72), Color(hex: 0xE1F5FF, opacity: 0.5), Color(hex: 0x96D7F8, opacity: 0.45)],
        glassIsOpaque: false,
        edge: .white.opacity(0.7),
        gloss: true,
        pill: [.white.opacity(0.8), Color(hex: 0xD2F0FF, opacity: 0.65)],
        pillEdge: .white.opacity(0.85),
        face: .aero
      )
    case .night:
      ThemeStyle(
        accent: Color(hex: 0x5FFFE0),
        ink: .white,
        numeral: .neon,
        wallpaper: "",
        glass: [Color(hex: 0x25282E), Color(hex: 0x15171B)],
        glassIsOpaque: true,
        edge: .white.opacity(0.1),
        gloss: false,
        pill: [Color(hex: 0x25282E, opacity: 0.9), Color(hex: 0x15171B, opacity: 0.9)],
        pillEdge: .white.opacity(0.14),
        face: .night
      )
    }
  }
}

/// A widget's own look, picked in Edit Widget. "Match app" follows the theme chosen in the app.
enum WidgetStyleChoice: String, AppEnum {
  case app, y2k, aero, night

  static var typeDisplayRepresentation: TypeDisplayRepresentation { "Style" }
  static var caseDisplayRepresentations: [WidgetStyleChoice: DisplayRepresentation] {
    [.app: "Match app", .y2k: "Y2K Pink Chrome", .aero: "Frutiger Aero", .night: "Aero Night"]
  }

  var theme: AppTheme {
    switch self {
    case .app: .current
    case .y2k: .y2k
    case .aero: AppTheme.aero.unlocked
    case .night: AppTheme.night.unlocked
    }
  }
}

struct ThemeStyle {
  enum Numeral { case chrome, aqua, neon }

  /// Small caps labels, hearts, play buttons.
  let accent: Color
  /// Body text.
  let ink: Color
  let numeral: Numeral
  /// Asset name of the half-size wallpaper the glass blurs (none for Night's opaque glass).
  let wallpaper: String
  let glass: [Color]
  let glassIsOpaque: Bool
  let edge: Color
  /// Aero's glossy top highlight.
  let gloss: Bool
  let pill: [Color]
  let pillEdge: Color
  let face: FaceStyle
}

/// A widget's hero number: chrome in Y2K, thin deep blue in Aero, thin neon white in Night.
struct ThemedNumber: View {
  let text: String
  let size: CGFloat
  let theme: AppTheme

  var body: some View {
    let style = theme.style
    switch style.numeral {
    case .chrome:
      ChromeText(text: text, font: Geist.black(size), tracking: -size * 0.05)
    case .aqua:
      Text(text)
        .font(Geist.light(size * 0.95))
        .tracking(-size * 0.035)
        .foregroundStyle(style.ink)
        .shadow(color: .white.opacity(0.8), radius: 0, x: 0, y: 1)
        .widgetAccentable()
        .lineLimit(1)
        .minimumScaleFactor(0.5)
    case .neon:
      Text(text)
        .font(Geist.light(size * 0.95))
        .tracking(-size * 0.035)
        .foregroundStyle(Color(hex: 0xEAFFFB))
        .shadow(color: Color(hex: 0x5AFFDC, opacity: 0.7), radius: 5)
        .widgetAccentable()
        .lineLimit(1)
        .minimumScaleFactor(0.5)
    }
  }
}

// MARK: - Analog dials

enum FaceStyle {
  case aero, night, nightLit, y2k

  fileprivate var colors: (fill: [Color], ring: Color, hour: Color, minute: Color, tick: Color, text: Color) {
    switch self {
    case .aero:
      ([.white, Color(hex: 0xE6F7FF), Color(hex: 0xB5E2FA)], .white.opacity(0.95),
       Color(hex: 0x073F6E), Color(hex: 0x0B5A96), Color(hex: 0x0B5A96), Color(hex: 0x063A66))
    case .night:
      ([Color(hex: 0x0E1114), Color(hex: 0x0E1114)], Color(hex: 0x5FFFE0, opacity: 0.35),
       Color(hex: 0xE8FFFB), Color(hex: 0xE8FFFB), Color(hex: 0xE8FFFB, opacity: 0.6), Color(hex: 0xE8FFFB))
    case .nightLit:
      ([Color(hex: 0xD9FFF8), Color(hex: 0x8FF5E6), Color(hex: 0x4FD6D0)], .white.opacity(0.6),
       Color(hex: 0x062A2C), Color(hex: 0x062A2C), Color(hex: 0x062A2C, opacity: 0.6), Color(hex: 0x062A2C))
    case .y2k:
      ([.white, Color(hex: 0xEFE9FB), Color(hex: 0xC4BDE0)], .white.opacity(0.95),
       Y2K.ink, Y2K.hotPink, Color(hex: 0xB0267E), Y2K.ink)
    }
  }
}

/// Analog clock face on a 100-unit grid (matches AnalogFace in src/components/widgets/analog-face.tsx).
struct AnalogFace: View {
  let hours: Int
  let minutes: Int
  let style: FaceStyle
  var numerals = false

  var body: some View {
    GeometryReader { proxy in
      let d = min(proxy.size.width, proxy.size.height)
      let u = d / 100
      let c = style.colors
      ZStack {
        Circle()
          .fill(RadialGradient(colors: c.fill, center: UnitPoint(x: 0.35, y: 0.28), startRadius: 0, endRadius: d * 0.8))
        Circle()
          .strokeBorder(c.ring, lineWidth: (style == .aero ? 3 : 1.4) * u)
        ForEach(0..<12, id: \.self) { i in
          if numerals {
            let a = Double(i) * .pi / 6
            Text("\(i == 0 ? 12 : i)")
              .font(Geist.semibold(13 * u))
              .foregroundStyle(c.text)
              .position(x: d / 2 + CGFloat(sin(a)) * 38 * u, y: d / 2 - CGFloat(cos(a)) * 38 * u)
          } else {
            let major = i % 3 == 0
            Capsule()
              .fill(c.tick)
              .frame(width: (major ? 2.2 : 1.4) * u, height: (major ? 6 : 3) * u)
              .offset(y: -(major ? 42 : 43.5) * u)
              .rotationEffect(.degrees(Double(i) * 30))
          }
        }
        hand(degrees: (Double(hours % 12) + Double(minutes) / 60) * 30, length: 25, width: 4.5, color: c.hour, u: u)
        hand(degrees: Double(minutes) * 6, length: 37, width: 2.8, color: c.minute, u: u)
        // Decorative second hand: widgets refresh once a minute.
        hand(degrees: 200, length: 40, width: 1.1, color: Color(hex: 0xFF8A00), u: u, tail: 6)
        Circle()
          .fill(Color(hex: 0xFF8A00))
          .overlay(Circle().stroke(.white, lineWidth: 1.5 * u))
          .frame(width: 8 * u, height: 8 * u)
      }
      .frame(width: d, height: d)
    }
    .aspectRatio(1, contentMode: .fit)
  }

  /// A capsule from just behind the centre out to `length`, rotated about the dial's centre.
  private func hand(degrees: Double, length: CGFloat, width: CGFloat, color: Color, u: CGFloat, tail: CGFloat = 2)
    -> some View
  {
    Capsule()
      .fill(color)
      .frame(width: width * u, height: (length + tail) * u)
      .offset(y: -(length - tail) / 2 * u)
      .rotationEffect(.degrees(degrees))
  }
}

// MARK: - Plus

/// Shown instead of a Plus-only widget (Weather, World Clocks, Vibe Card) until Plus is unlocked.
/// Tapping it opens the paywall.
struct PlusLockedView: View {
  let name: String
  let size: CGSize

  var body: some View {
    let k = mockupScale(size)
    VStack(spacing: 6 * k) {
      Text("PLUS ✧")
        .font(Geist.bold(12 * k))
        .tracking(1.4 * k)
        .foregroundStyle(Y2K.hotPink)
      Text(name)
        .font(Geist.black(20 * k))
        .foregroundStyle(Y2K.ink)
      Text("Tap to unlock in Y2K Home")
        .font(Geist.medium(12 * k))
        .foregroundStyle(Y2K.ink.opacity(0.7))
    }
    .multilineTextAlignment(.center)
    .lineLimit(2)
    .minimumScaleFactor(0.7)
    .padding(14 * k)
    .frame(maxWidth: .infinity, maxHeight: .infinity)
    .widgetURL(AppLink.paywall)
  }
}
