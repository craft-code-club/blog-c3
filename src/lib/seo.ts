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

  for (const keyword of [...specific, ...defaults]) {
    const normalized = keyword.toLowerCase();
    if (!seen.has(normalized)) {
      seen.add(normalized);
      result.push(keyword);
    }
  }

  return result;
}
