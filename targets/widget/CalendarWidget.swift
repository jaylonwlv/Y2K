import AppIntents
import EventKit
import SwiftUI
import WidgetKit

// MARK: - Configuration

struct CalendarWidgetIntent: WidgetConfigurationIntent {
  static var title: LocalizedStringResource { "Calendar" }
  static var description: IntentDescription {
    "Tell the widget where it sits so its glass lines up with your wallpaper."
  }

  @Parameter(title: "Side", default: .right)
  var side: WidgetSide

  @Parameter(title: "Starts on icon row", default: .row4)
  var row: WidgetRow

  var slot: GlassSlot { GlassSlot(side: side, row: row) }
}

// MARK: - Timeline

struct DayEvent: Hashable {
  let title: String
  let start: Date
  let end: Date
  let isAllDay: Bool
}

enum CalendarAccess {
  case granted, notGranted
}

struct CalendarEntry: TimelineEntry {
  let date: Date
  let events: [DayEvent]
  let access: CalendarAccess
  let showEvents: Bool
  let slot: GlassSlot
  let size: CGSize
  var theme: AppTheme = .current
}

struct CalendarProvider: AppIntentTimelineProvider {
  func placeholder(in context: Context) -> CalendarEntry {
    CalendarEntry(date: .now, events: Self.sampleEvents, access: .granted, showEvents: true,
                  slot: GlassSlot(side: .right, row: .row4), size: context.displaySize)
  }

  func snapshot(for configuration: CalendarWidgetIntent, in context: Context) async -> CalendarEntry {
    var entry = makeEntry(date: .now, slot: configuration.slot, size: context.displaySize)
    // The widget gallery should look alive even before calendar access is granted.
    if context.isPreview && (entry.access == .notGranted || entry.events.isEmpty) {
      entry = CalendarEntry(date: .now, events: Self.sampleEvents, access: .granted, showEvents: true,
                            slot: configuration.slot, size: context.displaySize)
    }
    return entry
  }

  func timeline(for configuration: CalendarWidgetIntent, in context: Context) async -> Timeline<CalendarEntry> {
    let now = Date.now
    let calendar = Calendar.current
    let midnight = calendar.startOfDay(for: calendar.date(byAdding: .day, value: 1, to: now)!)

    // One entry now, one each time an event ends (so the list moves on), one at midnight.
    let first = makeEntry(date: now, slot: configuration.slot, size: context.displaySize)
    var dates = first.events.map(\.end).filter { $0 > now && $0 < midnight }
    dates.append(midnight)
    let entries = [first] + Set(dates).sorted().map {
      makeEntry(date: $0, slot: configuration.slot, size: context.displaySize)
    }

    // Re-read the calendar at least every 30 minutes to pick up edits.
    let refresh = min(midnight, now.addingTimeInterval(30 * 60))
    return Timeline(entries: entries, policy: .after(refresh))
  }

  private func makeEntry(date: Date, slot: GlassSlot, size: CGSize) -> CalendarEntry {
    let showEvents = SharedSettings.calendarShowsEvents
    guard EKEventStore.authorizationStatus(for: .event) == .fullAccess else {
      return CalendarEntry(date: date, events: [], access: .notGranted, showEvents: showEvents, slot: slot, size: size)
    }
    return CalendarEntry(date: date, events: Self.upcomingEvents(after: date), access: .granted,
                         showEvents: showEvents, slot: slot, size: size)
  }

  /// Today's events that haven't finished yet, soonest first.
  static func upcomingEvents(after date: Date) -> [DayEvent] {
    let store = EKEventStore()
    let calendar = Calendar.current
    let start = calendar.startOfDay(for: date)
    let end = calendar.date(byAdding: .day, value: 1, to: start)!
    let predicate = store.predicateForEvents(withStart: start, end: end, calendars: nil)
    return store.events(matching: predicate)
      .filter { $0.endDate > date }
      .sorted { lhs, rhs in
        // Timed events first (they're what you need to leave for), then all-day ones.
        if lhs.isAllDay != rhs.isAllDay { return !lhs.isAllDay }
        return lhs.startDate < rhs.startDate
      }
      .prefix(2)
      .map { DayEvent(title: $0.title ?? "", start: $0.startDate, end: $0.endDate, isAllDay: $0.isAllDay) }
  }

  static var sampleEvents: [DayEvent] {
    let calendar = Calendar.current
    let today = calendar.startOfDay(for: .now)
    let at = { (hour: Int) in calendar.date(byAdding: .hour, value: hour, to: today)! }
    return [
      DayEvent(title: "girls night", start: at(20), end: at(23), isAllDay: false),
      DayEvent(title: "nails", start: at(11), end: at(12), isAllDay: false),
    ]
  }
}

// MARK: - View

/// `yCal` in home2.html.
struct CalendarWidgetView: View {
  let entry: CalendarEntry

  var body: some View {
    let k = mockupScale(entry.size)
    let style = entry.theme.style
    VStack(alignment: .leading, spacing: 0) {
      Text(entry.date.formatted(.dateTime.weekday(.wide)).uppercased())
        .font(Geist.bold(14 * k))
        .tracking(0.84 * k)
        .foregroundStyle(style.accent)
        .lineLimit(1)
        .minimumScaleFactor(0.7)

      ThemedNumber(text: entry.date.formatted(.dateTime.day()), size: 88 * k, theme: entry.theme)
        .frame(height: 84 * k)
        .padding(.top, 2 * k)

      if entry.showEvents {
        Text(lines.0)
          .font(Geist.bold(13.5 * k))
          .padding(.top, 6 * k)
        Text(lines.1)
          .font(Geist.medium(13 * k))
          .opacity(0.65)
      }
      Spacer(minLength: 0)
    }
    .lineLimit(1)
    .foregroundStyle(style.ink)
    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
    .padding(18 * k)
    .widgetURL(entry.access == .notGranted ? AppLink.widgets : nil)
  }

  private var lines: (String, String) {
    if entry.access == .notGranted {
      return ("✧ tap to connect", "your calendar ♡")
    }
    switch entry.events.count {
    case 0:
      return ("✧ no plans today", "main character day ♡")
    case 1:
      let event = entry.events[0]
      return ("✧ \(event.title) \(Self.time(event))", "that's it ♡")
    default:
      let (first, second) = (entry.events[0], entry.events[1])
      let secondTime = second.isAllDay ? "" : " at \(Self.time(second))"
      return ("✧ \(first.title) \(Self.time(first))", "\(second.title)\(secondTime) ♡")
    }
  }

  /// "8PM", "8:30PM" or "20:00", following the user's 12/24-hour setting.
  static func time(_ event: DayEvent) -> String {
    if event.isAllDay { return "" }
    return shortTime(event.start)
  }
}

func shortTime(_ date: Date) -> String {
  let uses12h = DateFormatter.dateFormat(fromTemplate: "j", options: 0, locale: .current)?.contains("a") ?? false
  let formatter = DateFormatter()
  formatter.locale = .current
  if uses12h {
    let minute = Calendar.current.component(.minute, from: date)
    formatter.dateFormat = minute == 0 ? "ha" : "h:mma"
    formatter.amSymbol = "AM"
    formatter.pmSymbol = "PM"
  } else {
    formatter.dateFormat = "HH:mm"
  }
  return formatter.string(from: date)
}

// MARK: - Widget

struct CalendarWidget: Widget {
  let kind = "Y2KCalendar"

  var body: some WidgetConfiguration {
    AppIntentConfiguration(kind: kind, intent: CalendarWidgetIntent.self, provider: CalendarProvider()) { entry in
      CalendarWidgetBody(entry: entry)
    }
    .configurationDisplayName("Calendar")
    .description("Today's date, big, plus what's next from your calendar.")
    .supportedFamilies([.systemSmall])
    .contentMarginsDisabled()
  }
}

private struct CalendarWidgetBody: View {
  let entry: CalendarEntry
  @Environment(\.widgetFamily) private var family

  var body: some View {
    CalendarWidgetView(entry: entry)
      .containerBackground(for: .widget) {
        WallpaperGlass(slot: entry.slot, family: family, size: entry.size, theme: entry.theme)
      }
  }
}

#Preview(as: .systemSmall) {
  CalendarWidget()
} timeline: {
  CalendarEntry(date: .now, events: CalendarProvider.sampleEvents, access: .granted, showEvents: true,
                slot: GlassSlot(side: .right, row: .row4), size: CGSize(width: 184.4, height: 184.4))
  CalendarEntry(date: .now, events: [], access: .notGranted, showEvents: true,
                slot: GlassSlot(side: .right, row: .row4), size: CGSize(width: 184.4, height: 184.4))
}
