/**
 * Defaults de Open Graph do site. O merge de metadata do Next é raso por campo:
 * uma página que declara o próprio `openGraph` descarta por inteiro o do layout,
 * então precisa reespalhar estes campos (`...OG_DEFAULTS`).
 */
export const OG_DEFAULTS = {
  siteName: 'Craft & Code Club',
  locale: 'pt_BR',
  type: 'website',
} as const;

export const DEFAULT_POST_KEYWORDS = [
  'Blog',
  'Artigo',
  'Desenvolvimento de Software',
  'Aprendizado',
  'Comunidade',
  'Algoritmos',
  'Estruturas de Dados',
  'System Design',
  'DDD',
];

export const DEFAULT_EVENT_KEYWORDS = [
  'Eventos',
  'Workshops',
  'Meetups',
  'Comunidade',
  'Desenvolvimento de Software',
  'Algoritmos',
  'Estruturas de Dados',
  'System Design',
  'DDD',
];

export function buildKeywords(specific: string[], defaults: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const rawKeyword of [...specific, ...defaults]) {
    const keyword = rawKeyword.trim();
    if (!keyword) continue;

    const normalized = keyword.toLowerCase();
    if (!seen.has(normalized)) {
      seen.add(normalized);
      result.push(keyword);
    }
  }

  return result;
}
