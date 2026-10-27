"use client";
import Carousel from "@/components/Carousel";
import React from "react";
import Footer from "@/components/Footer";
import { teamMembers, alumniList } from "@/data/team";
import { teamContent } from "@/data/content";
import { Mail } from "lucide-react";
import Image from "next/image";

export default function HomePage() {
  const splitIndex = Math.ceil(alumniList.length / 3);

  const slides = teamContent.slides.map((src, i) => {
    return (
      <div key={i} className="relative w-full h-full">
        <img
          src={src}
          alt={`${teamContent.title}`}
          className="object-cover rounded-2xl shadow-md"
        />
      </div>
    );
  });

  return (
    <main className="flex flex-col min-h-screen">
      {/* Officers Section */}
      <section className="w-full py-16 px-6">
        <div className="md:max-w-5xl mx-auto text-center">
          <h2 className="font-display font-bold text-3xl mb-10 text-[#334c96]">
            Who We Are
          </h2>
          <Carousel slides={slides} autoPlayInterval={3000} />

          {/* Team Grid Section */}
          <h2 className="mt-[15vh] font-display font-bold text-3xl mb-10 text-[#334c96]">
            Meet the Team!
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="flex flex-col items-center text-center"
              >
                {/* Circular image */}
                <div className="relative w-20 h-20 md:w-40 md:h-40 rounded-full overflow-hidden shadow-md mb-4">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                  <h3 className="font-semibold text-md md:text-2xl mb-2 text-[#6e4479]">
                    {member.name}
                  </h3>
                  <div className="flex flex-row  items-center justify-center">
                    <p className="text-[#334c96] text-md leading-relaxed">
                        {member.position} 
                    </p>
                    <a href={`mailto:${member.email}`}
                    className="inline-flex gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#dccce1]/60 text-[#334c96] hover:bg-[#334c96] hover:text-white transition-colors duration-200">
                        <Mail size={30} />
                    </a>
                  </div>
                </div>
            ))}
          </div>
        </div>
      </section>
      {/* Alumni Section */}
      <section className="w-full py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-left font-display font-bold text-3xl mb-10 text-[#334c96]">
            WiCS Alumni
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <ul className="list-disc">
              {alumniList.slice(0, splitIndex).map((alumni, index) => (
                  <li key={index}>
                    <div className="flex flex-row items-center">
                      <p className="text-[#334c96] text-lg leading-relaxed">
                          {alumni.name} 
                      </p>
                      <a href={`mailto:${alumni.email}`}
                      className="inline-flex gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#dccce1]/60 text-[#334c96] hover:bg-[#334c96] hover:text-white transition-colors duration-200">
                          <Mail size={30} />
                      </a>
                    </div>
                  </li>
                ))}
            </ul>
            <ul className="list-disc">
              {alumniList.slice(splitIndex, splitIndex*2).map((alumni, index) => (
                  <li key={index}>
                    <div className="flex flex-row items-center">
                      <p className="text-[#334c96] text-lg leading-relaxed">
                          {alumni.name} 
                      </p>
                      <a href={`mailto:${alumni.email}`}
                      className="inline-flex gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#dccce1]/60 text-[#334c96] hover:bg-[#334c96] hover:text-white transition-colors duration-200">
                          <Mail size={30} />
                      </a>
                    </div>
                  </li>
                ))}
            </ul>
            <ul className="list-disc">
              {alumniList.slice(splitIndex*2).map((alumni, index) => (
                  <li key={index}>
                    <div className="flex flex-row items-center">
                      <p className="text-[#334c96] text-lg leading-relaxed">
                          {alumni.name} 
                      </p>
                      <a href={`mailto:${alumni.email}`}
                      className="inline-flex gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#dccce1]/60 text-[#334c96] hover:bg-[#334c96] hover:text-white transition-colors duration-200">
                          <Mail size={30} />
                      </a>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}