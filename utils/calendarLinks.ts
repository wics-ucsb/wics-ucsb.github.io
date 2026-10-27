
import type { CalendarEvent } from "@/data/events";

const TZ = "America/Los_Angeles";

// Accepts "18:00" or "6:00 PM"; returns [hours, minutes].
function parseTime(time?: string): [number, number] | null {
  if (!time) return null;

  const match = time
    .trim()
    .match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);

  if (!match) return null;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const meridiem = match[3]?.toUpperCase();

  if (minutes < 0 || minutes > 59) return null;

  if (meridiem) {
    if (hours < 1 || hours > 12) return null;

    if (meridiem === "PM" && hours < 12) hours += 12;
    if (meridiem === "AM" && hours === 12) hours = 0;
  } else if (hours < 0 || hours > 23) {
    return null;
  }

  return [hours, minutes];
}

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

// Convert a local event date/time in Los Angeles to a UTC timestamp.
// Uses Intl to determine the correct daylight-saving offset.
function toUtcStamp(
  date: string,
  [hours, minutes]: [number, number]
): string | null {
  if (!isValidDateString(date)) return null;

  const [year, month, day] = date.split("-").map(Number);

  const target = Date.UTC(year, month - 1, day, hours, minutes);

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });

  // Find the UTC instant corresponding to the requested Los Angeles time.
  let utc = target;

  for (let i = 0; i < 4; i++) {
    const parts = formatter.formatToParts(new Date(utc));
    const get = (type: string) =>
      Number(parts.find((part) => part.type === type)?.value);

    const represented = Date.UTC(
      get("year"),
      get("month") - 1,
      get("day"),
      get("hour"),
      get("minute"),
      get("second")
    );

    const difference =
      target - represented;

    if (difference === 0) break;

    utc += difference;
  }

  const check = formatter.formatToParts(new Date(utc));
  const get = (type: string) =>
    Number(check.find((part) => part.type === type)?.value);

  if (
    get("year") !== year ||
    get("month") !== month ||
    get("day") !== day ||
    get("hour") !== hours ||
    get("minute") !== minutes
  ) {
    // This local time may not exist during the spring DST transition.
    return null;
  }

  const iso = new Date(utc).toISOString();

  return iso.replace(/[-:]/g, "").split(".")[0] + "Z";
}

function allDayRange(date: string): [string, string] {
  if (!isValidDateString(date)) {
    throw new Error(`Invalid event date: ${date}`);
  }

  const [year, month, day] = date.split("-").map(Number);

  const start = `${String(year).padStart(4, "0")}${String(month).padStart(
    2,
    "0"
  )}${String(day).padStart(2, "0")}`;

  const next = new Date(Date.UTC(year, month - 1, day + 1));

  const end = [
    String(next.getUTCFullYear()).padStart(4, "0"),
    String(next.getUTCMonth() + 1).padStart(2, "0"),
    String(next.getUTCDate()).padStart(2, "0"),
  ].join("");

  return [start, end];
}

function eventRange(event: CalendarEvent) {
  const time = parseTime(event.startTime);

  if (time && isValidDateString(event.date)) {
    const endTime =
      parseTime(event.endTime) ??
      ([time[0] + 1, time[1]] as [number, number]);

    // Handle an event ending at midnight.
    const start = toUtcStamp(event.date, time);

    let endDate = event.date;
    let adjustedEndTime = endTime;

    if (endTime[0] >= 24) {
      const [year, month, day] = event.date.split("-").map(Number);
      const next = new Date(Date.UTC(year, month - 1, day + 1));

      endDate = [
        String(next.getUTCFullYear()).padStart(4, "0"),
        String(next.getUTCMonth() + 1).padStart(2, "0"),
        String(next.getUTCDate()).padStart(2, "0"),
      ].join("-");

      adjustedEndTime = [endTime[0] - 24, endTime[1]];
    }

    const end = toUtcStamp(endDate, adjustedEndTime);

    if (start && end) {
      return { start, end, allDay: false };
    }
  }

  const [start, end] = allDayRange(event.date);

  return { start, end, allDay: true };
}

const escapeIcs = (value = "") =>
  value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");

export function getGoogleCalendarUrl(event: CalendarEvent): string {
  const { start, end } = eventRange(event);

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${start}/${end}`,
    details: event.description ?? "",
    location: event.location ?? "",
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function downloadIcsFile(event: CalendarEvent) {
  const { start, end, allDay } = eventRange(event);

  const stamp =
    new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//WiCS UCSB//Events//EN",
    "BEGIN:VEVENT",
    `UID:${event.id}@wicsucsb.org`,
    `DTSTAMP:${stamp}`,
    allDay ? `DTSTART;VALUE=DATE:${start}` : `DTSTART:${start}`,
    allDay ? `DTEND;VALUE=DATE:${end}` : `DTEND:${end}`,
    `SUMMARY:${escapeIcs(event.title)}`,
    `DESCRIPTION:${escapeIcs(event.description)}`,
    `LOCATION:${escapeIcs(event.location)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([icsContent], {
    type: "text/calendar;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `${event.title.replace(/\s+/g, "_")}.ics`;

  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
