
import type { CalendarEvent } from "@/data/events";
import { splitFlyer } from "./flyer";

const TZ = "America/Los_Angeles";

const fmtTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: TZ,
  });

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-CA", {
    timeZone: TZ,
  });

function isValidDateString(value: unknown): value is string {
  if (typeof value !== "string") return false;

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  const parsed = new Date(Date.UTC(year, month - 1, day));

  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  );
}

function isValidTimestamp(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.trim() !== "" &&
    Number.isFinite(Date.parse(value))
  );
}

function dedupe(events: CalendarEvent[]) {
  const seen = new Map<string, CalendarEvent>();

  for (const event of events) {
    const key =
      `${event.title.trim().toLowerCase()}|${event.date}|${event.startTime}`;

    const existing = seen.get(key);

    if (!existing || (!existing.flyerUrl && event.flyerUrl)) {
      seen.set(key, event);
    }
  }

  return [...seen.values()];
}

export async function fetchGoogleCalendarEvents(): Promise<CalendarEvent[]> {
  const key =
    typeof window === "undefined"
      ? process.env.GOOGLE_CALENDAR_API_KEY
      : process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY;

  const calendarId =
    process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID ??
    process.env.GOOGLE_CALENDAR_ID;

  if (!key || !calendarId) {
    throw new Error("Missing Google Calendar configuration");
  }

  const now = new Date();

  const timeMin = new Date(
    now.getFullYear() - 1,
    now.getMonth(),
    1
  );

  const timeMax = new Date(
    now.getFullYear() + 1,
    now.getMonth(),
    1
  );

  const params = new URLSearchParams({
    key,
    singleEvents: "true",
    orderBy: "startTime",
    maxResults: "500",
    timeMin: timeMin.toISOString(),
    timeMax: timeMax.toISOString(),
  });

  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
      calendarId
    )}/events?${params}`
  );

  if (!res.ok) {
    const body = await res.text();

    throw new Error(
      `Google Calendar fetch failed: ${res.status} ${res.statusText} - ${body}`
    );
  }

  const data = await res.json();

  const events: CalendarEvent[] = (data.items ?? []).flatMap(
    (item: any) => {
      if (item.status === "cancelled") {
        return [];
      }

      const startIso = item.start?.dateTime;
      const allDayDate = item.start?.date;

      let date: string;
      let startTime = "";

      if (startIso != null) {
        if (!isValidTimestamp(startIso)) {
          console.error(
            "Invalid event start timestamp:",
            item.id,
            startIso
          );
          return [];
        }

        date = fmtDate(startIso);
        startTime = fmtTime(startIso);

        if (!isValidDateString(date)) {
          console.error(
            "Invalid normalized event date:",
            item.id,
            date
          );
          return [];
        }
      } else if (isValidDateString(allDayDate)) {
        date = allDayDate;
      } else {
        console.error(
          "Event has no valid start date:",
          item.id,
          item.start
        );
        return [];
      }

      const endIso = item.end?.dateTime;

      let endTime = "";

      if (endIso != null) {
        if (isValidTimestamp(endIso)) {
          endTime = fmtTime(endIso);
        } else {
          console.error(
            "Invalid event end timestamp:",
            item.id,
            endIso
          );
        }
      }

      const { description, flyerUrl } = splitFlyer(
        item.description ?? ""
      );

      return [
        {
          id: item.id,
          title: item.summary ?? "Untitled event",
          date,
          startTime,
          endTime,
          location: item.location ?? "",
          description,
          flyerUrl,
        },
      ];
    }
  );

  return dedupe(events);
}
