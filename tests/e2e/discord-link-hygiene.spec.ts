import { expect, test } from '@playwright/test';
import {
  DISCORD_INVITE_URL,
  DISCORD_LINK_TOKEN,
  DISCORD_PAGE_PATH,
  KEY_ROUTES,
  extractHrefs,
  fetchHtml,
  gotoOk,
  findRawInvites,
  getSitemapPaths,
  mapWithConcurrency,
} from './helpers/site';

/** Todas as rotas do sitemap menos a própria página de convite. */
async function sweepablePaths(request: Parameters<typeof getSitemapPaths>[0]) {
  const paths = await getSitemapPaths(request);
  return paths.filter((path) => path !== DISCORD_PAGE_PATH);
}

/**
 * O invariante: o convite do Discord existe em UM lugar só (a página /join).
 * Todo o resto do site aponta para lá. Assim, trocar o convite é mudar uma
 * constante, e nenhum link morto sobra espalhado pelo site.
 */
test.describe('higiene dos links de Discord', () => {
  for (const route of KEY_ROUTES) {
    test(`${route} não expõe convite cru do Discord`, async ({ request }) => {
      const html = await fetchHtml(request, route);
      const invites = findRawInvites(html);

      expect(
        invites,
        `${route} deveria linkar para ${DISCORD_PAGE_PATH}, mas trouxe convite direto: ${invites.join(', ')}`,
      ).toEqual([]);
    });
  }

  for (const route of KEY_ROUTES) {
    test(`${route} manda todo link de Discord para ${DISCORD_PAGE_PATH}`, async ({ page }) => {
      await gotoOk(page, route);

      const discordLinks = page.getByRole('link', { name: /discord/i });
      const count = await discordLinks.count();
      expect(count, `${route} não tem nenhum link de Discord`).toBeGreaterThan(0);

      for (let i = 0; i < count; i++) {
        const href = await discordLinks.nth(i).getAttribute('href');
        expect(href, `link #${i} de ${route}`).toBe(DISCORD_PAGE_PATH);
      }
    });
  }

  test(`${DISCORD_PAGE_PATH} é a única página com o convite real`, async ({ request }) => {
    const joinHtml = await fetchHtml(request, DISCORD_PAGE_PATH);
    expect(findRawInvites(joinHtml)).toEqual([
      DISCORD_INVITE_URL.replace(/^https?:\/\//, ''),
    ]);
  });

  test('varredura completa: o token do markdown nunca vaza cru para a página', async ({
    request,
  }) => {
    test.slow();

    const paths = await getSitemapPaths(request);

    const offenders = await mapWithConcurrency(paths, 4, async (path) => {
      const html = await fetchHtml(request, path);
      return html.includes(DISCORD_LINK_TOKEN) ? path : null;
    });

    expect(
      offenders.filter(Boolean),
      `${DISCORD_LINK_TOKEN} apareceu na página; a resolução no build não rodou`,
    ).toEqual([]);
  });

  test('varredura completa: nenhuma página do sitemap tem convite cru', async ({ request }) => {
    test.slow();

    // A /join está no sitemap e é a dona legítima do convite; o teste acima já
    // garante que ela carrega esse e só esse.
    const paths = await sweepablePaths(request);
    expect(paths.length, 'sitemap vazio, a varredura não testaria nada').toBeGreaterThan(10);

    const offenders = await mapWithConcurrency(paths, 4, async (path) => {
      const invites = findRawInvites(await fetchHtml(request, path));
      return invites.length ? `${path} → ${invites.join(', ')}` : null;
    });

    expect(offenders.filter(Boolean)).toEqual([]);
  });

  test('varredura completa: todo href de discord aponta para a página de convite', async ({
    request,
  }) => {
    test.slow();

    const paths = await sweepablePaths(request);

    const offenders = await mapWithConcurrency(paths, 4, async (path) => {
      const bad = extractHrefs(await fetchHtml(request, path)).filter((href) =>
        /discord/i.test(href) && href !== DISCORD_PAGE_PATH,
      );
      return bad.length ? `${path} → ${bad.join(', ')}` : null;
    });

    expect(offenders.filter(Boolean)).toEqual([]);
  });
});
