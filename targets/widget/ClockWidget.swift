import AppIntents
import SwiftUI
import WidgetKit

// Chrome digital clock on the same frosted glass as the calendar.

struct ClockWidgetIntent: WidgetConfigurationIntent {
  static var title: LocalizedStringResource { "Chrome Clock" }
  static var description: IntentDescription {
    "Tell the widget where it sits so its glass lines up with your wallpaper."
  }

  @Parameter(title: "Side", default: .right)
  var side: WidgetSide

  @Parameter(title: "Starts on icon row", default: .row1)
  var row: WidgetRow

  var slot: GlassSlot { GlassSlot(side: side, row: row) }
}

struct ClockEntry: TimelineEntry {
  let date: Date
  let slot: GlassSlot
  let size: CGSize
}

struct ClockProvider: AppIntentTimelineProvider {
  func placeholder(in context: Context) -> ClockEntry {
    ClockEntry(date: .now, slot: GlassSlot(side: .right, row: .row1), size: context.displaySize)
  }

  func snapshot(for configuration: ClockWidgetIntent, in context: Context) async -> ClockEntry {
    ClockEntry(date: .now, slot: configuration.slot, size: context.displaySize)
  }

  func timeline(for configuration: ClockWidgetIntent, in context: Context) async -> Timeline<ClockEntry> {
    // One entry per minute for the next hour. Entries are cheap; only reloads count against the budget.
    let calendar = Calendar.current
    let startOfMinute = calendar.dateInterval(of: .minute, for: .now)?.start ?? .now
    let entries = (0..<60).map { offset in
      ClockEntry(date: startOfMinute.addingTimeInterval(Double(offset) * 60),
                 slot: configuration.slot, size: context.displaySize)
    }
    return Timeline(entries: entries, policy: .atEnd)
  }
}

struct ClockWidgetView: View {
  let entry: ClockEntry

  private var uses12h: Bool {
    DateFormatter.dateFormat(fromTemplate: "j", options: 0, locale: .current)?.contains("a") ?? false
  }

  private var time: String {
    let formatter = DateFormatter()
    formatter.locale = .current
    formatter.dateFormat = uses12h ? "h:mm" : "HH:mm"
    return formatter.string(from: entry.date)
  }

  private var detail: String {
    let formatter = DateFormatter()
    formatter.locale = .current
    formatter.setLocalizedDateFormatFromTemplate("MMM d")
    let day = formatter.string(from: entry.date).lowercased()
    guard uses12h else { return "✧ \(day)" }
    let hour = Calendar.current.component(.hour, from: entry.date)
    return "✧ \(hour < 12 ? "am" : "pm") · \(day)"
  }

  var body: some View {
    let k = mockupScale(entry.size)
    VStack(alignment: .leading, spacing: 0) {
      Text(entry.date.formatted(.dateTime.weekday(.wide)).uppercased())
        .font(Geist.bold(14 * k))
        .tracking(0.84 * k)
        .foregroundStyle(Y2K.hotPink)
      Spacer(minLength: 0)
      ChromeText(text: time, font: Geist.black(60 * k), tracking: -3 * k)
        .frame(height: 62 * k)
      Spacer(minLength: 0)
      Text(detail)
        .font(Geist.bold(13.5 * k))
        .foregroundStyle(Y2K.ink)
    }
    .lineLimit(1)
    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
    .padding(18 * k)
  }
}

struct ClockWidget: Widget {
  let kind = "Y2KClock"

  var body: some WidgetConfiguration {
    AppIntentConfiguration(kind: kind, intent: ClockWidgetIntent.self, provider: ClockProvider()) { entry in
      ClockWidgetBody(entry: entry)
    }
    .configurationDisplayName("Chrome Clock")
    .description("The time in big chrome numbers.")
    .supportedFamilies([.systemSmall])
    .contentMarginsDisabled()
  }
}

private struct ClockWidgetBody: View {
  let entry: ClockEntry
  @Environment(\.widgetFamily) private var family

  var body: some View {
    ClockWidgetView(entry: entry)
      .containerBackground(for: .widget) {
        WallpaperGlass(slot: entry.slot, family: family, size: entry.size)
      }
  }
}

#Preview(as: .systemSmall) {
  ClockWidget()
} timeline: {
  ClockEntry(date: .now, slot: GlassSlot(side: .right, row: .row1), size: CGSize(width: 184.4, height: 184.4))
}
