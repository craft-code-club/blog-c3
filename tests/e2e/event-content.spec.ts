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

const events = fs.readdirSync(EVENTS_DIR).map((fileName) => {
  const fileContents = fs.readFileSync(path.join(EVENTS_DIR, fileName), 'utf8');
  const { data, content } = matter(resolveDiscordLinks(fileContents));
  return { id: fileName.replace(/\.md$/, ''), description: String(data.description), body: content };
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
