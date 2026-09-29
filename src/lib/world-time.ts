/** A city on the World Clocks widget. `timeZone` undefined means the phone's own time zone. */
export type City = { name: string; timeZone?: string };

/** Defaults from the Aero Night mockup. Keep in sync with WorldClocksWidget.swift. */
export const DEFAULT_CITIES: City[] = [
  { name: 'Home' },
  { name: 'New York', timeZone: 'America/New_York' },
  { name: 'London', timeZone: 'Europe/London' },
  { name: 'Tokyo', timeZone: 'Asia/Tokyo' },
];

/** Wall-clock time in a time zone, plus how far it is from local time ("+3HRS") and which day. */
export function zoneTime(date: Date, timeZone?: string) {
  const local = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes());
  let there = local;
  if (timeZone) {
    const parts = Object.fromEntries(
      new Intl.DateTimeFormat('en-US', {
        timeZone,
        hourCycle: 'h23',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      })
        .formatToParts(date)
        .map((p) => [p.type, Number(p.value)])
    );
    there = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour % 24, parts.minute);
  }
  const t = new Date(there);
  const offsetHours = (there - local) / 3_600_000;
  const dayDiff = Math.round(
    (Date.UTC(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate()) -
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())) /
      86_400_000
  );
  return {
    hours: t.getUTCHours(),
    minutes: t.getUTCMinutes(),
    offset: `${offsetHours >= 0 ? '+' : ''}${Number.isInteger(offsetHours) ? offsetHours : offsetHours.toFixed(1)}HRS`,
    day: dayDiff === 0 ? 'Today' : dayDiff > 0 ? 'Tomorrow' : 'Yesterday',
    isDay: t.getUTCHours() >= 6 && t.getUTCHours() < 18,
  };
}
