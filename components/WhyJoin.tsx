"use client";
import { useState } from "react";
import Link from "next/link";
import { Code, Users, GraduationCap, ArrowRight, ChevronDown } from "lucide-react";

const aspects = [
  {
    icon: Code,
    title: "Technical & Professional Development",
    description: "Workshops, tech talks, and hands-on projects to grow your skills and launch your career.",
    details: [
      "Technical workshops and tech talks",
      "Resume reviews and mock interviews",
      "Connections to internships and full-time roles",
    ],
  },
  {
    icon: Users,
    title: "Community Building",
    description: "Connect with women in tech at UCSB through mentorship, socials, and study groups.",
    details: [
      "Mentorship with peers and upperclassmen",
      "Socials to meet people across years and majors",
      "Study groups for your CS classes",
    ],
  },
  {
    icon: GraduationCap,
    title: "High School Outreach",
    description: "We introduce high school students to computing and show them what a path in tech can look like.",
    details: [
      "Volunteer opportunities for members",
      "Build leadership and teaching skills",
      "Help more girls see a place for themselves in CS",
    ],
  },
];

export default function WhyJoin({ compact = false }: { compact?: boolean }) {
  const [activeTile, setActiveTile] = useState<number | null>(null);

  return (
    <section className={`w-full px-6 bg-[#f7f5f9] ${compact ? "py-10" : "py-16"}`}>
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="font-display font-bold text-3xl mb-4 text-[#334c96]">Why Join Us?</h2>
        {!compact && (
          <p className="mb-10 text-lg text-[#6e4479] max-w-3xl mx-auto">
            Women in Computer Science at UC Santa Barbara aims to empower women and underrepresented
            students in tech, and we welcome members regardless of your gender, ability, skill level,
            or major. We are dedicated to creating an inclusive space for students to grow
            academically, professionally, and personally while building a strong sense of community
            in CS.
          </p>
        )}

        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${compact ? "mt-6" : ""}`}>
          {aspects.map((tile, i) => {
            const Icon = tile.icon;
            const isActive = !compact && activeTile === i;
            const toggle = () => setActiveTile(isActive ? null : i);

            return (
              <div
                key={tile.title}
                {...(!compact && {
                  role: "button",
                  tabIndex: 0,
                  "aria-expanded": isActive,
                  onClick: toggle,
                  onKeyDown: (e: React.KeyboardEvent) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggle();
                    }
                  },
                })}
                className={`rounded-2xl p-8 bg-white shadow-md transition-all duration-300 ${
                  compact ? "" : "cursor-pointer hover:shadow-xl hover:-translate-y-1"
                } ${isActive ? "ring-2 ring-[#334c96] shadow-xl -translate-y-1" : ""}`}
              >
                <div
                  className={`mx-auto mb-4 flex items-center justify-center w-14 h-14 rounded-full transition-colors duration-300 ${
                    isActive ? "bg-[#334c96] text-white" : "bg-[#dccce1]/60 text-[#334c96]"
                  }`}
                >
                  <Icon size={26} strokeWidth={2} />
                </div>
                <h3 className="font-semibold text-xl mb-2 text-[#334c96]">{tile.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{tile.description}</p>

                {!compact && (
                  <>
                    <div
                      className={`grid transition-[grid-template-rows] duration-300 ${
                        isActive ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      }`}
                    >
                      <ul className="min-h-0 overflow-hidden text-left list-disc pl-5 text-sm text-gray-600 space-y-1">
                        <li className="pt-4 list-none -ml-5" aria-hidden />
                        {tile.details.map((d) => (
                          <li key={d}>{d}</li>
                        ))}
                      </ul>
                    </div>
                    <ChevronDown
                      size={20}
                      className={`mx-auto mt-4 text-[#6e4479] transition-transform duration-300 ${
                        isActive ? "rotate-180" : ""
                      }`}
                    />
                  </>
                )}
              </div>
            );
          })}
        </div>

        {!compact && (
          <Link
            href="/engage#join"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-[#334c96] px-6 py-3 font-bold text-white hover:bg-[#6e4479] transition-colors"
          >
            Join us <ArrowRight size={18} />
          </Link>
        )}
      </div>
    </section>
  );
}