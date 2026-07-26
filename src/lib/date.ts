/**
 * Returns today's date as 'YYYY-MM-DD' in the America/Sao_Paulo timezone.
 *
 * Event dates and times in this project are authored in Brazil time (UTC-03:00,
 * see the `-03:00` offsets in EventCard). Deriving "today" from
 * `new Date().toISOString()` uses UTC, which rolls over to the next day after
 * ~21:00 BRT — prematurely classifying same-day events as past. Computing the
 * date in the São Paulo zone keeps the comparison aligned with the event data.
 */
export function getTodayInSaoPaulo(): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';

  return `${get('year')}-${get('month')}-${get('day')}`;
}

/**
 * Default event duration assumed when the `time` field has a start but no
 * explicit end segment, so such events become "past" 1h30m after they start
 * rather than lasting the whole day.
 */
const DEFAULT_EVENT_DURATION_MS = 90 * 60 * 1000; // 1h30m

/**
 * Returns the instant (epoch ms) an event starts. Falls back to the start of
 * the day when `time` is missing or unparseable.
 */
function getEventStartInstant(date: string, time?: string): number {
  const startTime = time?.split('-')[0]?.trim();
  if (startTime && /^\d{2}:\d{2}$/.test(startTime)) {
    return new Date(`${date}T${startTime}:00-03:00`).getTime();
  }
  return new Date(`${date}T00:00:00-03:00`).getTime();
}

/**
 * Returns the instant (epoch ms) an event ends, given its 'YYYY-MM-DD' date
 * and 'HH:MM-HH:MM' time range, both authored in Brazil time (UTC-03:00,
 * fixed offset — Brazil has observed no DST since 2019).
 *
 * When there is no explicit end segment, falls back to the start instant plus
 * `DEFAULT_EVENT_DURATION_MS` (1h30m), so the event becomes "past" 1h30m after
 * it starts instead of lasting the whole day.
 */
function getEventEndInstant(date: string, time?: string): number {
  const endTime = time?.split('-')[1]?.trim();
  if (endTime && /^\d{2}:\d{2}$/.test(endTime)) {
    return new Date(`${date}T${endTime}:00-03:00`).getTime();
  }
  return getEventStartInstant(date, time) + DEFAULT_EVENT_DURATION_MS;
}

/**
 * Whether an event has already ended, comparing its end time (not just its
 * date) against the current instant. `Date.now()` is an absolute epoch value,
 * so this comparison is correct regardless of the server's local timezone.
 */
export function isEventPast(date: string, time?: string): boolean {
  return getEventEndInstant(date, time) < Date.now();
}

/**
 * Whether an event is happening today in São Paulo time AND hasn't ended yet.
 * Used to drive the "Acontecendo Hoje!" indicator so it disappears once the
 * event's end time has passed, instead of lasting the whole day.
 */
export function isEventToday(date: string, time?: string): boolean {
  return date === getTodayInSaoPaulo() && !isEventPast(date, time);
}

/**
 * Sort key (epoch ms) for ordering events by their start instant, so events
 * on the same date are ordered by time as well.
 */
export function getEventStartTimestamp(date: string, time?: string): number {
  return getEventStartInstant(date, time);
}
