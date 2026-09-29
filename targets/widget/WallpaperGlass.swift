import AppIntents
import SwiftUI
import UIKit
import WidgetKit

// MARK: - Where the widget sits

enum WidgetSide: String, AppEnum {
  case left, right

  static var typeDisplayRepresentation: TypeDisplayRepresentation { "Side" }
  static var caseDisplayRepresentations: [WidgetSide: DisplayRepresentation] {
    [.left: "Left", .right: "Right"]
  }
}

/// The icon row the widget's top edge starts on. A small widget covers two icon rows and
/// the home screen has six, so it can start on rows 1–5.
enum WidgetRow: String, AppEnum {
  case row1, row2, row3, row4, row5

  static var typeDisplayRepresentation: TypeDisplayRepresentation { "Starts on icon row" }
  static var caseDisplayRepresentations: [WidgetRow: DisplayRepresentation] {
    [.row1: "1 (top)", .row2: "2", .row3: "3", .row4: "4", .row5: "5"]
  }

  var index: Int {
    switch self {
    case .row1: 0
    case .row2: 1
    case .row3: 2
    case .row4: 3
    case .row5: 4
    }
  }
}

struct GlassSlot: Hashable {
  var side: WidgetSide
  var row: WidgetRow
}

enum HomeGrid {
  /// Frame of a widget on the home screen, in screen points.
  /// Measured from iOS 26 on a 440 × 956 pt iPhone (home2.html): icon columns start at
  /// x = 24 and repeat every 103.4 pt, the first row starts at y = 86 and rows repeat every
  /// 103.4 pt. Other screen sizes are scaled proportionally.
  static func frame(slot: GlassSlot, family: WidgetFamily, size: CGSize, screen: CGSize) -> CGRect {
    let margin = screen.width * 24 / 440
    let pitch = screen.width * 103.4 / 440
    let top = screen.height * 86 / 956
    let x = (family == .systemSmall && slot.side == .right) ? margin + 2 * pitch : margin
    let y = top + CGFloat(slot.row.index) * pitch
    return CGRect(x: x, y: y, width: size.width, height: size.height)
  }
}

// MARK: - Frosted glass

/// The themed glass behind a widget (`.glassw` in the mockup). Y2K and Aero frost a matching crop
/// of the wallpaper, which stands in for backdrop-filter since widgets can't see the real
/// wallpaper; Night's dark tinted glass is opaque.
struct WallpaperGlass: View {
  let slot: GlassSlot
  let family: WidgetFamily
  let size: CGSize
  var theme: AppTheme = .y2k

  @Environment(\.widgetRenderingMode) private var renderingMode

  var body: some View {
    let style = theme.style
    ZStack {
      if !style.glassIsOpaque {
        if renderingMode == .fullColor, let image = UIImage(named: style.wallpaper) {
          wallpaperCrop(image)
            .blur(radius: 18, opaque: true)
            .saturation(1.3)
        } else {
          (theme == .aero ? Color(hex: 0x7FCDF6) : Color(hex: 0xF4C6EC))
        }
      }
      LinearGradient(
        colors: style.glass,
        startPoint: style.glassIsOpaque ? .top : UnitPoint(x: 0.41, y: 0),
        endPoint: style.glassIsOpaque ? .bottom : UnitPoint(x: 0.59, y: 1)
      )
      if style.gloss {
        // Aero's glossy highlight across the top 38 %.
        VStack(spacing: 0) {
          RoundedRectangle(cornerRadius: 30 * mockupScale(size), style: .continuous)
            .fill(LinearGradient(colors: [.white.opacity(0.7), .white.opacity(0)], startPoint: .top, endPoint: .bottom))
            .frame(height: size.height * 0.38)
            .padding(.horizontal, 8 * mockupScale(size))
            .padding(.top, 4 * mockupScale(size))
          Spacer(minLength: 0)
        }
      }
      // 2 pt stroke centred on the edge: the outer half is clipped, leaving a 1 pt inner line.
      ContainerRelativeShape()
        .stroke(style.edge, lineWidth: 2)
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

/// Mockup widgets are 184.4 pt; scale type and spacing down on phones with smaller widgets.
func mockupScale(_ size: CGSize) -> CGFloat {
  guard size.width > 0 else { return 1 }
  return min(1, min(size.width, size.height) / 184.4)
}
