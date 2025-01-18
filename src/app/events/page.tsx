import { getEvents, type Event } from '@/lib/events';

function EventCard({ event }: { event: Event }) {
  return (
    <article className="flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
          <time dateTime={event.date}>
            {new Date(event.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </time>
          <span>•</span>
          <span className="text-blue-600 dark:text-blue-400">{event.type.toUpperCase()}</span>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{event.title}</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{event.description}</p>
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{event.location}</span>
          </div>
        </div>
        {event.speakers && event.speakers.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Speakers:</h3>
            <ul className="space-y-1">
              {event.speakers.map((speaker: string, index: number) => (
                <li key={index} className="text-gray-600 dark:text-gray-300">{speaker}</li>
              ))}
            </ul>
          </div>
        )}
        <a
          href={event.registrationLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
        >
          Register Now
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>
    </article>
  );
}

export default function Events() {
  const { upcoming, past } = getEvents();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Upcoming Events Section */}
        <section className="mb-16">
          <header className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Upcoming Events</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Join us for workshops, meetups, and coding sessions focused on software craftsmanship.
            </p>
          </header>

          {upcoming.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2">
              {upcoming.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-gray-600 dark:text-gray-400">No upcoming events at the moment. Check back soon!</p>
            </div>
          )}
        </section>

        {/* Past Events Section */}
        {past.length > 0 && (
          <section>
            <header className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Past Events</h2>
            </header>

            <div className="grid gap-8 md:grid-cols-2">
              {past.map((event) => (
                <article key={event.id} className="flex flex-col bg-gray-50 dark:bg-gray-800/50 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <time dateTime={event.date}>
                        {new Date(event.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </time>
                      <span>•</span>
                      <span className="text-blue-600/70 dark:text-blue-400/70">{event.type.toUpperCase()}</span>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{event.title}</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{event.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
} 