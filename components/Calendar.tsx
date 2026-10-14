"use client";
import { useState, useMemo, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CalendarEvent } from "@/data/events";
import EventDetailPanel from "./EventDetailPanel";

interface CalendarProps {
  events: CalendarEvent[];
}

const PANEL_WIDTH = 340; // px

export default function Calendar({ events }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [panelPosition, setPanelPosition] = useState<{ top: number; left: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Group events by date string for quick lookup
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

  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent<HTMLButtonElement>) => {
    const container = containerRef.current;
    if (container) {
      const containerRect = container.getBoundingClientRect();
      const tileRect = e.currentTarget.getBoundingClientRect();

      // Anchor just to the right of the clicked tile
      let left = tileRect.right - containerRect.left + 12;
      const top = Math.max(
        0,
        Math.min(tileRect.top - containerRect.top, containerRect.height - 320)
      );

      // If it would overflow the right edge, flip to the tile's left side instead
      const maxLeft = containerRect.width - PANEL_WIDTH;
      if (left > maxLeft) {
        left = tileRect.left - containerRect.left - PANEL_WIDTH - 12;
      }
      left = Math.max(0, Math.min(left, maxLeft));

      setPanelPosition({ top, left });
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
        <button onClick={goToPrevMonth} className="p-2 rounded-full hover:bg-[#dccce1]/40 text-[#334c96]">
          <ChevronLeft size={22} />
        </button>
        <h3 className="font-display font-semibold text-xl text-[#334c96]">{monthLabel}</h3>
        <button onClick={goToNextMonth} className="p-2 rounded-full hover:bg-[#dccce1]/40 text-[#334c96]">
          <ChevronRight size={22} />
        </button>
      </div>

      {/* Weekday labels */}
      <div className="grid grid-cols-7 text-center md:text-lg text-lg font-bold text-[#6e4479] mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5">
  {Array.from({ length: daysInMonth }).map((_, i) => {
    const day = i + 1;
    const dateStr = toDateStr(day);
    const dayEvents = eventsByDate[dateStr] ?? [];

    return (
      <div
        key={day}
        style={day === 1 ? { gridColumnStart: firstDayOfMonth + 1 } : undefined}
        className="aspect-square md:aspect-[4/3] w-full overflow-hidden rounded-lg border border-gray-100 p-1.5 flex flex-col gap-1 bg-white/60"
      >
        <span className="md:text-xl text-md text-gray-700">{day}</span>
        <div className="flex flex-col gap-1 overflow-hidden">
          {dayEvents.slice(0, 3).map((event) => (
            <button key={event.id} onClick={(e) => handleEventClick(event, e)}
              className={`text-left text-[11px] md:text-sm font-bold leading-tight px-1.5 py-1 rounded-md truncate transition-colors ${
              selectedEvent?.id === event.id
                ? "bg-[#334c96] text-white"
                : "bg-[#dccce1]/80 text-[#334c96] hover:bg-[#334c96] hover:text-white"
              }`}
            >
              {event.title}
            </button>
            ))}
            {dayEvents.length > 3 && (
              <span className="text-[10px] text-gray-400 px-1.5">
                +{dayEvents.length - 3} more
                  </span>
            )}
            </div>
            </div>
          );
        })}
      </div>

      {/* Desktop popover panel — anchored right next to the clicked date tile */}
      {selectedEvent && panelPosition && (
        <div
          className="hidden lg:block absolute z-30 bg-white rounded-2xl shadow-xl p-6"
          style={{ top: panelPosition.top, left: panelPosition.left, width: PANEL_WIDTH }}
        >
          <EventDetailPanel event={selectedEvent} onClose={closePanel} />
        </div>
      )}

      {/* Mobile modal — centered on screen, not pinned to the bottom */}
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