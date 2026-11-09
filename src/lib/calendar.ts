import type { Event } from '@/lib/events';
import { getEventEndTimestamp, getEventStartTimestamp } from '@/lib/date';
import { SITE_URL, absoluteUrl } from '@/lib/site';

/**
 * Feed iCalendar (RFC 5545) com todos os eventos, servido em `/calendar.ics`.
 *
 * A ideia é assinar a URL uma vez (Apple Calendar, Google Calendar, Outlook) e
 * deixar o app buscar de novo sozinho: um evento novo aparece no calendário de
 * quem assinou depois do próximo deploy, sem baixar nada.
 *
 * Entram também os eventos passados, para que não sumam do calendário de quem
 * assinou depois que acontecem.
 */

/**
 * Intervalo de atualização sugerido aos apps. Apple Calendar e Outlook levam em
 * conta; o Google Calendar ignora e atualiza no ritmo dele.
 */
const REFRESH_INTERVAL = 'PT1H';

const CALENDAR_NAME = 'Craft & Code Club';
const CALENDAR_DESCRIPTION = 'Eventos da comunidade Craft & Code Club';

/** Limite de uma linha do iCalendar, em octetos, antes de quebrar (RFC 5545, 3.1). */
const MAX_LINE_OCTETS = 75;

const encoder = new TextEncoder();

export function buildEventsCalendar(events: Event[], now: Date = new Date()): string {
  // O UID usa o id do evento (nome do arquivo), que não muda. Assim, editar um
  // evento atualiza a entrada no calendário em vez de criar outra.
  const uidDomain = new URL(SITE_URL).hostname;
  const dtstamp = formatUtc(now.getTime());

  const sorted = [...events].sort(
    (a, b) => getEventStartTimestamp(a.date, a.time) - getEventStartTimestamp(b.date, b.time),
  );

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Craft & Code Club//Eventos//PT',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeText(CALENDAR_NAME)}`,
    `X-WR-CALDESC:${escapeText(CALENDAR_DESCRIPTION)}`,
    'X-WR-TIMEZONE:America/Sao_Paulo',
    `REFRESH-INTERVAL;VALUE=DURATION:${REFRESH_INTERVAL}`,
    `X-PUBLISHED-TTL:${REFRESH_INTERVAL}`,
    ...sorted.flatMap((event) => eventLines(event, uidDomain, dtstamp)),
    'END:VCALENDAR',
  ];

  return lines.map(foldLine).join('\r\n') + '\r\n';
}

function eventLines(event: Event, uidDomain: string, dtstamp: string): string[] {
  const pageUrl = absoluteUrl(`/events/${event.id}`);

  // Horários em UTC, a partir do horário de Brasília do frontmatter (mesmo
  // cálculo do resto do site), para não depender de VTIMEZONE.
  const lines = [
    'BEGIN:VEVENT',
    `UID:${event.id}@${uidDomain}`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART:${formatUtc(getEventStartTimestamp(event.date, event.time))}`,
    `DTEND:${formatUtc(getEventEndTimestamp(event.date, event.time))}`,
    `SUMMARY:${escapeText(event.title)}`,
    `DESCRIPTION:${escapeText(describe(event, pageUrl))}`,
    `LOCATION:${escapeText(event.location)}`,
    `URL:${pageUrl}`,
  ];

  if (event.tags?.length) {
    lines.push(`CATEGORIES:${event.tags.map(escapeText).join(',')}`);
  }

  lines.push('END:VEVENT');
  return lines;
}

/** Texto da descrição: o resumo do evento, palestrantes e os links úteis. */
function describe(event: Event, pageUrl: string): string {
  const sections = [event.description];

  if (event.speakers?.length) {
    sections.push(`Palestrantes: ${event.speakers.map((speaker) => speaker.name).join(', ')}`);
  }

  const links = [`Detalhes: ${pageUrl}`];
  if (event.registrationLink) links.push(`Participar: ${absoluteUrl(event.registrationLink)}`);
  if (event.recordingLink) links.push(`Live/gravação: ${event.recordingLink}`);
  sections.push(links.join('\n'));

  return sections.join('\n\n');
}

/** Epoch ms para o formato UTC do iCalendar, como `20261116T230000Z`. */
function formatUtc(ms: number): string {
  return new Date(ms).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

/** Escapa um valor TEXT (RFC 5545, 3.3.11). */
function escapeText(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

/**
 * Quebra linhas acima de 75 octetos, continuando na linha seguinte com um
 * espaço (RFC 5545, 3.1). Conta em bytes UTF-8 e nunca corta um caractere no
 * meio, o que importa com os acentos dos títulos.
 */
function foldLine(line: string): string {
  const chunks: string[] = [];
  let current = '';
  let size = 0;

  for (const char of line) {
    const bytes = encoder.encode(char).length;
    if (size + bytes > MAX_LINE_OCTETS) {
      chunks.push(current);
      current = ' ';
      size = 1;
    }
    current += char;
    size += bytes;
  }

  chunks.push(current);
  return chunks.join('\r\n');
}
