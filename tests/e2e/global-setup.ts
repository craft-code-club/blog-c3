import fs from 'node:fs';
import path from 'node:path';
import { request, type FullConfig } from '@playwright/test';
import { fetchPage } from './helpers/site';

/**
 * Uma URL de cada rota dinâmica do app. Toda rota com `[param]` em `src/app`
 * precisa de uma amostra aqui; o setup confere isso antes de rodar.
 */
const DYNAMIC_ROUTE_SAMPLES = [
  '/blog/page/1',
  '/events/book-club-ddia-chapter-1',
  '/events/past/1',
  '/posts/dsa-dijkstra',
  '/topics/algoritmos',
  '/topics/algoritmos/page/1',
];

const APP_DIR = path.join(process.cwd(), 'src', 'app');

/**
 * Aquece o dev server visitando uma rota dinâmica de cada vez, antes dos testes.
 *
 * Na primeira visita a uma rota com `generateStaticParams`, o `next dev` lê,
 * altera e regrava `.next/dev/prerender-manifest.json`, sem trava nem escrita
 * atômica (`getStaticPaths` em next-dev-server.js, igual até o 16.4.1). Com os
 * testes em paralelo, duas rotas fazem isso ao mesmo tempo: uma lê o arquivo
 * pela metade ("Unexpected end of JSON input"), ou as duas escritas se misturam,
 * o JSON fica corrompido e daí em diante toda página responde 500.
 *
 * Depois da primeira visita de cada rota, o manifest não muda mais e o Next não
 * regrava o arquivo. Visitando uma de cada vez aqui, os testes já encontram o
 * arquivo pronto.
 */
export default async function globalSetup(config: FullConfig) {
  const missing = dynamicRoutePatterns().filter(
    ({ regex }) => !DYNAMIC_ROUTE_SAMPLES.some((sample) => regex.test(sample)),
  );
  if (missing.length > 0) {
    throw new Error(
      `Rotas dinâmicas sem amostra em DYNAMIC_ROUTE_SAMPLES (tests/e2e/global-setup.ts): ${missing
        .map(({ route }) => route)
        .join(', ')}`,
    );
  }

  const context = await request.newContext({ baseURL: config.projects[0].use.baseURL });
  try {
    for (const route of DYNAMIC_ROUTE_SAMPLES) {
      await fetchPage(context, route);
    }
  } finally {
    await context.dispose();
  }
}

/** As rotas de `src/app` com segmento dinâmico, como `/events/[id]`. */
function dynamicRoutePatterns(): { route: string; regex: RegExp }[] {
  return fs
    .readdirSync(APP_DIR, { recursive: true, encoding: 'utf8' })
    .filter((file) => path.basename(file) === 'page.tsx' && file.includes('['))
    .map((file) => {
      const segments = path
        .dirname(file)
        .split(path.sep)
        // Grupos de rota, como `(site)`, não aparecem na URL.
        .filter((segment) => !/^\(.*\)$/.test(segment));
      const route = `/${segments.join('/')}`;
      const pattern = segments
        .map((segment) => (/^\[.*\]$/.test(segment) ? '[^/]+' : segment))
        .join('/');
      return { route, regex: new RegExp(`^/${pattern}$`) };
    });
}
