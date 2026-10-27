import { CalendarEvent } from "@/data/events";

export function latestEvents(events: CalendarEvent[], count: number, flyersOnly = false) {
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/Los_Angeles" });
  const sorted = events
    .filter((e) => !flyersOnly || e.flyerUrl)
    .sort((a, b) => a.date.localeCompare(b.date));
  const upcoming = sorted.filter((e) => e.date >= today);
  const past = sorted.filter((e) => e.date < today).reverse();
  return [...upcoming, ...past].slice(0, count);
}