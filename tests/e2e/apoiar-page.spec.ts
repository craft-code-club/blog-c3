import { expect, test } from '@playwright/test';
import { fetchHtml, getSitemapPaths, gotoOk } from './helpers/site';

const APOIAR_PATH = '/apoiar';
const APOIA_URL = 'https://apoia.se/craftcodeclub';

test.describe(`página de apoio (${APOIAR_PATH})`, () => {
  test(`${APOIAR_PATH} está no sitemap`, async ({ request }) => {
    const paths = await getSitemapPaths(request);
    expect(paths).toContain(APOIAR_PATH);
  });

  test(`${APOIAR_PATH} é indexável`, async ({ request }) => {
    const html = await fetchHtml(request, APOIAR_PATH);
    const robotsMeta = html.match(/<meta name="robots" content="([^"]*)"/)?.[1] ?? '';

    expect(robotsMeta, `${APOIAR_PATH} ganhou um noindex sem querer`).not.toContain('noindex');
  });

  test('carrega (2xx) com o CTA de apoio em destaque', async ({ page }) => {
    await gotoOk(page, APOIAR_PATH);

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    // Há dois "Quero apoiar" (card principal e placeholder); o do topo é o principal.
    const cta = page.locator('main').getByRole('link', { name: /quero apoiar/i }).first();
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute('href', APOIA_URL);
  });

  test('o CTA abre a APOIA.se com rel seguro', async ({ page }) => {
    await gotoOk(page, APOIAR_PATH);

    const cta = page.locator('main').getByRole('link', { name: /quero apoiar/i }).first();
    await expect(cta).toHaveAttribute('target', '_blank');

    const rel = (await cta.getAttribute('rel')) ?? '';
    expect(rel).toContain('noopener');
    expect(rel).toContain('noreferrer');
  });

  test('declara canonical próprio', async ({ page }) => {
    await gotoOk(page, APOIAR_PATH);

    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toMatch(new RegExp(`${APOIAR_PATH}$`));
  });

  test('renderiza no mobile sem estourar a largura', async ({ page }) => {
    await gotoOk(page, APOIAR_PATH);
    await page.setViewportSize({ width: 375, height: 812 });

    const overflows = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(overflows, 'a página tem scroll horizontal no mobile').toBe(false);
  });
});
