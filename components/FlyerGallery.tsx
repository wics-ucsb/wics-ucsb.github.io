"use client";
import { useState } from "react";
import { CalendarEvent } from "@/data/events";
import EventDetailPanel from "./EventDetailPanel";

const dateLabel = (d: string) =>
  new Date(`${d}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" });

export default function FlyerGallery({ events }: { events: CalendarEvent[] }) {
  const [selected, setSelected] = useState<CalendarEvent | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {events.map((event, i) => (
          <button
            key={event.id}
            onClick={() => setSelected(event)}
            className={`group relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#dccce1]/40 text-left shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
              i >= 6 ? "hidden lg:block" : i >= 4 ? "hidden md:block" : ""
            }`}
          >
            {event.flyerUrl ? (
              <img
                src={event.flyerUrl}
                alt={event.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-[#334c96] to-[#6e4479]" />
            )}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#334c96]/90 to-transparent p-3 pt-10">
              <p className="text-xs font-semibold uppercase text-[#dccce1]">{dateLabel(event.date)}</p>
              <p className="font-display font-semibold leading-tight text-white line-clamp-2">
                {event.title}
              </p>
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-md max-h-[80vh] overflow-y-auto rounded-2xl bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <EventDetailPanel event={selected} onClose={() => setSelected(null)} />
          </div>
        </div>
      )}
    </>
  );
}