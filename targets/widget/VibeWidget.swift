import SwiftUI
import UIKit
import WidgetKit

// The user's own photo, full bleed, with a frosted caption. Set up in the app.

struct VibeEntry: TimelineEntry {
  let date: Date
  let settings: VibeSettings
  let photo: UIImage?
  let size: CGSize
  var theme: AppTheme = .current
}

struct VibeProvider: TimelineProvider {
  func placeholder(in context: Context) -> VibeEntry {
    VibeEntry(date: .now, settings: VibeSettings(), photo: nil, size: context.displaySize)
  }

  func getSnapshot(in context: Context, completion: @escaping (VibeEntry) -> Void) {
    completion(entry(context))
  }

  func getTimeline(in context: Context, completion: @escaping (Timeline<VibeEntry>) -> Void) {
    // Content only changes when the app saves new settings, and the app reloads us then.
    completion(Timeline(entries: [entry(context)], policy: .never))
  }

  private func entry(_ context: Context) -> VibeEntry {
    let settings = VibeSettings.load()
    let photo = settings.hasPhoto ? SharedSettings.image("vibe-photo.jpg", maxPixelSize: 1200) : nil
    return VibeEntry(date: .now, settings: settings, photo: photo, size: context.displaySize)
  }
}

struct VibeWidgetView: View {
  let entry: VibeEntry

  var body: some View {
    let k = mockupScale(entry.size)
    let style = entry.theme.style
    VStack(alignment: .leading, spacing: 0) {
      HStack {
        Spacer()
        Sparkle()
          .fill(.white)
          .frame(width: 16 * k, height: 16 * k)
          .shadow(color: .white, radius: 4)
      }
      Spacer(minLength: 0)
      if !entry.settings.caption.isEmpty || !entry.settings.subcaption.isEmpty {
        VStack(alignment: .leading, spacing: 1 * k) {
          if !entry.settings.caption.isEmpty {
            Text(entry.settings.caption)
              .font(Geist.bold(14 * k))
              .foregroundStyle(style.ink)
          }
          if !entry.settings.subcaption.isEmpty {
            Text(entry.settings.subcaption)
              .font(Geist.medium(12 * k))
              .foregroundStyle(style.ink.opacity(0.7))
          }
        }
        .lineLimit(1)
        .minimumScaleFactor(0.8)
        .padding(.horizontal, 12 * k)
        .padding(.vertical, 9 * k)
        .background {
          RoundedRectangle(cornerRadius: 16 * k, style: .continuous)
            .fill(LinearGradient(colors: style.pill, startPoint: .top, endPoint: .bottom))
            .overlay(
              RoundedRectangle(cornerRadius: 16 * k, style: .continuous)
                .stroke(style.pillEdge, lineWidth: 1)
            )
            .shadow(color: Color(hex: 0xA03278, opacity: 0.18), radius: 8, x: 0, y: 4)
        }
      }
    }
    .padding(14 * k)
    .frame(maxWidth: .infinity, maxHeight: .infinity)
    .widgetURL(AppLink.widgets)
  }
}

struct VibeWidget: Widget {
  let kind = "Y2KVibe"

  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: VibeProvider()) { entry in
      VibeWidgetView(entry: entry)
        .containerBackground(for: .widget) {
          if let photo = entry.photo {
            Image(uiImage: photo).resizable().scaledToFill()
          } else {
            ZStack {
              Y2K.holo
              Color.white.opacity(0.25)
            }
          }
        }
    }
    .configurationDisplayName("Vibe Card")
    .description("Your own photo with a caption. Pick them in the app.")
    .supportedFamilies([.systemSmall, .systemMedium])
    .contentMarginsDisabled()
  }
}

#Preview(as: .systemSmall) {
  VibeWidget()
} timeline: {
  VibeEntry(date: .now, settings: VibeSettings(), photo: nil, size: CGSize(width: 184.4, height: 184.4))
}
