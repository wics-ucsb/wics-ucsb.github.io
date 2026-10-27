import Footer from "@/components/Footer";
import { useLiveEvents } from "@/lib/useLiveEvents";
import { latestEvents } from "@/lib/eventHelpers";
import { fetchGoogleCalendarEvents } from "@/lib/googleCalendar";
import FlyerGallery from "@/components/FlyerGallery";
import Calendar from "@/components/Calendar";

export default async function EventsPage() {
  const initialEvents = await fetchGoogleCalendarEvents();

  return (
    <main className="flex flex-col min-h-screen max-w-full">
      {/* Flyer Preview */}
      <section className="w-full max-w-6xl mx-auto px-10 md:px-14 lg:px-6 pb-10">
        <h1 className="text-center font-display font-bold text-4xl mb-5 mt-0 text-wics-plum">Events</h1>
        <FlyerGallery initialEvents={initialEvents} />
      </section>

      {/* Calendar */}
      <section className="w-full p-6">
        <h1 className="text-center font-display font-bold text-3xl mb-6 text-[#334c96]">Calendar</h1>
        <Calendar initialEvents={initialEvents} />
      </section>

      <Footer />
    </main>
  );
}