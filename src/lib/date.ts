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
