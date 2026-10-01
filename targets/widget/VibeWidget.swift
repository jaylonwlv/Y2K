import AppIntents
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

struct VibeWidgetIntent: WidgetConfigurationIntent {
  static var title: LocalizedStringResource { "Vibe Card" }
  static var description: IntentDescription { "Pick the widget's style. The photo and caption are set in the app." }

  @Parameter(title: "Style", default: .app)
  var style: WidgetStyleChoice
}

struct VibeProvider: AppIntentTimelineProvider {
  func placeholder(in context: Context) -> VibeEntry {
    VibeEntry(date: .now, settings: VibeSettings(), photo: nil, size: context.displaySize)
  }

  func snapshot(for configuration: VibeWidgetIntent, in context: Context) async -> VibeEntry {
    entry(configuration, context)
  }

  func timeline(for configuration: VibeWidgetIntent, in context: Context) async -> Timeline<VibeEntry> {
    // Content only changes when the app saves new settings, and the app reloads us then.
    Timeline(entries: [entry(configuration, context)], policy: .never)
  }

  private func entry(_ configuration: VibeWidgetIntent, _ context: Context) -> VibeEntry {
    let settings = VibeSettings.load()
    let photo = settings.hasPhoto ? SharedSettings.image("vibe-photo.jpg", maxPixelSize: 1200) : nil
    return VibeEntry(date: .now, settings: settings, photo: photo, size: context.displaySize,
                     theme: configuration.style.theme)
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

/// Background before a photo is picked: holo foil (Y2K), sky to grass (Aero), aurora (Night).
private struct VibePlaceholder: View {
  let theme: AppTheme

  var body: some View {
    switch theme {
    case .y2k:
      ZStack {
        Y2K.holo
        Color.white.opacity(0.25)
      }
    case .aero:
      LinearGradient(colors: [Color(hex: 0xBFE8FF), Color(hex: 0x4FB3F0), Color(hex: 0x8FD45E)],
                     startPoint: .top, endPoint: .bottom)
    case .night:
      LinearGradient(colors: [Color(hex: 0x050B16), Color(hex: 0x0E5A55), Color(hex: 0x1A3F8F)],
                     startPoint: .topLeading, endPoint: .bottomTrailing)
    }
  }
}

struct VibeWidget: Widget {
  let kind = "Y2KVibe"

  var body: some WidgetConfiguration {
    AppIntentConfiguration(kind: kind, intent: VibeWidgetIntent.self, provider: VibeProvider()) { entry in
      VibeWidgetView(entry: entry)
        .containerBackground(for: .widget) {
          if let photo = entry.photo {
            Image(uiImage: photo).resizable().scaledToFill()
          } else {
            VibePlaceholder(theme: entry.theme)
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
