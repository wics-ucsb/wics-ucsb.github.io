"use client";
import { CalendarPlus, X } from "lucide-react";
import { CalendarEvent } from "@/data/events";
import { getGoogleCalendarUrl } from "@/utils/calendarLinks";

export default function EventDetailPanel({
  event,
  onClose,
}: {
  event: CalendarEvent;
  onClose: () => void;
}) {
  return (
    <div className="relative">
      {event.flyerUrl && (<img src={event.flyerUrl} alt={event.title}
            className="w-full h-40 object-cover rounded-xl mb-4" referrerPolicy="no-referrer" />
      )}

      <h4 className="font-display font-bold text-xl text-[#334c96] mb-1 pr-6">
        {event.title}
      </h4>
      <p className="text-sm text-gray-500 mb-3">
        {new Date(`${event.date}T00:00:00`).toLocaleDateString("default", {
          weekday: "long",
          month: "long",
          day: "numeric",
        })}
        {event.startTime && ` · ${event.startTime}–${event.endTime}`}
        {event.location && ` · ${event.location}`}
      </p>
      <p className="text-gray-700 text-sm mb-5 whitespace-pre-line">
        {event.description}
      </p>

      <div className="flex gap-2 flex-wrap">
        <a href={getGoogleCalendarUrl(event)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#334c96] text-white hover:bg-[#26397a] transition-colors"
        >
          <CalendarPlus size={14} />
          Add to Google Calendar
        </a>
      </div>
    </div>
  );
}