# Plano de SEO — Craft & Code Club

> Auditoria técnica de SEO e plano de ação priorizado para tornar o blog altamente
> ranqueável no Google, no Bing e nos buscadores de IA (ChatGPT, Perplexity, AI Overviews).
>
> **Como usar este documento:** os itens do plano (seção 8) têm códigos estáveis
> (`SEO-P0-01`…`SEO-P2-06`) e checkboxes — marque `[x]` conforme cada item for entregue
> e anote a data de merge (importante para atribuir impacto nas métricas da seção 9).
>
> **Acompanhamento:** 📍 milestone [**Blog SEO Improvement 2026-Q3**](https://github.com/craft-code-club/blog-c3/milestone/1)
> — todas as issues do plano (`#824`–`#848`) estão nele, com label `seo` (+ `priority: high` nos P0).
>
> _Auditoria: 09/07/2026 · Base: Next.js 16 (export estático) · Cloudflare Pages · 14 posts_

---

## 1. Resumo executivo

O blog tem uma base sólida — export estático (HTML completo para crawlers), URLs limpas,
`lang="pt-BR"`, sitemap e robots.txt presentes, hierarquia de headings correta nos posts.
Mas está invisível para os mecanismos modernos de descoberta e rich results:
**não existe nenhum structured data (JSON-LD), nenhuma URL canônica, nenhum feed RSS e
nenhuma imagem social (og:image)** em página alguma.

Para um blog colaborativo, o risco composto é maior: não há template de post, guia
editorial nem validação de frontmatter — então cada contribuição nova tende a repetir os
problemas atuais (títulos genéricos, descriptions longas, autores vazios, zero links internos).

**As 5 correções de maior impacto** (todas estruturais, beneficiam todos os posts atuais e futuros):

1. JSON-LD `BlogPosting` + `Organization` + `BreadcrumbList` (`SEO-P0-02`)
2. `metadataBase` + canonical em todas as páginas (`SEO-P0-01`)
3. og:image 1200×630 por página (`SEO-P0-03`)
4. Feed RSS (`SEO-P1-01`)
5. Mermaid (~700 KB) fora do bundle global (`SEO-P0-05`)

---

## 2. Inventário de artefatos de SEO

### Presentes

| Artefato | Estado | Observações |
| --- | --- | --- |
| sitemap.xml | ⚠️ Com problemas | `lastmod` das rotas estáticas/tópicos usa `new Date()` (data do build) — Google/Bing ignoram lastmod não confiável. `changefreq`/`priority` são ignorados pelo Google. Cobertura auditada: **111 de 118 páginas do build** — faltam `/codigo-conduta` e `/events/past/1..4`; `/events/past` é stub de redirect (deve ficar fora e virar 301). O sitemap deve **crescer com o plano** (autores, hubs). |
| robots.txt | ✅ OK | Permite tudo e aponta o sitemap. |
| Meta description | ✅ OK | Presente em todas as páginas, vinda do frontmatter. |
| Open Graph / Twitter | ⚠️ Com problemas | Só title/description/type. Faltam `og:image`, `og:url`, `og:site_name`, `og:locale`. Twitter card `summary` sem imagem. |
| favicon.ico | ⚠️ Com problemas | 243×256 — **não é quadrado**; o Google exige quadrado ≥48×48 para exibir na SERP mobile (afeta CTR). Faltam PNGs 192/512, `apple-touch-icon` e manifest. |
| 404 | ✅ OK | `not-found.tsx` gera `404.html`; Cloudflare Pages serve com status 404 real. |
| Google Tag Manager | ✅ OK | Via `@next/third-parties`. Ligar GA4 ao Search Console. |
| Headings | ✅ OK | H1 único do frontmatter; posts começam em `##`. Convenção correta, mas não documentada. |
| Âncoras em headings | ✅ OK | `rehype-slug` gera ids — bom para sitelinks e fragmentos. |

### Ausentes

| Artefato | Prioridade | Por que importa |
| --- | --- | --- |
| JSON-LD (structured data) | P0 | Zero em todo o site. Sem `BlogPosting` não há rich results de artigo; sem `Organization`/`WebSite` o Google não consolida a entidade; sem `Event` os eventos ficam fora da busca de eventos. É também o que Bing/Copilot usam para alimentar LLMs. |
| Canonical / metadataBase | P0 | Nenhuma página declara canonical. Risco real de duplicação: apex + www + previews `*.pages.dev` indexáveis. |
| og:image / twitter:image | P0 | Nenhuma imagem social. CTR de compartilhamento despenca sem thumbnail. Atenção: `ImageResponse`/`next/og` **não funciona com `output: export`** — gerar PNGs em build (satori/sharp) ou usar imagem estática. |
| Feed RSS/Atom | P1 | Canal de descoberta para agregadores, Bing e crawlers de IA; o Google aceita feed como sitemap complementar. |
| `_redirects` (Cloudflare) | P1 | Redirects atuais são client-side/meta-refresh (book-club e /events/past) — crawler não segue de forma confiável. Devem ser 301 reais. |
| `_headers` (Cloudflare) | P1 | Sem cache imutável, sem security headers e — crítico — sem `X-Robots-Tag: noindex` escopado a `https://:project.pages.dev/*`. |
| IndexNow | P1 | Indexação em minutos no Bing (→ cadeia ChatGPT). Google não participa. |
| Web manifest + ícones | P2 | PWA manifest, ícones 192/512, apple-touch-icon. |
| llms.txt | P2 | Google confirmou que **não usa**; valor marginal (ferramentas dev). Aposta barata, sem expectativa. |

### Fora do escopo — não adicionar

| Artefato | Motivo |
| --- | --- |
| hreflang | Site monolíngue pt-BR; documentação do Google define uso só para múltiplas versões de idioma. Basta o `lang="pt-BR"`. |
| News sitemap | Exclusivo para veículos de notícias (artigos das últimas 48h). |
| FAQPage schema | Rich results **encerrados de vez em 07/mai/2026**. Conteúdo de P&R continua valioso — no corpo do texto. |
| HowTo schema | Rich results descontinuados desde 2023. |
| SearchAction / Sitelinks Search Box | Removido globalmente pelo Google em nov/2024. |
| AMP | Tecnologia abandonada; export estático rápido entrega o mesmo resultado. |

### Verificações fora do repositório (P0 operacional — ver `SEO-P0-06`)

| Verificação | Por que importa | Como verificar |
| --- | --- | --- |
| Google Search Console e Bing Webmaster Tools | Sem propriedade verificada não há dados de indexação/impressões/erros. | Confirmar acesso; o Bing WMT importa do GSC com um clique. |
| AI crawlers no painel Cloudflare | Desde jul/2025 o Cloudflare **bloqueia crawlers de IA por padrão** em zonas novas — bloqueio silencioso tira o blog do ChatGPT/Perplexity/Claude. | Painel Cloudflare → Security/Bots; logs de firewall por user-agents de IA. |
| Indexação dos previews `*.pages.dev` | Competem com o domínio canônico como conteúdo duplicado. | Buscar `site:blog-c3.pages.dev`; correção definitiva no `_headers` (`SEO-P1-02`). |
| URLs do blog anterior (v1) | O projeto chama-se `blog-v2` — backlinks históricos podem estar caindo em 404. | GSC → páginas 404 e relatório de links; 301 no `_redirects` para URLs com valor. |

---

## 3. Estrutura colaborativa: frontmatter, templates e validação

Num blog colaborativo, o padrão vale mais que qualquer otimização pontual: o que não é
validado por máquina degrada a cada PR.

### Estado atual do frontmatter (14 posts)

| Campo | Situação | Problema |
| --- | --- | --- |
| `title` | ⚠️ Inconsistente | De 9 a 75 caracteres. "Skip List", "Backtracking" competem com Wikipedia pela keyword crua. |
| `description` | ⚠️ Inconsistente | De 108 a 318 caracteres. Acima de ~160 o Google trunca; ideal 140–160 com a keyword no início. |
| `authors` | ⚠️ Inconsistente | Dois posts com `authors: []` e um sem o campo — contra o sinal E-E-A-T. |
| `keywords` | ⚠️ Vazio/inútil | Meta keywords é ignorada por Google e Bing — manter só se alimentar tags internas. |
| `image` / cover | ❌ Não existe | Nenhum post pode ter og:image própria sem esse campo. |
| `lastmod` / updated | ❌ Não existe | Sitemap e schema nunca sinalizam atualização de conteúdo. |
| slug | ⚠️ Implícito | Slug = nome do arquivo, com prefixos crípticos (`dsa-`, `sd-`). Posts novos: slug descritivo; existentes só migrar com 301. |

### Frontmatter proposto (contrato para contribuidores)

```yaml
---
title: 'Algoritmo A* (A-Star): como funciona e quando usar'   # 45–60 chars, keyword no início
description: 'Entenda o algoritmo A* passo a passo: ...'      # 140–160 chars
date: '2026-07-09'
lastmod: '2026-07-09'              # atualizar a cada revisão relevante
topics: ['algoritmos', 'grafos']   # slugs do registro _content/tags/ (como autores)
image: '/posts/a-star/cover.png'   # opcional — override manual da og:image deste item;
                                   # ideal 1200×630 (16:9 como 1280×720 também funciona),
                                   # PNG/JPEG ≤300 KB, no próprio domínio; sem o campo,
                                   # entra o fallback (gerada no build ou padrão do site)
authors:
  - 'nelson-nobre'                 # slug do registro em _content/authors/
---
```

### Validação automatizada

Já existe `scripts/validate-roadmap.ts` e `zod` é dependência. Falta o equivalente para
posts (`SEO-P1-03`): rejeitar PR com title fora de 30–65 chars, description fora de
120–165, `authors` vazio, data inválida ou tópico inexistente.

### Guia editorial (inexistente hoje — `SEO-P1-04`)

O `CONTRIBUTING.md` não diz uma palavra sobre escrever posts. Criar `docs/writing-posts.md`
com: template de frontmatter, limites de título/description, regra de headings (começar em
`##`, nunca pular nível), alt text descritivo obrigatório, 1–2 links internos por post,
imagens hospedadas no próprio repo (não em `raw.githubusercontent.com`), padrão de slug
descritivo com a keyword (`algoritmo-a-star`, não `dsa-a-star`), checklist de PR — e a
**regra permanente pós-publicação: todo post ligado a um evento/gravação deve ser linkado
na descrição do vídeo do YouTube a que pertence** (e o vídeo, embutido ou linkado no post).

### Registro de autores — spec de implementação (`SEO-P2-01`)

A cadeia E-E-A-T completa: o post declara quem escreveu → uma página identifica o autor →
os perfis externos confirmam. Mesmo padrão de `_content/tags`: **o post referencia, o
registro descreve**.

1. **Slug é o id universal** — kebab-case, sem acentos, imutável: nome do arquivo,
   referência nos posts, URL da página e `@id` no schema. Renomear exige 301.
2. **Registro central em `_content/authors/<slug>.md`** — a decisão "página interna ou só
   link externo" mora aqui, nunca no post:

   ```yaml
   # _content/authors/nelson-nobre.md  (mantenedor → página interna)
   ---
   name: 'Nelson Nobre'
   internal_page: true
   avatar: '/authors/nelson-nobre.png'
   github: 'https://github.com/NelsonBN'
   linkedin: 'https://linkedin.com/in/...'
   ---
   Bio real: o que faz, com o que trabalha, há quanto tempo.

   # _content/authors/fulana-silva.md  (convidada → só link externo)
   ---
   name: 'Fulana Silva'
   internal_page: false
   link: 'https://linkedin.com/in/fulana'
   ---
   ```

3. **Nos posts, referência por slug — formato único, sem retrocompatibilidade.** O site é
   rebuild completo a cada deploy e são 14 posts: migração de uma vez, no mesmo PR que cria
   o registro. A URL dos posts não muda — zero impacto de SEO.
4. **Renderização:** `internal_page: true` → byline e `Person.url` apontam para
   `/authors/<slug>`; `false` → apontam para o link externo. O modelo híbrido não tem custo
   de SEO (o Google aceita perfil externo como `author.url`); página interna para autor de
   um post único seria thin content. Consentimento embutido: ninguém ganha página sem pedir.
5. **A página `/authors/<slug>`:** bio com credenciais, foto, lista de posts (interlinking
   nos dois sentidos), links externos; JSON-LD `ProfilePage` com `mainEntity: Person` + `sameAs`.
6. **Identidade estável:** `@id: 'https://craftcodeclub.io/authors/<slug>#person'`
   referenciado pelo `author` de todos os `BlogPosting`.
7. **Validação no CI** (amarra com `SEO-P1-03`): slug referenciado precisa existir;
   `internal_page: true` exige bio; `false` exige `link`.

### Tópicos seguem o mesmo padrão (`SEO-P1-12`; curadoria em `SEO-P2-02`)

O registro `_content/tags/` já existe, mas é **opcional**: os posts referenciam tópicos
pelo nome de exibição e, quando não há registro, o código cria o tópico na hora
(`mountTopics` em `src/lib/posts.ts`) — sem description, sem curadoria. A mudança: posts
passam a referenciar **por slug** (`topics: ['algoritmos', 'grafos']`) e todo slug precisa
existir em `_content/tags/<slug>.md`, validado no CI.

Benefícios: mata o tag sprawl (sinônimos criados por contribuidores diferentes dividem
PageRank em páginas de arquivo duplicadas — o registro obrigatório força a escolha
consciente entre usar um tópico existente ou criar um novo de propósito); garante que toda
página de tópico nasce com description curada; e o corpo do markdown do registro vira o
texto introdutório real da página (`SEO-P2-02`), exatamente como a bio do autor.

Migração one-shot como a de autores: 14 posts num PR, slugs atuais preservados para as
URLs `/topics/<slug>` não mudarem (mudança de slug exige 301). Extensão natural: as `tags`
dos eventos podem usar o mesmo registro.

---

## 4. Metadata por tipo de página

| Página | Hoje | Falta |
| --- | --- | --- |
| Home | Title + description, sem OG | Canonical, OG completo, og:image, JSON-LD `WebSite` + `Organization`; H1 com keywords reais |
| Post | Title/description/OG article | Canonical, og:image, og:url, JSON-LD `BlogPosting` + `BreadcrumbList` |
| Blog (listagem) | Title/description/OG básico | Canonical, og:image, JSON-LD `CollectionPage` |
| Tópico | Title/description; só 4 tópicos têm description curada | Canonical + description curada para todos |
| Evento | Title/description/OG básico | Canonical + JSON-LD `Event` (com `VideoObject` da gravação e `speakers` → `performer`) |
| Book club | Redirect client-side da rota antiga | 301 real via `_redirects`; canonical na rota nova |

Correção estrutural no layout raiz:

```ts
// src/app/layout.tsx
export const metadata: Metadata = {
  metadataBase: new URL('https://craftcodeclub.io'),
  title: {
    default: 'Craft & Code Club — System Design, Algoritmos e Engenharia de Software',
    template: '%s | Craft & Code Club',   // páginas passam só o título próprio
  },
  alternates: { canonical: './' },        // resolve canonical por página
  openGraph: { siteName: 'Craft & Code Club', locale: 'pt_BR', type: 'website' },
};
```

Armadilha do export estático: canônicas, sitemap e links internos devem usar a mesma forma
**sem barra final** que o Cloudflare Pages serve.

---

## 5. Conteúdo e interlinking

- **12 de 14 posts não têm nenhum link interno.** Os links saem para GitHub (33) e
  Wikipedia (23), enquanto a série de grafos (Dijkstra → Bellman-Ford → A* → MST →
  Ordenação Topológica) não se conecta. Ações: "Posts sugeridos" automático (`SEO-P1-05`),
  navegação de série, regra editorial de 1–2 links internos, eventos relacionados na tela
  de detalhe (`SEO-P1-06`), TOC nos posts (`SEO-P2-04`).
- **Imagens de conteúdo hospedadas fora do domínio** (`raw.githubusercontent.com`): Google
  Imagens credita o GitHub; sem `width/height` há CLS; sem lazy loading. Migrar para
  `/public/posts/<slug>/` + plugin rehype (`SEO-P1-08`).
- **Títulos que não competem:** o diferencial é conteúdo técnico profundo **em português**
  — capturar a busca em pt-BR ("Skip List: o que é e como implementar"). Séries merecem
  páginas-hub (`SEO-P2-03`).
- **78 gravações no YouTube sem elo com o blog:** descrições dos vídeos não linkam o
  post/evento (tráfego referral + descoberta), e o JSON-LD `Event` pode carregar a gravação
  como `VideoObject` (`SEO-P1-11`; schema em `SEO-P0-02`).
- **Oportunidades:** nicho "system design em português" com pouca concorrência; posts do
  clube do livro são o "ganho de informação" original que o core update de março/2026
  privilegia; citações com fontes/estatísticas aumentam ~30–40% a citação por IA (GEO);
  perguntas de entrevista no corpo do texto (não FAQPage schema).

---

## 6. Performance e Core Web Vitals

- **Mermaid (~700 KB) no bundle de todas as páginas** — importado estaticamente no layout
  raiz. Correção: renderizar em build time (rehype-mermaid) ou `import()` dinâmico só em
  páginas com diagrama (`SEO-P0-05`). Bônus: diagramas client-side são invisíveis para
  crawlers de IA (bots da OpenAI não executam JavaScript).
- **Imagens de conteúdo sem dimensões nem lazy loading** — markdown vira `<img>` puro
  (`SEO-P1-08`).
- **Já está bem:** `next/font` self-hosted, export estático (TTFB excelente), Tailwind
  enxuto, GTM via `@next/third-parties`.
- Limiares de campo (p75): **LCP ≤ 2,5 s · INP ≤ 200 ms · CLS ≤ 0,1**.

---

## 7. O que Google, Bing e busca por IA valorizam em 2026

Síntese de pesquisa em fontes primárias (documentação oficial Google/Bing/OpenAI/Cloudflare, jul/2026):

**Google (~94,6% do Brasil):** E-E-A-T com bylines e páginas de autor (`Person` com `url`);
CWV como fator leve; rich results vivos para blog: `Article`/`BlogPosting` e `BreadcrumbList`
(FAQ morreu em mai/2026, HowTo em 2023, SearchAction em nov/2024); `lastmod` só se
verdadeiro — `changefreq`/`priority` ignorados; títulos ~50–60 chars e descriptions
~120–158, em português; meta keywords sem efeito algum; core update de mar/2026 privilegiou
"ganho de informação" original.

**Bing (~4–8% no Brasil, porta do ChatGPT):** o ChatGPT Search é construído sobre o índice
do Bing (~87% de sobreposição de citações) — ranquear no Bing é aparecer no ChatGPT;
IndexNow indexa em minutos; a Microsoft confirmou que usa schema para alimentar os LLMs do
Copilot; pesa mais keywords exatas em título/H1/URL/primeiro parágrafo.

**Busca por IA:** AI Overviews em português desde ago/2024; posição oficial do Google:
nenhuma otimização especial além de indexabilidade; crawlers da OpenAI **não executam
JavaScript** (o export estático é ideal; Mermaid client-side é a exceção); citações com
fontes/estatísticas elevam visibilidade ~30–40%; **Cloudflare bloqueia crawlers de IA por
padrão desde jul/2025** — verificar o painel; RSS ajuda descoberta de conteúdo novo.

---

## 8. Plano de ação priorizado

> Códigos são identificadores estáveis — a sequência numérica dentro de cada prioridade
> não é ordem obrigatória de execução. Ao concluir um item, marque `[x]` e anote a data
> de merge (ex.: `— concluído em 2026-07-15`).

### P0 — Fundação (destrava tudo)

- [ ] **SEO-P0-01** ([#824](https://github.com/craft-code-club/blog-c3/issues/824)) — `metadataBase` + `title.template` + OG defaults (`siteName`,
  `locale: 'pt_BR'`) + `alternates.canonical` em todas as páginas + `robots` com
  `max-image-preview: large` (Google Discover). Canônicas, sitemap e links internos na
  mesma forma **sem barra final** que o Cloudflare serve.
  _Onde: `src/app/layout.tsx` + páginas._
- [ ] **SEO-P0-02** ([#825](https://github.com/craft-code-club/blog-c3/issues/825)) — JSON-LD: `BlogPosting` (autores como `Person` com url,
  `datePublished`/`dateModified`) + `BreadcrumbList` nos posts; `Organization` (com
  `sameAs`: GitHub, YouTube, Discord) + `WebSite` na home; `Event` nos eventos, enriquecido
  com a gravação como `VideoObject` (`recordingLink` — 78 eventos) e `speakers` →
  `performer`; `/blog` como `CollectionPage`. Padrão: `<script type="application/ld+json">`
  no Server Component. **Pré-requisito:** preencher os `authors` vazios nos 3 posts
  (ddia-requisitos…, ddia-trade-offs…, sd-ad-click…).
  _Onde: `posts/[id]/page.tsx`, `layout.tsx`, `events/[id]/page.tsx` + 3 posts._
- [ ] **SEO-P0-03** ([#826](https://github.com/craft-code-club/blog-c3/issues/826)) — og:image em 3 fases: **(a)** imagem padrão 1200×630 como fallback
  explícito em cada `generateMetadata` (o merge de metadata do Next é raso — definir só no
  layout não propaga); **(b)** campo `image` opcional no frontmatter como override manual
  + ligar o `banner` dos eventos (1280×720) no `openGraph.images`; **(c)** geração
  automática por post em build (satori/sharp — `ImageResponse` não funciona com export;
  pode escorregar para P1). Cadeia: `image` → `banner` → gerada → padrão. Emitir
  `og:image:width/height` lidos do arquivo no build (`image-size`). PNG/JPEG ≤300 KB
  (limite silencioso do WhatsApp) + `twitter: summary_large_image`.
  _Onde: layout + `generateMetadata` + frontmatter; (c) script de build._
- [ ] **SEO-P0-04** ([#827](https://github.com/craft-code-club/blog-c3/issues/827)) — Sitemap: `lastmod` real (campo no frontmatter + datas reais nas
  rotas estáticas), remover `changefreq`/`priority`. Cobertura (auditada: 111/118):
  adicionar `/codigo-conduta` e `/events/past/1..N` (programático); `/events/past` é stub
  de redirect — fora do sitemap, 301 no `_redirects` (`SEO-P1-02`). Regra permanente: o
  sitemap cresce com o plano (autores `SEO-P2-01`, hubs `SEO-P2-03`).
  _Onde: `src/app/sitemap.ts`._
- [ ] **SEO-P0-05** ([#828](https://github.com/craft-code-club/blog-c3/issues/828)) — Mermaid fora do bundle global: renderizar em build time
  (rehype-mermaid) ou `import()` dinâmico só em páginas com diagrama.
  _Onde: `MermaidInitializer.tsx` / pipeline markdown._
- [ ] **SEO-P0-06** ([#829](https://github.com/craft-code-club/blog-c3/issues/829)) — Operacional: verificar Google Search Console + Bing Webmaster Tools
  (importa do GSC), configuração de AI crawlers no Cloudflare, indexação de `*.pages.dev`,
  e URLs do blog anterior (v1): 404s e backlinks antigos no GSC → 301 no `_redirects`.
  _Onde: painéis GSC/Bing/Cloudflare._
- [ ] **SEO-P0-07** ([#830](https://github.com/craft-code-club/blog-c3/issues/830)) — Criar a skill de validação de SEO (`.claude/skills/seo-check`):
  obrigatória antes de publicar post, evento ou página nova; ajusta a avaliação ao tipo de
  conteúdo (post: título 30–65, description 120–165, headings a partir de `##`, alt text,
  links internos, autor, imagem; evento: banner, datas; página: metadata, canonical, H1).
  A versão inicial valida o estado atual do repo e evolui junto com o plano (`SEO-P2-06`).
  Complementa o CI (`SEO-P1-03`): skill = análise qualitativa; CI = gate objetivo.
  _Onde: `.claude/skills/` + processo de PR._

### P1 — Conteúdo, distribuição e padrão colaborativo

- [ ] **SEO-P1-01** ([#831](https://github.com/craft-code-club/blog-c3/issues/831)) — Feed RSS (`app/rss.xml/route.ts` com `force-static`) + descoberta
  via `alternates.types`.
- [ ] **SEO-P1-02** ([#832](https://github.com/craft-code-club/blog-c3/issues/832)) — `_redirects` (301: `book-club→book-clubs` e
  `/events/past→/events/past/1` — hoje ambos redirects fracos client-side/meta-refresh) +
  `_headers` (cache imutável em `/_next/static/*`, `X-Robots-Tag: noindex` em
  `*.pages.dev`, security headers) + redirect www→apex na zona Cloudflare.
- [ ] **SEO-P1-03** ([#833](https://github.com/craft-code-club/blog-c3/issues/833)) — Validação de frontmatter no CI com zod (title 30–65, description
  120–165, authors obrigatório, datas válidas, todo tópico referenciado por slug existente
  em `_content/tags/` — habilitado pelo `SEO-P1-12`; `image` obrigatório quando a fase (c)
  do `SEO-P0-03` entrar) — nos moldes do `validate-roadmap.ts`.
- [ ] **SEO-P1-04** ([#834](https://github.com/craft-code-club/blog-c3/issues/834)) — Guia editorial `docs/writing-posts.md` + template de post +
  checklist no PR template — incluindo GEO (citar fontes/estatísticas), 1–2 links internos,
  slug descritivo, e a regra pós-publicação: **linkar o post na descrição do vídeo do
  YouTube a que pertence** (e o vídeo no post).
- [ ] **SEO-P1-05** ([#835](https://github.com/craft-code-club/blog-c3/issues/835)) — "Posts sugeridos" no fim de cada post: os 3 com melhor match de tags,
  em ordem cronológica do mais recente, excluindo o próprio post; + navegação de série.
- [ ] **SEO-P1-06** ([#836](https://github.com/craft-code-club/blog-c3/issues/836)) — Detalhe de evento: "Próximos eventos" excluindo o evento aberto; sem
  próximos, mostrar os 2 eventos mais recentes (do mais recente para o anterior).
- [ ] **SEO-P1-07** ([#837](https://github.com/craft-code-club/blog-c3/issues/837)) — IndexNow no deploy (chave em `public/` + POST com URLs alteradas no
  workflow; ou Crawler Hints no painel).
- [ ] **SEO-P1-08** ([#838](https://github.com/craft-code-club/blog-c3/issues/838)) — Migrar imagens de `raw.githubusercontent.com` para
  `/public/posts/<slug>/` + plugin rehype para `width/height` + `loading="lazy"`.
- [ ] **SEO-P1-09** ([#839](https://github.com/craft-code-club/blog-c3/issues/839)) — Favicon quadrado ≥48px + ícones 192/512 + `apple-icon` + `manifest.ts`.
- [ ] **SEO-P1-10** ([#840](https://github.com/craft-code-club/blog-c3/issues/840)) — _Promovido de P2 por impacto:_ reescrever títulos genéricos com a
  keyword em português ("Skip List: o que é e como implementar"), encurtar descriptions
  para 140–160 e trocar o H1 da home por keywords reais — o maior alavancador de CTR dos
  14 posts existentes, com esforço de horas.
- [ ] **SEO-P1-11** ([#841](https://github.com/craft-code-club/blog-c3/issues/841)) — _Off-page:_ adicionar o link do post/evento na descrição das 78
  gravações do YouTube (regra permanente no guia `SEO-P1-04`) e republicar posts
  selecionados em dev.to/TabNews com `canonical_url`. Links do YouTube são nofollow — o
  valor é tráfego referral, descoberta e menção de marca.
- [ ] **SEO-P1-12** ([#842](https://github.com/craft-code-club/blog-c3/issues/842)) — Registro de tópicos obrigatório com referência por **slug** nos
  posts (`topics: ['algoritmos', 'grafos']`) — mesmo padrão do registro de autores:
  `mountTopics` deixa de auto-criar tópico sem registro; migração one-shot dos 14 posts
  com slugs atuais preservados (URLs `/topics/<slug>` não mudam). Habilita a validação de
  tópicos no CI (`SEO-P1-03`) e mata o tag sprawl. Spec na seção 3.

### P2 — Autoridade e longo prazo

- [ ] **SEO-P2-01** ([#843](https://github.com/craft-code-club/blog-c3/issues/843)) — Registro de autores + páginas internas (`/authors/<slug>`) — modelo
  híbrido com flag `internal_page`, slug como id universal e `@id` estável no schema.
  **Spec completa na seção 3.**
- [ ] **SEO-P2-02** ([#844](https://github.com/craft-code-club/blog-c3/issues/844)) — Curadoria de todos os tópicos sobre o registro obrigatório
  (`SEO-P1-12`): description única por tópico + corpo do markdown do registro virando o
  texto introdutório real da página de tópico.
- [ ] **SEO-P2-03** ([#845](https://github.com/craft-code-club/blog-c3/issues/845)) — Páginas-hub por série (DDIA, System Design Interview, grafos).
- [ ] **SEO-P2-04** ([#846](https://github.com/craft-code-club/blog-c3/issues/846)) — Sumário (TOC) no topo dos posts — as âncoras já existem via
  `rehype-slug`; habilita fragment links na SERP.
- [ ] **SEO-P2-05** ([#847](https://github.com/craft-code-club/blog-c3/issues/847)) — llms.txt gerado no build (aposta barata) + limpeza: remover arquivo
  `tatus` do repo.
- [ ] **SEO-P2-06** ([#848](https://github.com/craft-code-club/blog-c3/issues/848)) — Evolução contínua da skill de SEO (`SEO-P0-07`): a cada item
  entregue, atualizar a skill para validar o novo estado do repo (template → valida contra
  o template; guia → verifica as regras; registro de autores → checa slugs; og:image →
  confere imagem/proporção/peso). **É parte da definição de pronto de cada item do plano.**

**Racional da priorização:** títulos/descriptions/H1 e off-page/YouTube foram promovidos a
P1 por impacto (copy é o maior alavancador para domínio pequeno; 78 vídeos já publicados).
Mermaid permanece P0: pesa no CWV de todas as páginas e os diagramas são invisíveis para
crawlers de IA.

---

## 9. Métricas de sucesso e ferramentas

Sem baseline não há como provar impacto — **capturar antes de mergear os P0**.

### Ferramentas (todas gratuitas)

| Ferramenta | Para quê |
| --- | --- |
| Google Search Console | Fonte primária: impressões, cliques, CTR, posição média, cobertura de indexação, rich results, CWV de campo. Retenção de 16 meses. |
| Bing Webmaster Tools | Equivalente para o Bing (→ cadeia ChatGPT) + monitor de IndexNow. Importa do GSC com um clique. |
| GA4 (via GTM já instalado) | Tráfego e origem: referral do YouTube (`SEO-P1-11`), referral de IA (`chatgpt.com`, `perplexity.ai`). Ligar ao Search Console. |
| Cloudflare Web Analytics | RUM leve e sem cookies, direto do painel que já usam. |
| PageSpeed Insights / CrUX | LCP/INP/CLS de campo (p75) e laboratório — antes/depois do `SEO-P0-05`. |
| Rich Results Test + validator.schema.org | Validar o JSON-LD (`SEO-P0-02`) a cada mudança de template. |
| Ahrefs Webmaster Tools (opcional) | Backlinks e keywords, gratuito para donos verificados. |

### Baseline — capturar hoje, antes dos P0

- Exportar do GSC os CSVs de **consultas** e **páginas** (3 e 16 meses) + cobertura de indexação;
- Registrar páginas indexadas (`site:craftcodeclub.io`) e verificar `site:*.pages.dev`;
- Rodar PageSpeed Insights nos 5 templates (home, post, listagem, evento, tópico);
- Registrar backlinks atuais e como a SERP mostra o site hoje (favicon, título, sitelinks);
- Guardar versionado — ex.: `docs/seo-baseline/2026-07/`.

### Acompanhamento ao longo do tempo

- **Cadência mensal:** exportar GSC (preserva histórico além dos 16 meses), revisar CWV,
  conferir IndexNow no Bing WMT;
- **Anotar a data de merge de cada item SEO-\*** e correlacionar com as curvas — é o que
  permite atribuir impacto (este arquivo é o registro);
- **Dashboard opcional:** Looker Studio conecta GSC + GA4 gratuitamente;
- **Spot-check trimestral de IA:** perguntar a ChatGPT/Perplexity sobre os temas dos posts
  (em português) e registrar se o blog é citado.

### As métricas de sucesso a ficar de olho

| Métrica | Onde | Sinal de sucesso |
| --- | --- | --- |
| Páginas indexadas | GSC cobertura | Todas as ~118 canônicas; zero `*.pages.dev`/www duplicadas |
| Impressões em queries pt-BR | GSC consultas | Crescimento sustentado 4–8 semanas após os P0 |
| CTR médio | GSC | Subir com favicon (`SEO-P1-09`), rich results (`SEO-P0-02`), títulos (`SEO-P1-10`) |
| Posição média nas queries-alvo | GSC ("algoritmo dijkstra", "system design entrevista"…) | Top 10 nas long-tail em português |
| Rich results válidos | GSC melhorias | BlogPosting, Breadcrumb e Event sem erros |
| Core Web Vitals de campo (p75) | GSC / CrUX | LCP ≤ 2,5 s · INP ≤ 200 ms · CLS ≤ 0,1 em mobile após `SEO-P0-05` |
| Referral do YouTube | GA4 | Aparecer e crescer após `SEO-P1-11` |
| Tráfego de IA | GA4 (`chatgpt.com`, `perplexity.ai`) | Aparecer como fonte e crescer |
| Indexação no Bing | Bing WMT | URLs novas descobertas em minutos via IndexNow (`SEO-P1-07`) |

**Expectativa de prazo:** efeitos visíveis em 4–8 semanas após a indexação dos P0; ganhos
de autoridade (P1-11, P2) são compostos e aparecem em meses.
