import SwiftUI
import WidgetKit

extension Color {
  init(hex: UInt32, opacity: Double = 1) {
    self.init(
      .sRGB,
      red: Double((hex >> 16) & 0xFF) / 255,
      green: Double((hex >> 8) & 0xFF) / 255,
      blue: Double(hex & 0xFF) / 255,
      opacity: opacity
    )
  }
}

/// Y2K Pink Chrome tokens, taken from the mockup source (home2.html).
enum Y2K {
  static let hotPink = Color(hex: 0xE0339A)
  static let ink = Color(hex: 0x7D1A63)
  static let chromeEdge = Color(hex: 0xD23A95)
  static let glassTint = Color(hex: 0xFFE1F5)

  /// `.chrome` text gradient: silver-lavender with a bright horizon line.
  static let chrome = LinearGradient(
    stops: [
      .init(color: .white, location: 0),
      .init(color: Color(hex: 0xF5E8FF), location: 0.30),
      .init(color: Color(hex: 0xA79CCC), location: 0.48),
      .init(color: .white, location: 0.53),
      .init(color: Color(hex: 0xD9C9F2), location: 0.76),
      .init(color: Color(hex: 0x9088B6), location: 1),
    ],
    startPoint: .top,
    endPoint: .bottom
  )

  /// Holographic foil used for the default mixtape cover and empty states.
  static let holo = AngularGradient(
    colors: [.white, Color(hex: 0xFFC2EC), Color(hex: 0xC9B8FF), Color(hex: 0xA8E6FF),
             Color(hex: 0xFFF3B0), Color(hex: 0xFFC2EC), .white],
    center: .center,
    startAngle: .degrees(-60),
    endAngle: .degrees(300)
  )
}

/// Geist (SIL Open Font License), bundled in targets/widget/ and listed in Info.plist.
/// Fixed sizes: widgets should match the mockup exactly rather than follow Dynamic Type.
enum Geist {
  static func medium(_ size: CGFloat) -> Font { .custom("Geist-Medium", fixedSize: size) }
  static func semibold(_ size: CGFloat) -> Font { .custom("Geist-SemiBold", fixedSize: size) }
  static func bold(_ size: CGFloat) -> Font { .custom("Geist-Bold", fixedSize: size) }
  static func black(_ size: CGFloat) -> Font { .custom("Geist-Black", fixedSize: size) }
}

/// Chrome lettering with the hot-pink edge and soft drop shadow from the mockup.
struct ChromeText: View {
  let text: String
  let font: Font
  var tracking: CGFloat = 0

  var body: some View {
    Text(text)
      .font(font)
      .tracking(tracking)
      .foregroundStyle(Y2K.chrome)
      .shadow(color: Y2K.chromeEdge, radius: 0, x: 0, y: 1.5)
      .shadow(color: Color(hex: 0x781464, opacity: 0.3), radius: 4, x: 0, y: 4)
      .widgetAccentable()
      .lineLimit(1)
      .minimumScaleFactor(0.5)
  }
}

/// Four-point sparkle, same shape as the wallpaper's.
struct Sparkle: Shape {
  func path(in rect: CGRect) -> Path {
    let c = CGPoint(x: rect.midX, y: rect.midY)
    let r = min(rect.width, rect.height) / 2
    let k = r * 0.16
    var p = Path()
    p.move(to: CGPoint(x: c.x, y: c.y - r))
    p.addQuadCurve(to: CGPoint(x: c.x + r, y: c.y), control: CGPoint(x: c.x + k, y: c.y - k))
    p.addQuadCurve(to: CGPoint(x: c.x, y: c.y + r), control: CGPoint(x: c.x + k, y: c.y + k))
    p.addQuadCurve(to: CGPoint(x: c.x - r, y: c.y), control: CGPoint(x: c.x - k, y: c.y + k))
    p.addQuadCurve(to: CGPoint(x: c.x, y: c.y - r), control: CGPoint(x: c.x - k, y: c.y - k))
    p.closeSubpath()
    return p
  }
}

/// Filled heart on a 24pt grid, matching the mockup glyph.
struct Heart: Shape {
  func path(in rect: CGRect) -> Path {
    let s = min(rect.width, rect.height) / 24
    func pt(_ x: CGFloat, _ y: CGFloat) -> CGPoint { CGPoint(x: rect.minX + x * s, y: rect.minY + y * s) }
    var p = Path()
    p.move(to: pt(12, 20.8))
    p.addCurve(to: pt(3.9, 9.7), control1: pt(12, 20.8), control2: pt(3.9, 15.6))
    p.addCurve(to: pt(12, 6.4), control1: pt(3.9, 5.4), control2: pt(9.3, 3.6))
    p.addCurve(to: pt(20.1, 9.7), control1: pt(14.7, 3.6), control2: pt(20.1, 5.4))
    p.addCurve(to: pt(12, 20.8), control1: pt(20.1, 15.6), control2: pt(12, 20.8))
    p.closeSubpath()
    return p
  }
}

struct PlayTriangle: Shape {
  func path(in rect: CGRect) -> Path {
    let s = min(rect.width, rect.height) / 24
    var p = Path()
    p.move(to: CGPoint(x: rect.minX + 7 * s, y: rect.minY + 4.5 * s))
    p.addLine(to: CGPoint(x: rect.minX + 20 * s, y: rect.minY + 12 * s))
    p.addLine(to: CGPoint(x: rect.minX + 7 * s, y: rect.minY + 19.5 * s))
    p.closeSubpath()
    return p
  }
}
