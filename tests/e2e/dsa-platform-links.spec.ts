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
const REDIRECTS_FILE = path.join(process.cwd(), 'public', '_redirects');

/**
 * O roadmap saiu deste site e virou dsa.craftcodeclub.io. O que estes testes
 * protegem é a consolidação: uma URL só para cada conteúdo, o 301 no lugar, e
 * os links daqui apontando para o tópico certo lá — que é como este site ajuda
 * a plataforma a ranquear.
 */
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
      expect(rule?.[1], `${route} deveria apontar para a plataforma`).toContain(PLATFORM_HOST);
      // 302 diria ao Google que a mudança é temporária e o histórico da URL
      // antiga ficaria preso aqui.
      expect(rule?.[2], `${route} precisa ser 301, não ${rule?.[2]}`).toBe('301');
    }
  });

  test('o site não serve mais a página do roadmap', async ({ request }) => {
    for (const route of REDIRECTED_AWAY_ROUTES) {
      const response = await request.get(route, { maxRedirects: 0 });
      const status = response.status();

      // Em dev não existe `_redirects` (é coisa do Cloudflare), então a rota
      // some de vez: 404. Num deploy real, o 301 responde no lugar.
      if (status === 301) {
        expect(response.headers()['location']).toContain(PLATFORM_HOST);
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
    // `noreferrer` apagaria o `Referer` e o tráfego que sai daqui chegaria na
    // analytics da plataforma como "direto" — sem crédito para este site.
    // KEY_ROUTES cobre nav/rodapé/home; o evento de DSA entra à parte porque é
    // o terceiro lugar que renderiza o callout (EventDetailClient).
    const routes = [...new Set([...KEY_ROUTES, '/events/dsa-stacks'])];

    const offenders = await mapWithConcurrency(routes, 4, async (route) => {
      const html = await fetchHtml(request, route);
      const anchors = html.match(/<a\b[^>]*>/g) ?? [];
      const leaking = anchors.filter(
        (anchor) => anchor.includes(PLATFORM_HOST) && /rel="[^"]*noreferrer/.test(anchor),
      );
      return leaking.length ? `${route} → ${leaking.join(' ')}` : null;
    });

    expect(offenders.filter(Boolean)).toEqual([]);
  });
});
