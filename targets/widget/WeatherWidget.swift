import AppIntents
import CoreLocation
import SwiftUI
import UIKit
import WeatherKit
import WidgetKit

// Live weather for a city you pick, from WeatherKit: the weather card from the Frutiger Aero
// mockup, drawn in the current theme. Medium adds the hourly row (WeatherPreview in
// src/components/widgets/weather-preview.tsx is its app-side look-alike).

enum WeatherCity: String, AppEnum {
  case atlanta, bangkok, berlin, boston, chicago, dallas, denver, dubai, honolulu, houston, lagos, lasVegas,
       london, losAngeles, mexicoCity, miami, mumbai, newYork, paris, phoenix, reykjavik, sanDiego,
       sanFrancisco, saoPaulo, seattle, seoul, sydney, tokyo, toronto, washington

  static var typeDisplayRepresentation: TypeDisplayRepresentation { "City" }
  static var caseDisplayRepresentations: [WeatherCity: DisplayRepresentation] {
    [
      .atlanta: "Atlanta", .bangkok: "Bangkok", .berlin: "Berlin", .boston: "Boston", .chicago: "Chicago",
      .dallas: "Dallas", .denver: "Denver", .dubai: "Dubai", .honolulu: "Honolulu", .houston: "Houston",
      .lagos: "Lagos", .lasVegas: "Las Vegas", .london: "London", .losAngeles: "Los Angeles",
      .mexicoCity: "Mexico City", .miami: "Miami", .mumbai: "Mumbai", .newYork: "New York", .paris: "Paris",
      .phoenix: "Phoenix", .reykjavik: "Reykjavík", .sanDiego: "San Diego", .sanFrancisco: "San Francisco",
      .saoPaulo: "São Paulo", .seattle: "Seattle", .seoul: "Seoul", .sydney: "Sydney", .tokyo: "Tokyo",
      .toronto: "Toronto", .washington: "Washington, D.C.",
    ]
  }

  struct Place {
    let name: String
    let latitude: Double
    let longitude: Double
    let timeZone: TimeZone
  }

  var place: Place {
    let (name, lat, lon, zone): (String, Double, Double, String) =
      switch self {
      case .atlanta: ("Atlanta", 33.7490, -84.3880, "America/New_York")
      case .bangkok: ("Bangkok", 13.7563, 100.5018, "Asia/Bangkok")
      case .berlin: ("Berlin", 52.5200, 13.4050, "Europe/Berlin")
      case .boston: ("Boston", 42.3601, -71.0589, "America/New_York")
      case .chicago: ("Chicago", 41.8781, -87.6298, "America/Chicago")
      case .dallas: ("Dallas", 32.7767, -96.7970, "America/Chicago")
      case .denver: ("Denver", 39.7392, -104.9903, "America/Denver")
      case .dubai: ("Dubai", 25.2048, 55.2708, "Asia/Dubai")
      case .honolulu: ("Honolulu", 21.3069, -157.8583, "Pacific/Honolulu")
      case .houston: ("Houston", 29.7604, -95.3698, "America/Chicago")
      case .lagos: ("Lagos", 6.5244, 3.3792, "Africa/Lagos")
      case .lasVegas: ("Las Vegas", 36.1699, -115.1398, "America/Los_Angeles")
      case .london: ("London", 51.5074, -0.1278, "Europe/London")
      case .losAngeles: ("Los Angeles", 34.0522, -118.2437, "America/Los_Angeles")
      case .mexicoCity: ("Mexico City", 19.4326, -99.1332, "America/Mexico_City")
      case .miami: ("Miami", 25.7617, -80.1918, "America/New_York")
      case .mumbai: ("Mumbai", 19.0760, 72.8777, "Asia/Kolkata")
      case .newYork: ("New York", 40.7128, -74.0060, "America/New_York")
      case .paris: ("Paris", 48.8566, 2.3522, "Europe/Paris")
      case .phoenix: ("Phoenix", 33.4484, -112.0740, "America/Phoenix")
      case .reykjavik: ("Reykjavík", 64.1466, -21.9426, "Atlantic/Reykjavik")
      case .sanDiego: ("San Diego", 32.7157, -117.1611, "America/Los_Angeles")
      case .sanFrancisco: ("San Francisco", 37.7749, -122.4194, "America/Los_Angeles")
      case .saoPaulo: ("São Paulo", -23.5505, -46.6333, "America/Sao_Paulo")
      case .seattle: ("Seattle", 47.6062, -122.3321, "America/Los_Angeles")
      case .seoul: ("Seoul", 37.5665, 126.9780, "Asia/Seoul")
      case .sydney: ("Sydney", -33.8688, 151.2093, "Australia/Sydney")
      case .tokyo: ("Tokyo", 35.6762, 139.6503, "Asia/Tokyo")
      case .toronto: ("Toronto", 43.6532, -79.3832, "America/Toronto")
      case .washington: ("Washington", 38.9072, -77.0369, "America/New_York")
      }
    return Place(name: name, latitude: lat, longitude: lon, timeZone: TimeZone(identifier: zone) ?? .current)
  }
}

struct WeatherWidgetIntent: WidgetConfigurationIntent {
  static var title: LocalizedStringResource { "Weather" }
  static var description: IntentDescription {
    "Pick a city, and where the widget sits so its glass lines up with your wallpaper."
  }

  @Parameter(title: "City", default: .sanDiego)
  var city: WeatherCity

  @Parameter(title: "Side (small size)", default: .left)
  var side: WidgetSide

  @Parameter(title: "Starts on icon row", default: .row1)
  var row: WidgetRow

  @Parameter(title: "Style", default: .app)
  var style: WidgetStyleChoice

  var slot: GlassSlot { GlassSlot(side: side, row: row) }
}

// MARK: - Data

struct WeatherHour: Hashable {
  let label: String
  let temperature: Int
  let symbol: String
}

struct WeatherReport {
  let city: String
  let temperature: Int
  let symbol: String
  let condition: String
  let high: Int
  let low: Int
  let hours: [WeatherHour]

  /// Widget gallery and placeholder: a sunny San Diego morning, as in the mockup.
  static let sample = WeatherReport(
    city: "San Diego", temperature: 72, symbol: "sun.max", condition: "Sunny", high: 76, low: 66,
    hours: [
      WeatherHour(label: "Now", temperature: 72, symbol: "sun.max"),
      WeatherHour(label: "10AM", temperature: 73, symbol: "sun.max"),
      WeatherHour(label: "11AM", temperature: 74, symbol: "sun.max"),
      WeatherHour(label: "12PM", temperature: 75, symbol: "cloud.sun"),
      WeatherHour(label: "1PM", temperature: 76, symbol: "cloud.sun"),
      WeatherHour(label: "2PM", temperature: 76, symbol: "sun.max"),
    ]
  )

  static func fetch(_ city: WeatherCity) async throws -> WeatherReport {
    let place = city.place
    let location = CLLocation(latitude: place.latitude, longitude: place.longitude)
    let (current, hourly, daily) = try await WeatherService.shared.weather(
      for: location, including: .current, .hourly, .daily
    )

    let unit: UnitTemperature = Locale.current.measurementSystem == .us ? .fahrenheit : .celsius
    func degrees(_ value: Measurement<UnitTemperature>) -> Int { Int(value.converted(to: unit).value.rounded()) }

    var calendar = Calendar(identifier: .gregorian)
    calendar.timeZone = place.timeZone
    let today = daily.forecast.first { calendar.isDate($0.date, inSameDayAs: .now) } ?? daily.forecast.first

    // Hour labels in the city's own time: "10AM", or "10:00" where the 24-hour clock is used.
    let formatter = DateFormatter()
    formatter.locale = .current
    formatter.timeZone = place.timeZone
    let uses12h = DateFormatter.dateFormat(fromTemplate: "j", options: 0, locale: .current)?.contains("a") ?? false
    if uses12h { formatter.setLocalizedDateFormatFromTemplate("j") } else { formatter.dateFormat = "HH:mm" }
    let label = { (date: Date) in
      formatter.string(from: date).replacingOccurrences(of: " ", with: "").replacingOccurrences(of: "\u{202F}", with: "")
    }

    let now = degrees(current.temperature)
    let upcoming = hourly.forecast.filter { $0.date > .now }.prefix(5).map {
      WeatherHour(label: label($0.date), temperature: degrees($0.temperature), symbol: $0.symbolName)
    }
    return WeatherReport(
      city: place.name,
      temperature: now,
      symbol: current.symbolName,
      condition: current.condition.description,
      high: today.map { degrees($0.highTemperature) } ?? now,
      low: today.map { degrees($0.lowTemperature) } ?? now,
      hours: [WeatherHour(label: "Now", temperature: now, symbol: current.symbolName)] + upcoming
    )
  }
}

/// Why a forecast couldn't be loaded, in words someone can act on.
func weatherProblem(_ error: Error) -> String {
  let text = String(describing: error)
  // WeatherKit signs each request with a token tied to the App ID; it fails until the
  // WeatherKit capability and service are enabled for it and Apple has caught up.
  if text.contains("JWT") || text.contains("Authenticator") || text.contains("401") {
    return "WeatherKit isn't active for this widget yet. Check it's ticked under Capabilities and App Services for the .widget App ID; Apple can take a few hours."
  }
  if error is URLError || text.contains("NSURLErrorDomain") {
    return "No internet connection."
  }
  return String(text.prefix(140))
}

struct WeatherEntry: TimelineEntry {
  let date: Date
  /// nil when WeatherKit couldn't be reached; the widget says why and retries soon.
  let report: WeatherReport?
  var problem: String?
  let slot: GlassSlot
  let size: CGSize
  var theme: AppTheme = .current
}

struct WeatherProvider: AppIntentTimelineProvider {
  func placeholder(in context: Context) -> WeatherEntry {
    WeatherEntry(date: .now, report: .sample, slot: GlassSlot(side: .left, row: .row1), size: context.displaySize)
  }

  func snapshot(for configuration: WeatherWidgetIntent, in context: Context) async -> WeatherEntry {
    var report = WeatherReport.sample
    if !context.isPreview {
      do {
        report = try await WeatherReport.fetch(configuration.city)
      } catch {
        // The gallery snapshot falls back to the sample; the timeline shows the problem.
      }
    }
    return WeatherEntry(date: .now, report: report, slot: configuration.slot, size: context.displaySize,
                        theme: configuration.style.theme)
  }

  func timeline(for configuration: WeatherWidgetIntent, in context: Context) async -> Timeline<WeatherEntry> {
    // Locked until Plus; the app reloads every widget when Plus turns on.
    guard SharedSettings.isPlus else {
      let entry = WeatherEntry(date: .now, report: nil, slot: configuration.slot, size: context.displaySize)
      return Timeline(entries: [entry], policy: .never)
    }
    var report: WeatherReport?
    var problem: String?
    do {
      report = try await WeatherReport.fetch(configuration.city)
    } catch {
      problem = weatherProblem(error)
    }
    let entry = WeatherEntry(date: .now, report: report, problem: problem, slot: configuration.slot,
                             size: context.displaySize, theme: configuration.style.theme)
    // Fresh forecast every half hour; retry sooner if it failed.
    let next = Date.now.addingTimeInterval(report == nil ? 15 * 60 : 30 * 60)
    return Timeline(entries: [entry], policy: .after(next))
  }
}

// MARK: - Views

/// WeatherKit's SF Symbol for the conditions, filled and in colour.
struct WeatherSymbol: View {
  let name: String
  let size: CGFloat
  let theme: AppTheme

  var body: some View {
    let filled = UIImage(systemName: name + ".fill") != nil ? name + ".fill" : name
    Image(systemName: filled)
      .symbolRenderingMode(.multicolor)
      .font(.system(size: size))
      .foregroundStyle(theme == .night ? Color(hex: 0xEAF7FF) : .white)
      // White clouds need an edge on the light glass.
      .shadow(color: theme == .night ? .clear : theme.style.ink.opacity(0.35), radius: 1)
      .frame(height: size * 1.1)
  }
}

/// Apple's required WeatherKit attribution (the Apple logo glyph only exists in the system font).
struct WeatherAttribution: View {
  let size: CGFloat

  var body: some View {
    Text("\u{F8FF}\u{2009}Weather")
      .font(.system(size: size, weight: .medium))
      .opacity(0.6)
  }
}

struct WeatherWidgetView: View {
  let entry: WeatherEntry
  @Environment(\.widgetFamily) private var family

  var body: some View {
    let k = mockupScale(entry.size)
    let style = entry.theme.style
    Group {
      if let report = entry.report {
        if family == .systemMedium { medium(report, k) } else { small(report, k) }
      } else {
        VStack(spacing: 6 * k) {
          Text("Weather isn't available right now")
            .font(Geist.semibold(14 * k))
            .multilineTextAlignment(.center)
          if let problem = entry.problem {
            Text(problem)
              .font(Geist.medium(11 * k))
              .multilineTextAlignment(.center)
              .minimumScaleFactor(0.7)
              .opacity(0.75)
          }
          Text("Trying again in 15 minutes.")
            .font(Geist.medium(11 * k))
            .opacity(0.55)
        }
        .padding(16 * k)
      }
    }
    .foregroundStyle(style.ink)
    .frame(maxWidth: .infinity, maxHeight: .infinity)
  }

  private func cityLine(_ report: WeatherReport, _ k: CGFloat) -> some View {
    HStack(spacing: 4 * k) {
      Text(report.city).font(Geist.bold(16 * k)).lineLimit(1).minimumScaleFactor(0.7)
      Image(systemName: "location.fill").font(.system(size: 10 * k, weight: .bold))
    }
  }

  private func small(_ report: WeatherReport, _ k: CGFloat) -> some View {
    VStack(alignment: .leading, spacing: 0) {
      cityLine(report, k)
      ThemedNumber(text: "\(report.temperature)°", size: 52 * k, theme: entry.theme)
      Spacer(minLength: 0)
      WeatherSymbol(name: report.symbol, size: 20 * k, theme: entry.theme)
      Text(report.condition).font(Geist.semibold(14 * k)).lineLimit(1).minimumScaleFactor(0.7)
      HStack {
        Text("H:\(report.high)° L:\(report.low)°").font(Geist.semibold(13 * k)).opacity(0.75)
        Spacer(minLength: 4 * k)
        WeatherAttribution(size: 9 * k)
      }
    }
    .padding(.horizontal, 16 * k)
    .padding(.vertical, 15 * k)
    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
  }

  private func medium(_ report: WeatherReport, _ k: CGFloat) -> some View {
    VStack(spacing: 0) {
      HStack(alignment: .top) {
        VStack(alignment: .leading, spacing: 0) {
          cityLine(report, k)
          ThemedNumber(text: "\(report.temperature)°", size: 50 * k, theme: entry.theme)
        }
        Spacer(minLength: 8 * k)
        VStack(alignment: .trailing, spacing: 1 * k) {
          HStack(spacing: 5 * k) {
            WeatherSymbol(name: report.symbol, size: 18 * k, theme: entry.theme)
            Text(report.condition).font(Geist.semibold(14 * k)).lineLimit(1).minimumScaleFactor(0.7)
          }
          Text("H:\(report.high)° L:\(report.low)°").font(Geist.semibold(14 * k)).opacity(0.75)
          WeatherAttribution(size: 10 * k)
        }
      }
      Spacer(minLength: 4 * k)
      HStack(spacing: 0) {
        ForEach(report.hours, id: \.self) { hour in
          VStack(spacing: 4 * k) {
            Text(hour.label).font(Geist.semibold(12.5 * k)).opacity(0.75)
            WeatherSymbol(name: hour.symbol, size: 18 * k, theme: entry.theme)
            Text("\(hour.temperature)°").font(Geist.semibold(15 * k))
          }
          .lineLimit(1)
          .minimumScaleFactor(0.7)
          .frame(maxWidth: .infinity)
        }
      }
    }
    .padding(.horizontal, 20 * k)
    .padding(.vertical, 16 * k)
  }
}

struct WeatherWidget: Widget {
  let kind = "Y2KWeather"

  var body: some WidgetConfiguration {
    AppIntentConfiguration(kind: kind, intent: WeatherWidgetIntent.self, provider: WeatherProvider()) { entry in
      WeatherBody(entry: entry)
    }
    .configurationDisplayName("Weather")
    .description("Live weather for a city you pick, on themed glass.")
    .supportedFamilies([.systemSmall, .systemMedium])
    .contentMarginsDisabled()
  }
}

private struct WeatherBody: View {
  let entry: WeatherEntry
  @Environment(\.widgetFamily) private var family

  var body: some View {
    Group {
      if SharedSettings.isPlus {
        WeatherWidgetView(entry: entry)
          // The app's Widgets tab links to the full WeatherKit legal attribution.
          .widgetURL(AppLink.widgets)
      } else {
        PlusLockedView(name: "Weather", size: entry.size)
      }
    }
      .containerBackground(for: .widget) {
        WallpaperGlass(slot: entry.slot, family: family, size: entry.size, theme: entry.theme)
      }
  }
}

#Preview(as: .systemMedium) {
  WeatherWidget()
} timeline: {
  WeatherEntry(date: .now, report: .sample, slot: GlassSlot(side: .left, row: .row1),
               size: CGSize(width: 391.2, height: 184.4), theme: .aero)
}
