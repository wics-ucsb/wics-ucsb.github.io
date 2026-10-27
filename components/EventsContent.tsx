"use client";
import type { CalendarEvent } from "@/data/events";
import { useLiveEvents } from "@/lib/useLiveEvents";
import { latestEvents } from "@/lib/eventHelpers";
import FlyerGallery from "./FlyerGallery";
import Calendar from "./Calendar";

export default function EventsContent({ initialEvents }: { initialEvents: CalendarEvent[] }) {
  const events = useLiveEvents(initialEvents);
  const flyers = latestEvents(events, 8);

  return (
    <>
      {flyers.length > 0 && (
        <section className="w-full max-w-5xl mx-auto px-6 pb-10">
          <FlyerGallery events={flyers} />
        </section>
      )}
      <section className="w-full p-6">
        <h2 className="text-center font-display font-bold text-3xl mb-6 text-[#334c96]">Calendar</h2>
        <Calendar events={events} />
      </section>
    </>
  );
}