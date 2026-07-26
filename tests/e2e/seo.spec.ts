import { expect, test } from '@playwright/test';
import { DISCORD_PAGE_PATH, KEY_ROUTES, fetchHtml, getSitemapPaths } from './helpers/site';

const INDEXABLE_ROUTES = [...KEY_ROUTES, DISCORD_PAGE_PATH];

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
