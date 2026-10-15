import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { expect, test } from '@playwright/test';
import {
  DISCORD_PAGE_PATH,
  KEY_ROUTES,
  fetchHtml,
  fetchPage,
  getSitemapPaths,
} from './helpers/site';

const INDEXABLE_ROUTES = [...KEY_ROUTES, DISCORD_PAGE_PATH];

const REDIRECTS_FILE = path.join(process.cwd(), 'public', '_redirects');

const EVENTS_DIR = path.join(process.cwd(), '_content', 'events');

const events = fs.readdirSync(EVENTS_DIR).map((fileName) => {
  const { data } = matter(fs.readFileSync(path.join(EVENTS_DIR, fileName), 'utf8'));
  return { id: fileName.replace(/\.md$/, ''), banner: data.banner as string | undefined };
});

/** O sufixo que o `title.template` do layout raiz acrescenta, já escapado no HTML. */
const BRAND_SUFFIX = ' | Craft &amp; Code Club';

/**
 * A página 1 de cada listagem existe só para redirecionar: o conteúdo mora na
 * URL canônica sem paginação. No dev server isso é um 307; em produção quem
 * responde é a regra do `_redirects` no Cloudflare, que o dev não aplica.
 */
const PAGINATION_STUBS = [
  { route: '/blog/page/1', destination: '/blog' },
  { route: '/topics/algoritmos/page/1', destination: '/topics/algoritmos' },
  { route: '/events/past', destination: '/events/past/1' },
] as const;

test.describe('indexação', () => {
  test(`${DISCORD_PAGE_PATH} está no sitemap`, async ({ request }) => {
    const paths = await getSitemapPaths(request);
    expect(paths).toContain(DISCORD_PAGE_PATH);
  });

  test('o robots.txt não bloqueia a página de convite', async ({ request }) => {
    const robots = await fetchHtml(request, '/robots.txt');

    const disallows = [...robots.matchAll(/^Disallow:\s*(\S+)\s*$/gim)].map((m) => m[1]);
    const blocking = disallows.filter((rule) => DISCORD_PAGE_PATH.startsWith(rule));

    expect(blocking, `robots.txt bloqueia ${DISCORD_PAGE_PATH}`).toEqual([]);
  });

  test(`${DISCORD_PAGE_PATH} tem metadata pronta para compartilhamento`, async ({ request }) => {
    // A página existe para ser compartilhada, então o card do link importa.
    const html = await fetchHtml(request, DISCORD_PAGE_PATH);

    expect(html).toMatch(/<meta property="og:title"/);
    expect(html).toMatch(/<meta property="og:description"/);
    expect(html).toMatch(/<meta property="og:image"/);
  });

  for (const route of INDEXABLE_ROUTES) {
    test(`${route} é indexável`, async ({ request }) => {
      const html = await fetchHtml(request, route);
      const robotsMeta = html.match(/<meta name="robots" content="([^"]*)"/)?.[1] ?? '';

      expect(robotsMeta, `${route} ganhou um noindex sem querer`).not.toContain('noindex');
    });
  }
});

test.describe('card de compartilhamento dos eventos', () => {
  test('evento com banner usa o banner como imagem do card', async ({ request }) => {
    const event = events.find((e) => e.banner);
    expect(event, 'nenhum evento com banner em _content/events').toBeDefined();

    const html = await fetchHtml(request, `/events/${event!.id}`);
    const ogImage = html.match(/<meta property="og:image" content="([^"]*)"/)?.[1];

    expect(ogImage, `/events/${event!.id} está sem og:image`).toBeDefined();
    expect(decodeURIComponent(new URL(ogImage!).pathname)).toBe(`/events/${event!.banner}`);
    // O card do X não é declarado na página: o Next copia a imagem do Open
    // Graph. Se um upgrade mudar isso, o link volta a sair sem imagem no X.
    expect(html).toContain(`<meta name="twitter:image" content="${ogImage}"/>`);
    expect(html).toContain('<meta name="twitter:card" content="summary_large_image"/>');
    // O `openGraph` da página substitui o do layout por inteiro.
    expect(html).toContain('<meta property="og:site_name" content="Craft &amp; Code Club"/>');
  });

  test('evento sem banner não declara imagem no card', async ({ request }) => {
    const event = events.find((e) => !e.banner);
    expect(event, 'nenhum evento sem banner em _content/events').toBeDefined();

    const html = await fetchHtml(request, `/events/${event!.id}`);

    expect(html).not.toMatch(/<meta property="og:image"/);
    expect(html).toContain('<meta name="twitter:card" content="summary"/>');
  });
});

test.describe('metadata global', () => {
  for (const route of INDEXABLE_ROUTES) {
    test(`${route} tem canonical autorreferente`, async ({ request }) => {
      // Sem canonical, apex, www e os previews *.pages.dev competem pelo mesmo
      // conteúdo e o Google escolhe sozinho qual indexar.
      const { html, url } = await fetchPage(request, route);
      const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];

      expect(canonical, `${route} está sem canonical`).toBeDefined();
      expect(new URL(canonical!).pathname, `o canonical de ${route} aponta para outra página`).toBe(
        new URL(url).pathname,
      );
      // O Cloudflare serve sem barra final; canônica e sitemap têm de usar a
      // mesma forma, senão viram duas URLs para a mesma página.
      expect(canonical, `o canonical de ${route} tem barra final`).not.toMatch(/[^/]\/$/);
    });
  }

  for (const route of INDEXABLE_ROUTES) {
    test(`${route} tem o sufixo da marca uma única vez no título`, async ({ request }) => {
      // O sufixo vem do `title.template` do layout. Se a página também o
      // concatenar à mão, sai duplicado.
      const { html } = await fetchPage(request, route);
      const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '';
      const occurrences = title.split(BRAND_SUFFIX).length - 1;

      expect(occurrences, `o título de ${route} repete o sufixo da marca: ${title}`).toBeLessThanOrEqual(1);

      if (route !== '/') {
        expect(
          title.endsWith(BRAND_SUFFIX),
          `${route} caiu no título padrão do layout, sem título próprio: ${title}`,
        ).toBe(true);
      }
    });
  }
});

test.describe('stubs de paginação', () => {
  for (const { route, destination } of PAGINATION_STUBS) {
    test(`${route} redireciona para ${destination}`, async ({ request }) => {
      const response = await request.get(route, { maxRedirects: 0 });

      expect(response.status(), `${route} deveria redirecionar`).toBeGreaterThanOrEqual(300);
      expect(response.status()).toBeLessThan(400);
      expect(new URL(response.headers()['location'], 'http://localhost').pathname).toBe(destination);
    });
  }

  test('os stubs têm 301 declarado no _redirects', () => {
    // O dev server ignora o `_redirects`, então em produção é essa regra que
    // impede o Cloudflare de servir o HTML vazio do stub com 200.
    const rules = fs
      .readFileSync(REDIRECTS_FILE, 'utf8')
      .split('\n')
      .filter((line) => line.trim() && !line.trim().startsWith('#'))
      .map((line) => line.trim().split(/\s+/));

    const expected = [
      ['/blog/page/1', '/blog'],
      ['/events/past', '/events/past/1'],
      ['/topics/:topic/page/1', '/topics/:topic'],
    ];

    for (const [source, destination] of expected) {
      const rule = rules.find(([ruleSource]) => ruleSource === source);

      expect(rule, `sem regra de redirect para ${source}`).toBeDefined();
      expect(rule?.[1], `${source} deveria apontar para ${destination}`).toBe(destination);
      expect(rule?.[2], `${source} precisa ser 301, não ${rule?.[2]}`).toBe('301');
    }
  });
});

test.describe('página 404', () => {
  test('não herda o `index, follow` do layout nem o canonical', async ({ request }) => {
    // O layout raiz declara `index, follow` para o site inteiro. A 404 precisa
    // sobrescrever isso: o noindex que o Next injeta sozinho convive com a
    // diretiva herdada, e as duas saem se contradizendo no mesmo HTML.
    const response = await request.get('/rota-que-nao-existe-9f3a', { maxRedirects: 0 });

    expect(response.status()).toBe(404);

    const html = await response.text();
    const directives = [...html.matchAll(/<meta name="robots" content="([^"]*)"/g)].map((m) => m[1]);

    expect(directives.length, 'a 404 está sem meta robots').toBeGreaterThan(0);
    for (const directive of directives) {
      expect(directive, `a 404 saiu com "${directive}"`).toContain('noindex');
    }

    // Sem o `canonical: null`, a 404 herda o canonical do layout e aponta para
    // o pathname interno /_not-found.
    expect(html, 'a 404 não pode declarar canonical').not.toMatch(/<link rel="canonical"/);
  });
});
