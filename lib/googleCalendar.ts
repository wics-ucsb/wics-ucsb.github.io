import { CalendarEvent } from "@/data/events";

const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID!;
const API_KEY = process.env.GOOGLE_CALENDAR_API_KEY!;

interface GoogleApiEvent {
  id: string;
  summary?: string;
  description?: string;
  location?: string;
  start: { date?: string; dateTime?: string };
  end: { date?: string; dateTime?: string };
}

// Officers can paste "[image: https://...]" anywhere in an event's
// description in Google Calendar to attach a flyer image.
function extractImage(description?: string) {
  if (!description) return { text: "", imageUrl: undefined };
  const match = description.match(/\[image:\s*(https?:\/\/[^\]\s]+)\]/i);
  const text = description.replace(/\[image:\s*https?:\/\/[^\]\s]+\]/i, "").trim();
  return { text, imageUrl: match?.[1] };
}

function splitDateTime(dt?: { date?: string; dateTime?: string }) {
  if (dt?.dateTime) {
    // change dateTime for googleCalendar format
    return { date: dt.dateTime.slice(0, 10), time: dt.dateTime.slice(11, 16) };
  }
  return { date: dt?.date ?? "", time: "" }; // all-day event
}

export async function fetchGoogleCalendarEvents(): Promise<CalendarEvent[]> {
  const timeMin = new Date();
  timeMin.setMonth(timeMin.getMonth() - 1); // include recent past for context

  const params = new URLSearchParams({
    key: API_KEY,
    singleEvents: "true", // expands recurring events into individual instances
    orderBy: "startTime",
    timeMin: timeMin.toISOString(),
    maxResults: "250",
  });

  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events?${params}`,
    { next: { revalidate: 300 } } // re-fetch at most every 5 min
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Google Calendar fetch failed: ${res.status} ${res.statusText} - ${body}`);
  }

  const data = await res.json();
  const items: GoogleApiEvent[] = data.items ?? [];

  return items.map((item) => {
    const { date, time: startTime } = splitDateTime(item.start);
    const { time: endTime } = splitDateTime(item.end);
    const { text, imageUrl } = extractImage(item.description);

    return {
      id: item.id,
      title: item.summary ?? "Untitled Event",
      description: text,
      date,
      startTime,
      endTime,
      location: item.location ?? "",
      imageUrl,
    };
  });
}