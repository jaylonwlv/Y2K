import SwiftUI

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

/// Y2K Pink Chrome palette, matched to the mockups.
enum Y2K {
  static let hotPink = Color(hex: 0xE3268F)
  static let plum = Color(hex: 0x6E1B5E)
  static let plumSoft = Color(hex: 0x9E4F8C)
  static let glassTop = Color(hex: 0xFDE8F8)
  static let glassBottom = Color(hex: 0xF6CBEE)

  /// Silver-lavender chrome with a dark horizon band, like a polished sphere.
  static let chrome = LinearGradient(
    stops: [
      .init(color: .white, location: 0),
      .init(color: Color(hex: 0xEDE9F7), location: 0.36),
      .init(color: Color(hex: 0x9A93C2), location: 0.52),
      .init(color: Color(hex: 0xD6D0EB), location: 0.64),
      .init(color: .white, location: 0.92),
    ],
    startPoint: .top,
    endPoint: .bottom
  )
}
