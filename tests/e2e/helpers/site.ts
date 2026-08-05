import type { APIRequestContext, Page } from '@playwright/test';
import { DISCORD_INVITE_URL, DISCORD_LINK_TOKEN, DISCORD_PAGE_PATH } from '../../../src/lib/discord';

export { DISCORD_INVITE_URL, DISCORD_LINK_TOKEN, DISCORD_PAGE_PATH };

/**
 * Rotas representativas: cada uma exercita um componente diferente que já
 * renderizou link de Discord em algum momento (hero da home, header/footer do
 * layout, EventCard, EventDetailClient, CTA do book club, corpo de post em
 * markdown). Se um convite cru voltar a aparecer no código, cai aqui.
 */
export const KEY_ROUTES = [
  '/',
  '/about',
  '/blog',
  '/events',
  '/events/past',
  '/events/book-club-ddia-chapter-1',
  '/book-clubs/designing-data-intensive-applications',
  '/posts/dsa-dijkstra',
  '/codigo-conduta',
  '/topics',
  '/topics/algoritmos',
] as const;

/**
 * Rotas que saíram do site e viraram 301 para dsa.craftcodeclub.io
 * (`public/_redirects`). Não podem voltar a existir como página nem a ser
 * linkadas daqui: link interno para uma URL que redireciona desperdiça o salto
 * e a página duplicaria o conteúdo da plataforma.
 */
export const REDIRECTED_AWAY_ROUTES = ['/roadmap/dsa', '/roadmap'] as const;

/** Qualquer convite direto do Discord, não só o que está em uso hoje. */
export const RAW_INVITE_PATTERN = /discord\.(gg|com\/invite)\/[A-Za-z0-9-]+/g;

export function findRawInvites(html: string): string[] {
  return [...new Set(html.match(RAW_INVITE_PATTERN) ?? [])];
}

/** Extrai os `href` de todos os `<a>` do HTML. */
export function extractHrefs(html: string): string[] {
  return [...html.matchAll(/<a\b[^>]*\bhref="([^"]*)"/g)].map((m) => m[1]);
}

/**
 * Busca o HTML de uma rota. O dev server compila sob demanda, então a primeira
 * requisição de uma rota pode responder 5xx enquanto o Turbopack ainda está
 * montando o módulo, daí a retentativa. Erro 4xx é problema de verdade e
 * estoura na hora.
 */
export async function fetchHtml(
  request: APIRequestContext,
  route: string,
  attempts = 3,
): Promise<string> {
  let lastStatus = 0;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    const response = await request.get(route);
    if (response.ok()) {
      return response.text();
    }

    lastStatus = response.status();
    if (lastStatus < 500) break;

    await new Promise((resolve) => setTimeout(resolve, 300 * attempt));
  }

  throw new Error(`GET ${route} respondeu ${lastStatus}`);
}

/**
 * Navega e garante resposta 2xx. Mesmo motivo do retry acima: em dev, a
 * primeira visita a uma rota pode pegar o Turbopack no meio da compilação.
 */
export async function gotoOk(page: Page, route: string, attempts = 3): Promise<void> {
  let lastStatus = 0;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    const response = await page.goto(route);
    lastStatus = response?.status() ?? 0;

    if (lastStatus >= 200 && lastStatus < 400) return;
    if (lastStatus < 500) break;

    await page.waitForTimeout(300 * attempt);
  }

  throw new Error(`Navegar para ${route} respondeu ${lastStatus}`);
}

/** Lê as <loc> do sitemap e devolve os caminhos (sem o domínio). */
export async function getSitemapPaths(request: APIRequestContext): Promise<string[]> {
  const xml = await fetchHtml(request, '/sitemap.xml');
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
}

/** Roda `worker` sobre `items` com concorrência limitada. */
export async function mapWithConcurrency<T, R>(
  items: readonly T[],
  limit: number,
  worker: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let cursor = 0;

  async function run() {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await worker(items[index]);
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, run));
  return results;
}
