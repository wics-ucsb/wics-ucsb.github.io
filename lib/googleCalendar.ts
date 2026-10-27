import type { CalendarEvent } from "@/data/events";
import { splitFlyer } from "./flyer";

const TZ = "America/Los_Angeles";
const fmtTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: TZ });
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("en-CA", { timeZone: TZ });

function dedupe(events: CalendarEvent[]) {
  const seen = new Map<string, CalendarEvent>();
  for (const e of events) {
    const key = `${e.title.trim().toLowerCase()}|${e.date}|${e.startTime}`;
    const existing = seen.get(key);
    if (!existing || (!existing.flyerUrl && e.flyerUrl)) seen.set(key, e);
  }
  return [...seen.values()];
}

export async function fetchGoogleCalendarEvents(): Promise<CalendarEvent[]> {
  // Build uses the private server key; the browser uses the public referrer-restricted key
  const key =
    typeof window === "undefined"
      ? process.env.GOOGLE_CALENDAR_API_KEY
      : process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY;
  const calendarId =
    process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID ?? process.env.GOOGLE_CALENDAR_ID;

  if (!key || !calendarId) throw new Error("Missing Google Calendar configuration");

  const now = new Date();
  const params = new URLSearchParams({
    key,
    singleEvents: "true",
    orderBy: "startTime",
    maxResults: "500",
    timeMin: new Date(now.getFullYear() - 1, now.getMonth(), 1).toISOString(),
    timeMax: new Date(now.getFullYear() + 1, now.getMonth(), 1).toISOString(),
  });

  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?${params}`
  );
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Google Calendar fetch failed: ${res.status} ${res.statusText} - ${body}`);
  }

  const data = await res.json();
  const events: CalendarEvent[] = (data.items ?? [])
    .filter((item: any) => item.status !== "cancelled")
    .map((item: any) => {
      const startIso: string | undefined = item.start?.dateTime;
      const { description, flyerUrl } = splitFlyer(item.description);
      return {
        id: item.id,
        title: item.summary ?? "Untitled event",
        date: startIso ? fmtDate(startIso) : item.start?.date,
        startTime: startIso ? fmtTime(startIso) : "",
        endTime: item.end?.dateTime ? fmtTime(item.end.dateTime) : "",
        location: item.location ?? "",
        description,
        flyerUrl,
      };
    });

  return dedupe(events);
}