import AppIntents
import SwiftUI
import WidgetKit

// Home plus three cities on analog dials: the hero of the Aero Night mockup. Dials light up
// where it's daytime. Defaults match DEFAULT_CITIES in src/lib/world-time.ts.

enum WorldCity: String, AppEnum {
  case losAngeles, newYork, saoPaulo, london, paris, berlin, lagos, dubai, mumbai, bangkok, seoul, tokyo, sydney

  static var typeDisplayRepresentation: TypeDisplayRepresentation { "City" }
  static var caseDisplayRepresentations: [WorldCity: DisplayRepresentation] {
    [
      .losAngeles: "Los Angeles", .newYork: "New York", .saoPaulo: "São Paulo", .london: "London",
      .paris: "Paris", .berlin: "Berlin", .lagos: "Lagos", .dubai: "Dubai", .mumbai: "Mumbai",
      .bangkok: "Bangkok", .seoul: "Seoul", .tokyo: "Tokyo", .sydney: "Sydney",
    ]
  }

  var name: String {
    switch self {
    case .losAngeles: "Los Angeles"
    case .newYork: "New York"
    case .saoPaulo: "São Paulo"
    case .london: "London"
    case .paris: "Paris"
    case .berlin: "Berlin"
    case .lagos: "Lagos"
    case .dubai: "Dubai"
    case .mumbai: "Mumbai"
    case .bangkok: "Bangkok"
    case .seoul: "Seoul"
    case .tokyo: "Tokyo"
    case .sydney: "Sydney"
    }
  }

  var timeZone: TimeZone {
    let id =
      switch self {
      case .losAngeles: "America/Los_Angeles"
      case .newYork: "America/New_York"
      case .saoPaulo: "America/Sao_Paulo"
      case .london: "Europe/London"
      case .paris: "Europe/Paris"
      case .berlin: "Europe/Berlin"
      case .lagos: "Africa/Lagos"
      case .dubai: "Asia/Dubai"
      case .mumbai: "Asia/Kolkata"
      case .bangkok: "Asia/Bangkok"
      case .seoul: "Asia/Seoul"
      case .tokyo: "Asia/Tokyo"
      case .sydney: "Australia/Sydney"
      }
    return TimeZone(identifier: id) ?? .current
  }
}

struct WorldClocksIntent: WidgetConfigurationIntent {
  static var title: LocalizedStringResource { "World Clocks" }
  static var description: IntentDescription {
    "Pick three cities, and the row the widget starts on so its glass lines up with your wallpaper."
  }

  @Parameter(title: "City 1", default: .newYork)
  var city1: WorldCity

  @Parameter(title: "City 2", default: .london)
  var city2: WorldCity

  @Parameter(title: "City 3", default: .tokyo)
  var city3: WorldCity

  @Parameter(title: "Starts on icon row", default: .row1)
  var row: WidgetRow

  @Parameter(title: "Style", default: .app)
  var style: WidgetStyleChoice
}

struct ClockCity: Hashable {
  let name: String
  let timeZone: TimeZone
}

struct WorldClocksEntry: TimelineEntry {
  let date: Date
  let cities: [ClockCity]
  let slot: GlassSlot
  let size: CGSize
  var theme: AppTheme = .current
}

struct WorldClocksProvider: AppIntentTimelineProvider {
  func placeholder(in context: Context) -> WorldClocksEntry {
    WorldClocksEntry(date: .now, cities: Self.cities(.newYork, .london, .tokyo),
                     slot: GlassSlot(side: .left, row: .row1), size: context.displaySize)
  }

  func snapshot(for configuration: WorldClocksIntent, in context: Context) async -> WorldClocksEntry {
    entry(at: .now, configuration, context)
  }

  func timeline(for configuration: WorldClocksIntent, in context: Context) async -> Timeline<WorldClocksEntry> {
    // One entry per minute for the next hour.
    let start = Calendar.current.dateInterval(of: .minute, for: .now)?.start ?? .now
    let entries = (0..<60).map { entry(at: start.addingTimeInterval(Double($0) * 60), configuration, context) }
    return Timeline(entries: entries, policy: .atEnd)
  }

  private func entry(at date: Date, _ configuration: WorldClocksIntent, _ context: Context) -> WorldClocksEntry {
    WorldClocksEntry(date: date, cities: Self.cities(configuration.city1, configuration.city2, configuration.city3),
                     slot: GlassSlot(side: .left, row: configuration.row), size: context.displaySize,
                     theme: configuration.style.theme)
  }

  static func cities(_ cities: WorldCity...) -> [ClockCity] {
    [ClockCity(name: "Home", timeZone: .current)] + cities.map { ClockCity(name: $0.name, timeZone: $0.timeZone) }
  }
}

struct WorldClocksView: View {
  let entry: WorldClocksEntry

  var body: some View {
    let k = mockupScale(entry.size)
    let style = entry.theme.style
    HStack(spacing: 0) {
      ForEach(entry.cities, id: \.self) { city in
        let time = CityTime(date: entry.date, timeZone: city.timeZone)
        VStack(spacing: 0) {
          AnalogFace(hours: time.hour, minutes: time.minute, style: faceStyle(isDay: time.isDay), numerals: true)
            .frame(width: 78 * k, height: 78 * k)
          Text(city.name)
            .font(Geist.semibold(14 * k))
            .padding(.top, 8 * k)
          Group {
            Text(time.day)
            Text(time.offset)
          }
          .font(Geist.medium(13 * k))
          .opacity(0.55)
        }
        .lineLimit(1)
        .minimumScaleFactor(0.7)
        .frame(maxWidth: .infinity)
      }
    }
    .foregroundStyle(style.ink)
    .padding(.horizontal, 8 * k)
    .frame(maxWidth: .infinity, maxHeight: .infinity)
  }

  private func faceStyle(isDay: Bool) -> FaceStyle {
    switch entry.theme {
    case .night: isDay ? .nightLit : .night
    case .aero: .aero
    case .y2k: .y2k
    }
  }
}

/// Wall-clock time in a time zone, and how it relates to local time ("+3HRS", "Tomorrow").
struct CityTime {
  let hour: Int
  let minute: Int
  let day: String
  let offset: String
  let isDay: Bool

  init(date: Date, timeZone: TimeZone) {
    var calendar = Calendar.current
    calendar.timeZone = timeZone
    let parts = calendar.dateComponents([.hour, .minute, .year, .month, .day], from: date)
    hour = parts.hour ?? 0
    minute = parts.minute ?? 0
    isDay = (6..<18).contains(hour)

    let seconds = timeZone.secondsFromGMT(for: date) - TimeZone.current.secondsFromGMT(for: date)
    let hours = Double(seconds) / 3600
    let number = hours.rounded() == hours ? String(Int(hours)) : String(format: "%.1f", hours)
    offset = "\(hours >= 0 ? "+" : "")\(number)HRS"

    // Compare calendar days: the city's date vs. the local date.
    let local = Calendar.current.dateComponents([.year, .month, .day], from: date)
    let there = DateComponents(year: parts.year, month: parts.month, day: parts.day)
    let gregorian = Calendar(identifier: .gregorian)
    if let a = gregorian.date(from: local), let b = gregorian.date(from: there) {
      let diff = gregorian.dateComponents([.day], from: a, to: b).day ?? 0
      day = diff == 0 ? "Today" : diff > 0 ? "Tomorrow" : "Yesterday"
    } else {
      day = "Today"
    }
  }
}

struct WorldClocksWidget: Widget {
  let kind = "Y2KWorldClocks"

  var body: some WidgetConfiguration {
    AppIntentConfiguration(kind: kind, intent: WorldClocksIntent.self, provider: WorldClocksProvider()) { entry in
      WorldClocksBody(entry: entry)
    }
    .configurationDisplayName("World Clocks")
    .description("Home and three cities on analog dials. Dials light up where it's daytime.")
    .supportedFamilies([.systemMedium])
    .contentMarginsDisabled()
  }
}

private struct WorldClocksBody: View {
  let entry: WorldClocksEntry
  @Environment(\.widgetFamily) private var family

  var body: some View {
    WorldClocksView(entry: entry)
      .containerBackground(for: .widget) {
        WallpaperGlass(slot: entry.slot, family: family, size: entry.size, theme: entry.theme)
      }
  }
}

#Preview(as: .systemMedium) {
  WorldClocksWidget()
} timeline: {
  WorldClocksEntry(date: .now, cities: WorldClocksProvider.cities(.newYork, .london, .tokyo),
                   slot: GlassSlot(side: .left, row: .row1), size: CGSize(width: 391.2, height: 184.4), theme: .night)
}
