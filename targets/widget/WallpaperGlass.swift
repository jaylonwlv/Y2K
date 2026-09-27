import AppIntents
import SwiftUI
import UIKit
import WidgetKit

/// Where the widget sits on the home screen. Widgets can't see the real wallpaper, so we
/// crop the same wallpaper image at this position and frost it to fake transparency.
enum WidgetSlot: String, AppEnum {
  case topLeft, topRight, middleLeft, middleRight, bottomLeft, bottomRight

  static var typeDisplayRepresentation: TypeDisplayRepresentation { "Position" }
  static var caseDisplayRepresentations: [WidgetSlot: DisplayRepresentation] {
    [
      .topLeft: "Top left", .topRight: "Top right",
      .middleLeft: "Middle left", .middleRight: "Middle right",
      .bottomLeft: "Bottom left", .bottomRight: "Bottom right",
    ]
  }

  var isRight: Bool { self == .topRight || self == .middleRight || self == .bottomRight }
  var row: Int {
    switch self {
    case .topLeft, .topRight: 0
    case .middleLeft, .middleRight: 1
    case .bottomLeft, .bottomRight: 2
    }
  }
}

enum HomeGrid {
  /// Approximate frame of a widget on the home screen, in screen points.
  /// Proportions measured from iPhone home screens (14/15/16 generation): the gap between
  /// widgets is ~14% of a small widget, the first row starts ~10% down the screen and rows
  /// repeat every ~1.25 small-widget heights. The frosted blur hides small errors.
  static func frame(slot: WidgetSlot, family: WidgetFamily, size: CGSize, screen: CGSize) -> CGRect {
    let small = family == .systemSmall ? size.width : size.height
    let gap = small * 0.141
    let left = (screen.width - 2 * small - gap) / 2
    let x = (family == .systemSmall && slot.isRight) ? left + small + gap : left
    let y = screen.height * 0.101 + CGFloat(slot.row) * small * 1.247
    return CGRect(x: x, y: y, width: size.width, height: size.height)
  }
}

/// Frosted pink glass over the matching crop of the wallpaper.
struct WallpaperGlass: View {
  let imageName: String
  let slot: WidgetSlot
  let family: WidgetFamily
  let size: CGSize

  @Environment(\.widgetRenderingMode) private var renderingMode

  var body: some View {
    ZStack {
      if renderingMode == .fullColor, let image = UIImage(named: imageName) {
        wallpaperCrop(image)
          .blur(radius: 14, opaque: true)
      }
      LinearGradient(colors: [Y2K.glassTop.opacity(0.62), Y2K.glassBottom.opacity(0.5)],
                     startPoint: .top, endPoint: .bottom)
      ContainerRelativeShape()
        .stroke(Color.white.opacity(0.85), lineWidth: 3)
    }
  }

  private func wallpaperCrop(_ image: UIImage) -> some View {
    let screen = UIScreen.main.bounds.size
    let rect = HomeGrid.frame(slot: slot, family: family, size: size, screen: screen)
    // iOS aspect-fills the wallpaper, centred.
    let scale = max(screen.width / image.size.width, screen.height / image.size.height)
    let drawn = CGSize(width: image.size.width * scale, height: image.size.height * scale)
    let origin = CGPoint(x: (screen.width - drawn.width) / 2, y: (screen.height - drawn.height) / 2)
    return Image(uiImage: image)
      .resizable()
      .frame(width: drawn.width, height: drawn.height)
      .offset(x: origin.x - rect.minX, y: origin.y - rect.minY)
      .frame(width: size.width, height: size.height, alignment: .topLeading)
      .clipped()
  }
}
