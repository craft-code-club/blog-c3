import { getSortedEventsData } from '@/lib/events';
import Link from 'next/link';

export default function Events() {
  const events = getSortedEventsData();
  const upcomingEvents = events.filter(event => new Date(event.date) >= new Date());
  const pastEvents = events.filter(event => new Date(event.date) < new Date());

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold mb-8">Community Events</h1>
      
      {/* Upcoming Events */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6">Upcoming Events</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {upcomingEvents.map((event) => (
            <article key={event.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  <time dateTime={event.date}>{new Date(event.date).toLocaleDateString('en-US', { 
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</time>
                  <span>•</span>
                  <span>{event.time}</span>
                </div>
                <Link href={`/events/${event.id}`}>
                  <h3 className="text-xl font-semibold mb-3 hover:text-blue-600 transition-colors">{event.title}</h3>
                </Link>
                <p className="text-gray-600 mb-4">{event.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      event.type === 'online' ? 'bg-green-100 text-green-800' :
                      event.type === 'in-person' ? 'bg-blue-100 text-blue-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                    </span>
                    <span className="text-sm text-gray-600">{event.location}</span>
                  </div>
                  <a 
                    href={event.registrationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Register
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
        {upcomingEvents.length === 0 && (
          <p className="text-gray-600 text-center py-8">No upcoming events at the moment. Check back soon!</p>
        )}
      </section>

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-6">Past Events</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {pastEvents.map((event) => (
              <article key={event.id} className="bg-white/50 rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <time dateTime={event.date}>{new Date(event.date).toLocaleDateString('en-US', { 
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</time>
                    <span>•</span>
                    <span>{event.time}</span>
                  </div>
                  <Link href={`/events/${event.id}`}>
                    <h3 className="text-xl font-semibold mb-3 hover:text-blue-600 transition-colors">{event.title}</h3>
                  </Link>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800`}>
                      Past Event
                    </span>
                    <span className="text-sm text-gray-600">{event.location}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
} 