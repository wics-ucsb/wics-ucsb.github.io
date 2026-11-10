"use client";
import { useEffect, useState } from "react";
import type { CalendarEvent } from "@/data/events";
import { fetchGoogleCalendarEvents } from "./googleCalendar";

export function useLiveEvents(initial: CalendarEvent[]) {
  const [events, setEvents] = useState(initial);

  useEffect(() => {
    let cancelled = false;
    fetchGoogleCalendarEvents()
      .then((fresh) => !cancelled && setEvents(fresh))
      .catch((err) => console.error("Live events refresh failed:", err.message));
    return () => {
      cancelled = true;
    };
  }, []);

  return events;
}