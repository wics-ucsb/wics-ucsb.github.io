import Footer from "@/components/Footer";
import EventsContent from "@/components/EventsContent";
import { fetchGoogleCalendarEvents } from "@/lib/googleCalendar";

export default async function EventsPage() {
  const events = await fetchGoogleCalendarEvents();
  return (
    <main className="flex flex-col min-h-screen max-w-full">
      <h1 className="text-center font-display font-bold text-4xl mb-5 mt-0 text-[#6e4479]">Events</h1>
      <EventsContent initialEvents={events} />
      <Footer />
    </main>
  );
}