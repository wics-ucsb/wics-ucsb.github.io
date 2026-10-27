import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { heroContent } from "../data/content";
import Carousel from "./Carousel";

const highlights = [
  {
    tag: "Technical & professional development",
    blurb: "We conduct workshops, tech talks, and career events that build real skills.",
  },
  {
    tag: "Community building",
    blurb: "We facilitate mentoring, socials, and study groups with women in tech at UCSB.",
  },
  {
    tag: "High school outreach",
    blurb: "We introduce high school students to computing and the people in it.",
  },
];

export default function Hero() {
  const slides = heroContent.slides.map((src, i) => {
    const highlight = highlights[i % highlights.length];
    return (
      <div key={i} className="relative w-full h-full">
        <Image
          src={src}
          alt={`${heroContent.title} event ${i + 1}`}
          fill
          priority={i === 0}
          className="object-cover"
        />
        {/* Bottom-left corner gradient: more opaque in the corner, fading out */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at bottom left, rgba(51,76,150,0.92) 0%, rgba(51,76,150,0.65) 40%, rgba(51,76,150,0) 80%)",
          }}
        />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-2xl px-6 pb-14 text-left text-white md:pl-24 md:pb-16">
            <h1 className="font-display font-bold text-4xl md:text-6xl leading-tight">
              We are WiCS
            </h1>
            <p className="mt-3 text-xl font-semibold text-[#dccce1] md:text-2xl">{highlight.tag}: {highlight.blurb}</p>
            <Link
              href="/engage#join"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-bold text-[#334c96] hover:bg-[#dccce1] transition-colors"
            >
              How to join <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    );
  });

  return (
    <section className="relative w-full h-[70vh] md:h-[90vh] min-h-[460px] max-h-[760px] bg-[#dccce1] overflow-hidden">
      <Carousel slides={slides} autoPlayInterval={3000} />
    </section>
  );
}