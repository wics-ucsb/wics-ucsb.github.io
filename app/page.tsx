import Hero from "@/components/Hero";
import WhyJoin from "@/components/WhyJoin";
import NewsPreview from "@/components/NewsPreview";
import Footer from "@/components/Footer";
import { fetchGoogleCalendarEvents } from "@/lib/googleCalendar";

export default async function HomePage() {
  const events = await fetchGoogleCalendarEvents();

  return (
    <main className="flex flex-col min-h-screen w-full">
      <Hero />
      <WhyJoin />
      <NewsPreview initialEvents={events} />
      <Footer />
    </main>
  );
}