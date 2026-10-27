"use client";
import type { CalendarEvent } from "@/data/events";
import { useLiveEvents } from "@/lib/useLiveEvents";
import { latestEvents } from "@/lib/eventHelpers";

const dateLabel = (d: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d ?? "")) {
    console.error("Invalid flyer event date:", d);
    return "Date TBA";
  }

  const [year, month, day] = d.split("-").map(Number);
  const parsed = new Date(year, month - 1, day, 12, 0, 0);

  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    console.error("Could not parse flyer event date:", d);
    return "Date TBA";
  }

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

export default function FlyerGallery({
  initialEvents,
}: {
  initialEvents: CalendarEvent[];
}) {
  const events = latestEvents(useLiveEvents(initialEvents), 8);

  return (
    <div className="grid grid-cols-2 gap-10 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
      {events.map((event, i) => (
        <div
          key={event.id}
          className={`relative aspect-[4/5] overflow-hidden rounded-2xl border-2 border-[#334c96] shadow-[0_8px_24px_rgba(51,76,150,0.35)] ${
            i >= 6
              ? "hidden lg:block"
              : i >= 4
                ? "hidden md:block"
                : ""
          }`}
        >
          {event.flyerUrl ? (
            <img
              src={event.flyerUrl}
              alt={event.title}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
              onError={(e) => {
                console.error(
                  "Failed to load event flyer:",
                  event.title,
                  event.flyerUrl
                );
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-[#334c96] to-[#6e4479]" />
          )}

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#334c96]/90 to-transparent p-3 pt-10">
            <p className="text-xs font-semibold uppercase text-white">
              {dateLabel(event.date)}
            </p>

            <p className="text-xs md:font-display md:text-base md:font-semibold leading-tight text-white line-clamp-2">
              {event.title}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
