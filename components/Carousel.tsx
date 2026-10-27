"use client";
import { ReactNode, useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface CarouselProps {
  slides: ReactNode[];
  autoPlayInterval?: number; // ms, defaults to 5000
}

export default function Carousel({ slides, autoPlayInterval = 5000 }: CarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const count = slides.length;

  const prev = () => setCurrent((c) => (c === 0 ? count - 1 : c - 1));
  const next = () => setCurrent((c) => (c === count - 1 ? 0 : c + 1));

  // Autoplay (restarts after every slide change, including manual ones)
  useEffect(() => {
    if (isPaused || count <= 1) return;
    const id = setTimeout(() => setCurrent((c) => (c + 1) % count), autoPlayInterval);
    return () => clearTimeout(id);
  }, [current, isPaused, autoPlayInterval, count]);

  return (
    <div
      className="relative w-full h-full flex items-center justify-center"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="grid w-full h-full">
        {slides.map((slide, i) => (
          <div
            key={i}
            aria-hidden={i !== current}
            className={`col-start-1 row-start-1 transition-[opacity,visibility] duration-300 ${
              i === current ? "visible opacity-100" : "invisible opacity-0"
            }`}
          >
            {slide}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/60 shadow-md text-[#334c96] hover:bg-white hover:scale-110 transition-all duration-200"
      >
        <ArrowLeft size={22} strokeWidth={2.5} />
      </button>

      <button
        type="button"
        onClick={next}
        aria-label="Next slide"
        className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/60 shadow-md text-[#334c96] hover:bg-white hover:scale-110 transition-all duration-200"
      >
        <ArrowRight size={22} strokeWidth={2.5} />
      </button>

      <div className="absolute bottom-4 flex gap-2 z-20">
        {slides.map((_, i) => (
          <button
            type="button"
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-200 ${
              i === current ? "w-4 bg-[#334c96]" : "w-2 bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}