import fs from 'node:fs';
import path from 'node:path';
import { expect, test } from '@playwright/test';
import {
  KEY_ROUTES,
  REDIRECTED_AWAY_ROUTES,
  extractHrefs,
  fetchHtml,
  getSitemapPaths,
  mapWithConcurrency,
} from './helpers/site';

const PLATFORM_HOST = 'dsa.craftcodeclub.io';
const PLATFORM_ROADMAP_URL = `https://${PLATFORM_HOST}/roadmap/`;
const REDIRECTS_FILE = path.join(process.cwd(), 'public', '_redirects');

function isPlatformLink(anchorTag: string): boolean {
  const href = anchorTag.match(/\bhref="([^"]*)"/)?.[1];
  if (!href) return false;

  try {
    return new URL(href, 'https://craftcodeclub.io').hostname === PLATFORM_HOST;
  } catch {
    return false;
  }
}

test.describe('ponte com a plataforma de algoritmos', () => {
  test('as rotas removidas têm 301 declarado no _redirects', () => {
    const redirects = fs.readFileSync(REDIRECTS_FILE, 'utf8');

    const rules = redirects
      .split('\n')
      .filter((line) => line.trim() && !line.trim().startsWith('#'))
      .map((line) => line.trim().split(/\s+/));

    for (const route of REDIRECTED_AWAY_ROUTES) {
      const rule = rules.find(([source]) => source === route);

      expect(rule, `sem regra de redirect para ${route}`).toBeDefined();
      expect(rule?.[1], `${route} deveria apontar para ${PLATFORM_ROADMAP_URL}`).toBe(
        PLATFORM_ROADMAP_URL,
      );
      expect(rule?.[2], `${route} precisa ser 301, não ${rule?.[2]}`).toBe('301');
    }
  });

  test('o site não serve mais a página do roadmap', async ({ request }) => {
    for (const route of REDIRECTED_AWAY_ROUTES) {
      const response = await request.get(route, { maxRedirects: 0 });
      const status = response.status();

      if (status === 301) {
        expect(response.headers()['location']).toBe(PLATFORM_ROADMAP_URL);
      } else {
        expect(status, `${route} voltou a existir como página`).toBe(404);
      }
    }
  });

  test('nenhuma página do sitemap aponta para uma rota redirecionada', async ({ request }) => {
    test.slow();

    const paths = await getSitemapPaths(request);
    expect(paths).not.toContain('/roadmap/dsa');

    const offenders = await mapWithConcurrency(paths, 4, async (path) => {
      const hrefs = extractHrefs(await fetchHtml(request, path));
      const dead = hrefs.filter((href) =>
        REDIRECTED_AWAY_ROUTES.some((route) => href === route || href.startsWith(`${route}/`)),
      );
      return dead.length ? `${path} → ${dead.join(', ')}` : null;
    });

    expect(offenders.filter(Boolean)).toEqual([]);
  });

  test('conteúdo de DSA linka para o tópico equivalente na plataforma', async ({ request }) => {
    const expected = [
      ['/posts/dsa-dijkstra', `https://${PLATFORM_HOST}/topico/dijkstra/`],
      ['/events/dsa-graphs-dijkstra', `https://${PLATFORM_HOST}/topico/dijkstra/`],
      ['/events/dsa-stacks', `https://${PLATFORM_HOST}/topico/pilhas/`],
      ['/topics/algoritmos', `https://${PLATFORM_HOST}/roadmap/`],
    ] as const;

    for (const [route, target] of expected) {
      const hrefs = extractHrefs(await fetchHtml(request, route));
      expect(hrefs, `${route} deveria linkar ${target}`).toContain(target);
    }
  });

  test('links para a plataforma preservam o referrer', async ({ request }) => {
    const routes = [...new Set([...KEY_ROUTES, '/events/dsa-stacks'])];

    const offenders = await mapWithConcurrency(routes, 4, async (route) => {
      const html = await fetchHtml(request, route);
      const anchors = html.match(/<a\b[^>]*>/g) ?? [];
      const leaking = anchors.filter(
        (anchor) => isPlatformLink(anchor) && /\brel="[^"]*noreferrer/.test(anchor),
      );
      return leaking.length ? `${route} → ${leaking.join(' ')}` : null;
    });

    expect(offenders.filter(Boolean)).toEqual([]);
  });
});
