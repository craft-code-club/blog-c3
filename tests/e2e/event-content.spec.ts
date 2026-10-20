import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { expect, test } from '@playwright/test';
import { resolveDiscordLinks } from '../../src/lib/discord';
import { gotoOk } from './helpers/site';

/**
 * O corpo em Markdown de um evento, quando existe, é o conteúdo da página de
 * detalhe e substitui a `description`, que fica para a listagem e o SEO. Sem
 * corpo, o detalhe mostra a `description`. Ver docs/events.md.
 */
const EVENTS_DIR = path.join(process.cwd(), '_content', 'events');

/** Palestrante como está no frontmatter: só o nome ou `{ name, link }`. */
type FrontmatterSpeaker = string | { name: string; link?: string };

const events = fs.readdirSync(EVENTS_DIR).map((fileName) => {
  const fileContents = fs.readFileSync(path.join(EVENTS_DIR, fileName), 'utf8');
  const { data, content } = matter(resolveDiscordLinks(fileContents));
  return {
    id: fileName.replace(/\.md$/, ''),
    description: String(data.description),
    body: content,
    speakers: data.speakers as FrontmatterSpeaker[] | undefined,
  };
});

/** Primeira linha do corpo sem a marcação Markdown, para procurar no texto da página. */
function firstBodyLine(body: string): string {
  const line = body.split('\n').map((l) => l.trim()).find(Boolean) ?? '';
  return line
    .replace(/^(#{1,6}|[-*+]|\d+\.|>)\s+/, '')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*_`~]/g, '');
}

test('evento sem corpo mostra a description no detalhe', async ({ page }) => {
  const event = events.find((e) => !e.body.trim());
  expect(event, 'nenhum evento sem corpo em _content/events').toBeDefined();

  await gotoOk(page, `/events/${event!.id}`);

  // O conteúdo do detalhe é o primeiro bloco `prose` da página.
  await expect(page.locator('.prose').first()).toHaveText(event!.description);
});

test('evento com corpo mostra o Markdown no detalhe, e não a description', async ({ page }) => {
  const event = events.find((e) => e.body.trim());
  // Falha em vez de pular: sem nenhum evento com corpo, esse caminho ficaria sem teste.
  expect(event, 'nenhum evento com corpo em _content/events').toBeDefined();

  await gotoOk(page, `/events/${event!.id}`);
  const content = page.locator('.prose').first();

  await expect(content).toContainText(firstBodyLine(event!.body));
  await expect(content).not.toContainText(event!.description);
});

test('palestrante com link vira link para o perfil, em nova aba', async ({ page }) => {
  const event = events.find((e) => e.speakers?.some((s) => typeof s === 'object' && s.link));
  // Falha em vez de pular: sem nenhum palestrante com link, esse caminho ficaria sem teste.
  expect(event, 'nenhum palestrante com link em _content/events').toBeDefined();
  const speaker = event!.speakers!.find((s) => typeof s === 'object' && s.link) as { name: string; link: string };

  await gotoOk(page, `/events/${event!.id}`);
  const link = page.getByRole('link', { name: speaker.name, exact: true });

  await expect(link).toHaveAttribute('href', speaker.link);
  await expect(link).toHaveAttribute('target', '_blank');
});

test('a API devolve os palestrantes só com o nome', async ({ request }) => {
  // O bot do Discord lê `speakers` como lista de strings. O `{ name, link }` do
  // frontmatter não pode vazar para a API.
  const response = await request.get('/api/events/future');
  expect(response.ok()).toBe(true);
  const apiEvents: { id: string; speakers?: unknown[] }[] = await response.json();

  for (const apiEvent of apiEvents) {
    const source = events.find((e) => e.id === apiEvent.id);
    const names = source?.speakers?.map((s) => (typeof s === 'string' ? s : s.name));

    expect(apiEvent.speakers, `palestrantes de ${apiEvent.id} na API`).toEqual(names);
  }
});
