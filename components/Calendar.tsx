"use client";
import { useState, useMemo, useRef } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { CalendarEvent } from "@/data/events";
import { useLiveEvents } from "@/lib/useLiveEvents";
import EventDetailPanel from "./EventDetailPanel";

interface CalendarProps {
  initialEvents: CalendarEvent[];
}

const PANEL_MIN = 280; // px
const PANEL_MAX = 380; // px

export default function Calendar({ initialEvents }: CalendarProps) {
  const events = useLiveEvents(initialEvents);

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null); // mobile day list
  const [panelPosition, setPanelPosition] = useState<{ top: number; left: number; width: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    events.forEach((e) => {
      map[e.date] = map[e.date] || [];
      map[e.date].push(e);
    });
    return map;
  }, [events]);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthLabel = currentMonth.toLocaleString("default", { month: "long", year: "numeric" });

  const goToPrevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const goToNextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  const toDateStr = (day: number) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const sheetEvents = selectedDay ? eventsByDate[selectedDay] ?? [] : [];
  const sheetLabel = selectedDay
    ? new Date(`${selectedDay}T12:00:00`).toLocaleDateString("default", {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    : "";

  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent<HTMLButtonElement>) => {
    // Clicking the already-open event toggles it closed
    if (selectedEvent?.id === event.id) {
      closePanel();
      return;
    }

    const container = containerRef.current;
    if (container) {
      const containerRect = container.getBoundingClientRect();
      const tileRect = e.currentTarget.getBoundingClientRect();

      // ~35% of the calendar's width, kept between the min and max
      const width = Math.round(Math.min(PANEL_MAX, Math.max(PANEL_MIN, containerRect.width * 0.35)));

      let left = tileRect.right - containerRect.left + 12;
      const top = Math.max(
        0,
        Math.min(tileRect.top - containerRect.top, containerRect.height - 320)
      );

      // If it would overflow the right edge, flip to the tile's left side instead
      const maxLeft = containerRect.width - width;
      if (left > maxLeft) {
        left = tileRect.left - containerRect.left - width - 12;
      }
      left = Math.max(0, Math.min(left, maxLeft));

      setPanelPosition({ top, left, width });
    }
    setSelectedEvent(event);
  };

  const closePanel = () => {
    setSelectedEvent(null);
    setPanelPosition(null);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-5xl mx-auto">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={goToPrevMonth} aria-label="Previous month" className="p-2 rounded-full hover:bg-[#dccce1]/40 text-[#334c96]">
          <ChevronLeft size={22} />
        </button>
        <h3 className="font-display font-semibold text-xl text-[#334c96]">{monthLabel}</h3>
        <button onClick={goToNextMonth} aria-label="Next month" className="p-2 rounded-full hover:bg-[#dccce1]/40 text-[#334c96]">
          <ChevronRight size={22} />
        </button>
      </div>

      {/* Weekday labels */}
      <div className="grid grid-cols-7 text-center text-sm md:text-lg font-bold text-[#6e4479] mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 md:gap-1.5">
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateStr = toDateStr(day);
          const dayEvents = eventsByDate[dateStr] ?? [];
          const hasEvents = dayEvents.length > 0;

          return (
            <div
              key={day}
              style={day === 1 ? { gridColumnStart: firstDayOfMonth + 1 } : undefined}
              className={`relative aspect-square md:aspect-[4/3] w-full overflow-hidden rounded-lg border p-1 md:p-1.5 flex flex-col gap-1 ${
                hasEvents
                  ? "border-[#334c96]/40 bg-[#dccce1]/50 md:border-gray-100 md:bg-white/60"
                  : "border-gray-100 bg-white/60"
              }`}
            >
              <span className="text-sm md:text-xl text-gray-700">{day}</span>

              {/* Mobile: dots + tap target (opens that day's list) */}
              {hasEvents && (
                <>
                  <div className="md:hidden mt-auto flex justify-center gap-0.5 pb-0.5">
                    {dayEvents.slice(0, 3).map((ev) => (
                      <span key={ev.id} className="h-1.5 w-1.5 rounded-full bg-[#334c96]" />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedDay(dateStr)}
                    aria-label={`${dayEvents.length} event${dayEvents.length > 1 ? "s" : ""} on ${dateStr}`}
                    className="md:hidden absolute inset-0"
                  />
                </>
              )}

              {/* Tablet/desktop: event titles */}
              <div className="hidden md:flex flex-col gap-1 overflow-hidden">
                {dayEvents.slice(0, 3).map((event) => (
                  <button
                    key={event.id}
                    onClick={(e) => handleEventClick(event, e)}
                    className={`text-left text-sm font-bold leading-tight px-1.5 py-1 rounded-md truncate transition-colors ${
                      selectedEvent?.id === event.id
                        ? "bg-[#334c96] text-white"
                        : "bg-[#dccce1]/80 text-[#334c96] hover:bg-[#334c96] hover:text-white"
                    }`}
                  >
                    {event.title}
                  </button>
                ))}
                {dayEvents.length > 3 && (
                  <span className="text-[10px] text-gray-400 px-1.5">+{dayEvents.length - 3} more</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile: list of the tapped day's events */}
      {selectedDay && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-40 flex items-center justify-center p-4"
          onClick={() => setSelectedDay(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <h4 className="font-display font-bold text-xl text-[#334c96] pr-4">{sheetLabel}</h4>
            </div>
            <div className="flex flex-col gap-2">
              {sheetEvents.map((event) => (
                <button
                  key={event.id}
                  onClick={() => {
                    setSelectedDay(null);
                    setSelectedEvent(event);
                  }}
                  className="rounded-xl bg-[#dccce1]/60 px-4 py-3 text-left font-semibold text-[#334c96]"
                >
                  {event.title}
                  {event.startTime && (
                    <span className="block text-sm font-normal text-gray-600">
                      {event.startTime}–{event.endTime}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Desktop popover panel */}
      {selectedEvent && panelPosition && (
        <div
          className="hidden lg:block absolute z-30 bg-white rounded-2xl shadow-xl p-6 max-h-[70vh] overflow-y-auto"
          style={{ top: panelPosition.top, left: panelPosition.left, width: panelPosition.width }}
        >
          <EventDetailPanel event={selectedEvent} onClose={closePanel} />
        </div>
      )}

      {/* Mobile/tablet modal for a single event */}
      {selectedEvent && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-40 flex items-center justify-center p-4"
          onClick={closePanel}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <EventDetailPanel event={selectedEvent} onClose={closePanel} />
          </div>
        </div>
      )}
    </div>
  );
}