import { getEventData } from '@/lib/events';
import { notFound } from 'next/navigation';

export default async function Event({ params }: { params: { id: string } }) {
  try {
    const event = await getEventData(params.id);
    const eventDate = new Date(event.date);
    const isUpcoming = eventDate >= new Date();

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <article>
          <header className="mb-8">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
              <time dateTime={event.date}>{eventDate.toLocaleDateString('en-US', { 
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</time>
              <span>•</span>
              <span>{event.time}</span>
            </div>
            <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  event.type === 'online' ? 'bg-green-100 text-green-800' :
                  event.type === 'in-person' ? 'bg-blue-100 text-blue-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                </span>
                <span className="text-gray-600">{event.location}</span>
              </div>
              {isUpcoming && (
                <a 
                  href={event.registrationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Register Now
                </a>
              )}
            </div>
          </header>

          <div className="prose lg:prose-lg max-w-none">
            <p className="text-xl text-gray-600 mb-8">{event.description}</p>

            {event.speakers && event.speakers.length > 0 && (
              <div className="mb-8">
                <h2>Speakers</h2>
                <ul className="list-none p-0">
                  {event.speakers.map((speaker, index) => (
                    <li key={index} className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                        {speaker.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-lg">{speaker}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {!isUpcoming && (
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">This event has ended</h2>
                <p className="text-gray-600">
                  Follow us on social media to stay updated about future events!
                </p>
              </div>
            )}
          </div>
        </article>
      </div>
    );
  } catch (_) {
    notFound();
  }
} 