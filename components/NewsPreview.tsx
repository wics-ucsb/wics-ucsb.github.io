"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { CalendarEvent } from "@/data/events";
import { useLiveEvents } from "@/lib/useLiveEvents";
import { latestEvents } from "@/lib/eventHelpers";

const dateLabel = (d: string) =>
  new Date(`${d}T12:00:00`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

export default function NewsPreview({ initialEvents }: { initialEvents: CalendarEvent[] }) {
  const events = latestEvents(useLiveEvents(initialEvents), 3);
  if (events.length === 0) return null;

  return (
    <section className="w-full px-6 py-16">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="font-display font-bold text-3xl mb-3 text-[#334c96]">Find out what we&apos;ve been up to lately</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {events.map((event) => (
            <Link
              key={event.id}
              href="/events"
              className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-foreground border-[#334c96] transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              {event.flyerUrl && (
                <img
                  src={event.flyerUrl}
                  alt={event.title}
                  referrerPolicy="no-referrer"
                  className="h-44 w-full object-cover"
                />
              )}
              <div className="p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#6e4479]">
                  {dateLabel(event.date)}
                  {event.startTime && ` · ${event.startTime}`}
                </p>
                <h3 className="mt-1 font-display font-semibold text-xl text-[#334c96] group-hover:text-[#6e4479]">
                  {event.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600 line-clamp-3">
                  {event.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <Link
          href="/events"
          className="mt-10 inline-flex items-center gap-2 rounded-full border-2 border-[#334c96] px-6 py-3 font-bold text-[#334c96] hover:bg-[#334c96] hover:text-white transition-colors"
        >
          More events <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}