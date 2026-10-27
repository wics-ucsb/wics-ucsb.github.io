"use client";
import { useState } from "react";
import { MapPin, ExternalLink } from "lucide-react";

// ⚠️ EXAMPLES: replace with your real meeting/event locations (2-3)
const locations = [
  { name: "Harold Frank Hall", query: "Harold Frank Hall, UC Santa Barbara, CA" },
];

export default function LocationsMap() {
  const [active, setActive] = useState(0);
  const loc = locations[active];

  return (
    <div>
      <div className="mb-4 flex flex-wrap justify-center gap-2">
        {locations.map((l, i) => (
          <button
            key={l.name}
            onClick={() => setActive(i)}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              i === active
                ? "bg-[#334c96] text-white"
                : "bg-[#dccce1]/60 text-[#334c96] hover:bg-[#dccce1]"
            }`}
          >
            <MapPin size={16} /> {l.name}
          </button>
        ))}
      </div>

      <iframe
        key={loc.query}
        title={`Map of ${loc.name}`}
        src={`https://www.google.com/maps?q=${encodeURIComponent(loc.query)}&output=embed`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-64 md:h-80 w-full rounded-2xl border-0 shadow-md"
      />

      <a
        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.query)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#6e4479] hover:underline"
      >
        Open in Google Maps <ExternalLink size={14} />
      </a>
    </div>
  );
}