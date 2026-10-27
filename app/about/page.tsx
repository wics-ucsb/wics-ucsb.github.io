import Link from "next/link";
import Footer from "@/components/Footer";
import LocationsMap from "@/components/LocationsMap";
import { Target, TrendingUp, GraduationCap, Users, ArrowRight } from "lucide-react";

// update
const impactStats = [
  { value: "100+", label: "active members" },
  { value: "28", label: "events in the past year" },
  { value: "170+", label: "high school students directly reached" },
];

const generalMeetings = {
  when: "Wednesdays at 6:00 - 7:00 PM",
  detail: "Our events are weekly on Wednesdays. Everyone is welcome!",
};

const initiatives = [
  {
    icon: GraduationCap,
    title: "High School Outreach",
    description: "We introduce high school students to computing and show them what a path in tech can look like.",
  },
  {
    icon: Users,
    title: "Mentorship Bubbles Program",
    description: "Small mentorship groups that connect members with peers and mentors.",
  },
];

export default function AboutPage() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Who we are */}
      <section className="w-full px-6 py-16">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="font-display font-bold text-4xl mb-6 text-[#334c96]">Who We Are</h1>
            <p className="text-xl leading-relaxed text-[#6e4479]">
              The Women in Computer Science (WiCS) Club is centered around <b>empowering and supporting underrepresented women 
              and students in computer science</b>. We approach this goal by
             <b> facilitating technical and academic excellence</b>, nurturing <b>community building and mentorship</b>, and 
              giving opportunities for <b>all members to make a tangible impact</b>.
            </p>
          </div>
          <img src="/images/wics-bg.png" alt="" className="w-full max-w-xs mx-auto object-contain" />
        </div>
      </section>

      {/* Mission & Impact */}
      <section className="w-full px-6 py-16 bg-[#f7f5f9]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-white p-8 shadow-md">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#dccce1]/60 text-[#334c96]">
              <Target size={26} />
            </div>
            <h2 className="font-display font-bold text-3xl mb-4 text-[#334c96]">Mission</h2>
            <p className="text-lg leading-relaxed text-[#6e4479]">
              We at WiCS UCSB aim to bridge gender and inclusivity gaps in the tech industry by creating
              a thriving community that fosters collaboration, growth, and mutual support among all
              members.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-md">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#dccce1]/60 text-[#334c96]">
              <TrendingUp size={26} />
            </div>
            <h2 className="font-display font-bold text-3xl mb-4 text-[#334c96]">Impact</h2>
            <div className="grid grid-cols-2 gap-4">
              {impactStats.map((s) => (
                <div key={s.label}>
                  <p className="font-display font-bold text-3xl text-[#6e4479]">{s.value}</p>
                  <p className="text-sm text-gray-600">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Where & when */}
      <section className="w-full px-6 py-16">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-display font-bold text-3xl mb-8 text-[#334c96]">Where You&apos;ll Find Us</h2>
          <LocationsMap />

          <p className="mt-12 font-display font-bold text-xl md:text-3xl text-[#6e4479]">
            General meetings: {generalMeetings.when}
          </p>
          <p className="mt-3 text-lg text-gray-600">{generalMeetings.detail}</p>
          <Link
            href="/engage#join"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#334c96] px-6 py-3 font-bold text-white hover:bg-[#6e4479] transition-colors"
          >
            Join us <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Initiatives */}
      <section className="w-full px-6 py-16 bg-[#f7f5f9]">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-display font-bold text-3xl mb-10 text-[#334c96]">Initiatives</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {initiatives.map(({ icon: Icon, title, description }) => (
              <Link
                key={title}
                href="/engage#join"
                className="group rounded-2xl bg-white p-8 text-center shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#dccce1]/60 text-[#334c96] transition-colors group-hover:bg-[#334c96] group-hover:text-white">
                  <Icon size={26} />
                </div>
                <h3 className="font-semibold text-xl mb-2 text-[#334c96]">{title}</h3>
                <p className="text-sm leading-relaxed text-gray-600">{description}</p>
                <span className="mt-4 inline-flex items-center gap-1 font-semibold text-[#6e4479]">
                  Join <ArrowRight size={16} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}