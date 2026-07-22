import { expect, test } from '@playwright/test';
import { DISCORD_INVITE_URL, DISCORD_PAGE_PATH, gotoOk } from './helpers/site';

test.describe(`página de convite (${DISCORD_PAGE_PATH})`, () => {
  // O header e o footer do site também trazem "Entrar no Discord" e a logo da
  // comunidade, então tudo aqui é escopado ao <main> para mirar a página em si.
  test.beforeEach(async ({ page }) => {
    await gotoOk(page, DISCORD_PAGE_PATH);
  });

  test('carrega com o convite em destaque', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    const cta = page.locator('main').getByRole('link', { name: /entrar no discord/i });
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute('href', DISCORD_INVITE_URL);
  });

  test('o CTA abre o Discord com rel seguro', async ({ page }) => {
    const cta = page.locator('main').getByRole('link', { name: /entrar no discord/i });

    await expect(cta).toHaveAttribute('target', '_blank');
    const rel = (await cta.getAttribute('rel')) ?? '';
    expect(rel).toContain('noopener');
    expect(rel).toContain('noreferrer');
  });

  test('mostra a logo do Discord e a da comunidade', async ({ page }) => {
    const main = page.locator('main');

    await expect(main.getByAltText(/craft & code club/i)).toBeVisible();
    // A logo do Discord é um <svg> inline dentro do bloco das duas marcas.
    await expect(main.locator('svg').first()).toBeVisible();
  });

  test('aponta as regras da comunidade de forma discreta', async ({ page }) => {
    const rules = page.locator('main').getByRole('link', { name: /regras da comunidade/i });
    await expect(rules).toBeVisible();

    await rules.click();
    await expect(page).toHaveURL(/\/codigo-conduta$/);
  });

  test('declara canonical próprio', async ({ page }) => {
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toMatch(new RegExp(`${DISCORD_PAGE_PATH}$`));
  });

  test('renderiza no mobile sem estourar a largura', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });

    const overflows = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(overflows, 'a página tem scroll horizontal no mobile').toBe(false);
  });
});
