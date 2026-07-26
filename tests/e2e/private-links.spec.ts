import { expect, test } from '@playwright/test';
import { fetchHtml, getSitemapPaths, mapWithConcurrency } from './helpers/site';

/**
 * Links de sala de reunião não podem sair no HTML público. Vale lembrar que o
 * site é estático e os componentes recebem o objeto inteiro do evento: um campo
 * novo no frontmatter acaba serializado no payload RSC embutido na página mesmo
 * que nenhum componente o renderize. Foi assim que links de Zoom, com a senha no
 * `?pwd=`, chegaram a páginas indexadas sem aparecer em lugar nenhum da UI.
 *
 * Divulgue sala em canal de membros, não no conteúdo do site.
 */
const MEETING_LINK_PATTERN =
  /(?:[a-z0-9-]+\.)?(?:zoom\.us|meet\.google\.com|teams\.microsoft\.com|whereby\.com)\/[^\s"'<>\\]+/gi;

test('nenhuma página pública expõe link de sala de reunião', async ({ request }) => {
  test.slow();

  const paths = await getSitemapPaths(request);

  const offenders = await mapWithConcurrency(paths, 4, async (path) => {
    const found = [...new Set((await fetchHtml(request, path)).match(MEETING_LINK_PATTERN) ?? [])];
    return found.length ? `${path} → ${found.join(', ')}` : null;
  });

  expect(offenders.filter(Boolean)).toEqual([]);
});
