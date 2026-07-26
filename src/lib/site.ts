/** Origem canônica do site. Mesma fonte usada pelo sitemap e pela metadata. */
export const SITE_URL = process.env.SITE_URL || 'https://craftcodeclub.io';

/**
 * Transforma um caminho interno em URL absoluta, deixando URLs completas
 * intactas. Necessário onde o link sai do site, como na descrição do evento de
 * calendário, em que um `/join` relativo não resolveria.
 */
export function absoluteUrl(pathOrUrl: string): string {
  if (/^[a-z][a-z0-9+.-]*:/i.test(pathOrUrl)) return pathOrUrl;
  return new URL(pathOrUrl, SITE_URL).toString();
}
