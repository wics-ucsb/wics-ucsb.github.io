"use client";
import { useEffect, useState } from "react";
import type { CalendarEvent } from "@/data/events";
import { fetchGoogleCalendarEvents } from "./googleCalendar";

// Starts with the build-time events, then swaps in fresh ones from the browser
export function useLiveEvents(initial: CalendarEvent[]) {
  const [events, setEvents] = useState(initial);

  useEffect(() => {
    let cancelled = false;
    fetchGoogleCalendarEvents()
      .then((fresh) => !cancelled && setEvents(fresh))
      .catch(() => {}); // on failure, keep the build-time data
    return () => {
      cancelled = true;
    };
  }, []);

  return events;
}