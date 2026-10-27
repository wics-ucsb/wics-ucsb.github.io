import Footer from "@/components/Footer";
import { Users, Mail, ArrowRight, Handshake } from "lucide-react";

const SHORELINE_URL = "https://shoreline.ucsb.edu/WiCS/club_signup";   // your WiCS Shoreline page
const CLUB_EMAIL = "ucsb.wics@gmail.com";                  // your club email
const SPONSOR_URL = "https://tinyurl.com/sponsor-wics";          // sponsor interest form / info
const SPONSOR_QR = "/images/wics-sponsor-qr.png";      // needs its own QR image

const introSubject = "WiCS New Member Introduction!";
const introBody = `Hi WiCS team,

Excited to meet you! I am [your name], and I'm a [year] studying [major] at UCSB.

I'm interested in joining WiCS because [your reason].

I'm most excited about: [technical & professional development / community building / high school outreach]

[Anything you want to know!]

Thanks!
[your name]`;

const introMailto = `mailto:${CLUB_EMAIL}?subject=${encodeURIComponent(introSubject)}&body=${encodeURIComponent(introBody)}`;

const links = [
  { img: "/images/wics-mailing-list-qr.png", alt: "Mailing List QR", href: "https://tinyurl.com/wics-mailing-list", label: "Join our mailing list" },
  { img: "/images/wics-bubbles-qr.png", alt: "BUBBLES QR", href: "https://tinyurl.com/wics-bubbles", label: "WiCS BUBBLES" },
  { img: "/images/wics-new-event-qr.png", alt: "New Event QR", href: "https://tinyurl.com/wics-new-event", label: "Suggest a New WiCS Event" },
];

export default function EngagePage() {
  return (
    <main className="flex flex-col min-h-screen max-w-full">

      {/* Join / stay updated */}
      <section id="join" className="scroll-mt-24 w-full px-6 py-16 text-center">
        <h1 className="font-display font-bold text-4xl mb-10 text-[#334c96]">Stay updated with WiCS</h1>

        {/* Ways to join */}
        <div className="mx-auto mb-14 grid max-w-3xl grid-cols-1 gap-6 text-left sm:grid-cols-2">
          <a
            href={SHORELINE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col rounded-2xl bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#dccce1]/60 text-[#334c96] transition-colors group-hover:bg-[#334c96] group-hover:text-white">
              <Users size={24} />
            </div>
            <h2 className="font-display font-semibold text-xl text-[#334c96]">Join us on Shoreline</h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600">
              Become an official WiCS member on UCSB Shoreline.
            </p>
            <span className="mt-4 inline-flex items-center gap-1 font-semibold text-[#6e4479]">
              Join on Shoreline <ArrowRight size={16} />
            </span>
          </a>

          <a
            href={introMailto}
            className="group flex flex-col rounded-2xl bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#dccce1]/60 text-[#334c96] transition-colors group-hover:bg-[#334c96] group-hover:text-white">
              <Mail size={24} />
            </div>
            <h2 className="font-display font-semibold text-xl text-[#334c96]">Send us an intro email</h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600">
              Tell us a little about yourself. We&apos;ve filled in a template, so you only need to
              add your details.
            </p>
            <span className="mt-4 inline-flex items-center gap-1 font-semibold text-[#6e4479]">
              Email us <ArrowRight size={16} />
            </span>
          </a>
        </div>
        <p className="-mt-8 mb-14 text-sm text-gray-500">
          Email button not opening? Write to us at{" "}
          <a href={`mailto:${CLUB_EMAIL}`} className="underline underline-offset-4 hover:text-[#334c96]">
            {CLUB_EMAIL}
          </a>
          .
        </p>

        <div className="mx-auto grid max-w-2xl grid-cols-1 sm:grid-cols-2 gap-10 text-lg md:text-xl text-[#6e4479]">
          {links.map((l) => (
            <div key={l.label} className="mx-auto flex w-full max-w-[260px] flex-col items-center">
              <img src={l.img} alt={l.alt} className="w-full p-5" />
              <a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-[#334c96]"
              >
                {l.label}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Sponsor */}
      <section id="sponsor" className="scroll-mt-24 w-full bg-[#f7f5f9] px-6 py-16">
        <div className="mx-auto grid max-w-4xl items-center gap-10 md:grid-cols-2">
          <div className="text-center md:text-left">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#dccce1]/60 text-[#334c96] md:mx-0">
              <Handshake size={26} />
            </div>
            <h2 className="font-display font-bold text-3xl mb-4 text-[#334c96]">Sponsor WiCS</h2>
            <p className="text-lg leading-relaxed text-[#6e4479]">
              Help us bring workshops, career events, and high school outreach to more students.
              Reach out to learn about sponsorship opportunities.
            </p>
            <a
              href={SPONSOR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#334c96] px-6 py-3 font-bold text-white transition-colors hover:bg-[#6e4479]"
            >
              Become a sponsor <ArrowRight size={18} />
            </a>
          </div>

          <div className="mx-auto flex w-full max-w-[260px] flex-col items-center">
            <img src={SPONSOR_QR} alt="Sponsor WiCS QR code" className="w-full rounded-2xl bg-white p-5 shadow-md" />
            <p className="mt-3 text-sm text-gray-600">Scan to learn more</p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}