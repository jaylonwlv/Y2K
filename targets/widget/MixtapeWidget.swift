import AppIntents
import SwiftUI
import UIKit
import WidgetKit

// A song card the user sets up in the app: cover, title, subtitle and a link.
// Widgets can't see what's playing in other apps, so this shows a song you pick. Tapping it
// opens the link (Spotify, Apple Music, YouTube…) through the app.

struct MixtapeWidgetIntent: WidgetConfigurationIntent {
  static var title: LocalizedStringResource { "Mixtape" }
  static var description: IntentDescription {
    "Tell the widget where it sits so its glass lines up with your wallpaper."
  }

  @Parameter(title: "Side", default: .left)
  var side: WidgetSide

  @Parameter(title: "Starts on icon row", default: .row1)
  var row: WidgetRow

  var slot: GlassSlot { GlassSlot(side: side, row: row) }
}

struct MixtapeEntry: TimelineEntry {
  let date: Date
  let settings: MixtapeSettings
  let cover: UIImage?
  let slot: GlassSlot
  let size: CGSize
}

struct MixtapeProvider: AppIntentTimelineProvider {
  func placeholder(in context: Context) -> MixtapeEntry {
    MixtapeEntry(date: .now, settings: MixtapeSettings(), cover: nil,
                 slot: GlassSlot(side: .left, row: .row1), size: context.displaySize)
  }

  func snapshot(for configuration: MixtapeWidgetIntent, in context: Context) async -> MixtapeEntry {
    entry(configuration, context)
  }

  func timeline(for configuration: MixtapeWidgetIntent, in context: Context) async -> Timeline<MixtapeEntry> {
    // Content only changes when the app saves new settings, and the app reloads us then.
    Timeline(entries: [entry(configuration, context)], policy: .never)
  }

  private func entry(_ configuration: MixtapeWidgetIntent, _ context: Context) -> MixtapeEntry {
    let settings = MixtapeSettings.load()
    let cover = settings.hasCover ? SharedSettings.image("mixtape-cover.jpg", maxPixelSize: 300) : nil
    return MixtapeEntry(date: .now, settings: settings, cover: cover, slot: configuration.slot, size: context.displaySize)
  }
}

/// `yMusic` in home2.html.
struct MixtapeWidgetView: View {
  let entry: MixtapeEntry

  var body: some View {
    let k = mockupScale(entry.size)
    VStack(alignment: .leading, spacing: 0) {
      HStack(alignment: .top, spacing: 0) {
        MixtapeCover(image: entry.cover, side: 78 * k)
        Spacer(minLength: 0)
        Heart()
          .fill(Y2K.hotPink)
          .frame(width: 22 * k, height: 22 * k)
      }
      Spacer(minLength: 0)
      HStack(alignment: .bottom, spacing: 6 * k) {
        VStack(alignment: .leading, spacing: 0) {
          Text(entry.settings.title.uppercased())
            .font(Geist.bold(15 * k))
            .tracking(0.15 * k)
            .lineLimit(2)
            .minimumScaleFactor(0.8)
          if !entry.settings.subtitle.isEmpty {
            Text(entry.settings.subtitle)
              .font(Geist.medium(13.5 * k))
              .opacity(0.7)
              .lineLimit(1)
              .padding(.top, 2 * k)
          }
        }
        Spacer(minLength: 0)
        ZStack {
          Circle()
            .fill(.white)
            .shadow(color: Color(hex: 0x962882, opacity: 0.25), radius: 4, x: 0, y: 3)
          PlayTriangle()
            .fill(Y2K.hotPink)
            .frame(width: 18 * k, height: 18 * k)
        }
        .frame(width: 44 * k, height: 44 * k)
      }
    }
    .foregroundStyle(Y2K.ink)
    .padding(.horizontal, 16 * k)
    .padding(.top, 16 * k)
    .padding(.bottom, 30 * k)
    .frame(maxWidth: .infinity, maxHeight: .infinity)
    .overlay(alignment: .bottom) {
      // Decorative progress bar. The widget can't know real playback progress.
      ZStack(alignment: .leading) {
        Y2K.hotPink.opacity(0.15)
        GeometryReader { proxy in
          Y2K.hotPink.frame(width: proxy.size.width * 0.36)
        }
      }
      .frame(height: 3)
    }
    .widgetURL(entry.settings.link.isEmpty ? AppLink.widgets : AppLink.play(entry.settings.link))
  }
}

/// The user's cover art, or the default holographic record.
struct MixtapeCover: View {
  let image: UIImage?
  let side: CGFloat

  var body: some View {
    Group {
      if let image {
        Image(uiImage: image).resizable().scaledToFill()
      } else {
        ZStack {
          Y2K.holo
          // Record grooves: a thin ring every 3 pt of radius, like the mockup's repeating gradient.
          ForEach(1..<19, id: \.self) { i in
            let diameter = CGFloat(i) * 6 * side / 78
            Circle()
              .stroke(Color.white.opacity(0.4), lineWidth: side / 78)
              .frame(width: diameter, height: diameter)
          }
          Circle()
            .fill(Color(hex: 0xFFE3F5))
            .overlay(Circle().stroke(Color.white, lineWidth: side * 0.05))
            .frame(width: side * 0.28, height: side * 0.28)
        }
      }
    }
    .frame(width: side, height: side)
    .clipShape(RoundedRectangle(cornerRadius: side * 12 / 78, style: .continuous))
    .shadow(color: Color(hex: 0x962882, opacity: 0.25), radius: 5, x: 0, y: 4)
  }
}

struct MixtapeWidget: Widget {
  let kind = "Y2KMixtape"

  var body: some WidgetConfiguration {
    AppIntentConfiguration(kind: kind, intent: MixtapeWidgetIntent.self, provider: MixtapeProvider()) { entry in
      MixtapeWidgetBody(entry: entry)
    }
    .configurationDisplayName("Mixtape")
    .description("A song you love, with your own cover. Set it up in the app.")
    .supportedFamilies([.systemSmall])
    .contentMarginsDisabled()
  }
}

private struct MixtapeWidgetBody: View {
  let entry: MixtapeEntry
  @Environment(\.widgetFamily) private var family

  var body: some View {
    MixtapeWidgetView(entry: entry)
      .containerBackground(for: .widget) {
        WallpaperGlass(slot: entry.slot, family: family, size: entry.size)
      }
  }
}

#Preview(as: .systemSmall) {
  MixtapeWidget()
} timeline: {
  MixtapeEntry(date: .now, settings: MixtapeSettings(), cover: nil,
               slot: GlassSlot(side: .left, row: .row1), size: CGSize(width: 184.4, height: 184.4))
}
