/**
 * Ponte para a plataforma de algoritmos da comunidade (dsa.craftcodeclub.io).
 *
 * O roadmap deixou de ser uma página deste site: `/roadmap/dsa` responde 301
 * para a plataforma (ver `public/_redirects`). O que fica aqui é o elo
 * editorial — cada post e evento de DSA aponta para o tópico equivalente lá,
 * usando o nome do tópico como texto do link.
 *
 * Por que link por tópico e não um banner igual em todo lugar: link contextual
 * para a URL específica, com texto que descreve o destino, concentra relevância
 * naquela página. O mesmo bloco com o mesmo texto repetido em dezenas de
 * páginas é lido como boilerplate de rodapé e vale bem menos.
 *
 * Os slugs vêm do sitemap da plataforma e os rótulos, da página `/roadmap/`
 * dela. Mudou lá, muda aqui: link quebrado custa mais que link ausente.
 */

const DSA_PLATFORM_ORIGIN = 'https://dsa.craftcodeclub.io';

/** Home da plataforma — usada pela navegação, pelo rodapé e pela home. */
export const DSA_PLATFORM_URL = `${DSA_PLATFORM_ORIGIN}/`;
/** Roadmap: o equivalente da página `/roadmap/dsa` que existia aqui. */
export const DSA_PLATFORM_ROADMAP_URL = `${DSA_PLATFORM_ORIGIN}/roadmap/`;

/** Rótulo exibido na plataforma para cada tópico referenciado por este site. */
const TOPIC_LABELS = {
  'a-star': 'A* (A Estrela)',
  arrays: 'Arrays e Listas',
  'arvores-binarias': 'Árvores Binárias',
  backtracking: 'Backtracking',
  'bellman-ford': 'Bellman-Ford',
  'big-o': 'Notação Big O',
  'binary-heap': 'Binary Heap',
  bst: 'Árvore de Busca Binária',
  'busca-binaria': 'Busca Binária',
  'dfs-bfs': 'DFS e BFS em Grafos',
  dijkstra: 'Dijkstra',
  filas: 'Filas e Deques',
  'grafos-intro': 'Introdução a Grafos',
  'hash-table': 'Tabelas Hash',
  'heap-sort': 'Heap Sort',
  'listas-ligadas': 'Listas Encadeadas',
  'merge-sort': 'Merge Sort',
  mst: 'Árvore Geradora Mínima (MST)',
  'n-ary-trees': 'Árvores N-árias',
  'ordenacao-basica': 'Ordenação Básica',
  pilhas: 'Pilhas (Stacks)',
  'prefix-sum': 'Prefix Sum',
  'quick-sort': 'Quick Sort',
  recursao: 'Recursão: Fundamentos',
  'recursao-funcional': 'Recursão: Programação Funcional',
  'shell-sort': 'Shell Sort',
  'skip-list': 'Skip List',
  'sliding-window': 'Sliding Window',
  strings: 'Strings',
  'topological-sort': 'Ordenação Topológica',
  'tree-traversals': 'Percursos em Árvore (DFS/BFS)',
  'two-pointers': 'Two Pointers',
} as const;

/** Slug de tópico existente na plataforma — errar o slug quebra o build. */
type TopicSlug = keyof typeof TOPIC_LABELS;

export type DsaTopic = {
  slug: TopicSlug;
  label: string;
  url: string;
};

/**
 * Id do conteúdo deste site (arquivo em `_content/posts` ou `_content/events`,
 * sem a extensão) → tópico equivalente na plataforma.
 *
 * Posts e eventos dividem o mesmo mapa. Seis ids existem dos dois lados
 * (`dsa-a-star`, `dsa-backtracking`, `dsa-graph-tips`, `dsa-mst`,
 * `dsa-skip-list`, `dsa-topological-sorting`) e isso não é conflito: quando o
 * id se repete é porque o post documenta o evento homônimo, então o tópico de
 * destino é o mesmo dos dois lados.
 */
const TOPIC_BY_CONTENT_ID: Record<string, TopicSlug> = {
  // Eventos
  'dsa-a-star': 'a-star',
  'dsa-arrays': 'arrays',
  'dsa-backtracking': 'backtracking',
  'dsa-basic-sorting-algorithms': 'ordenacao-basica',
  'dsa-big-o': 'big-o',
  'dsa-binary-heap': 'binary-heap',
  'dsa-binary-search': 'busca-binaria',
  // "Dicas e Truques" é taxonomia de grafos + representações: o equivalente é
  // a introdução, não `grafos-avancados` (que é SCC, pontes e union-find —
  // assunto que este site não cobre).
  'dsa-graph-tips': 'grafos-intro',
  'dsa-graphs-bellman-ford': 'bellman-ford',
  'dsa-graphs-dijkstra': 'dijkstra',
  'dsa-graphs-dsa-dfs': 'dfs-bfs',
  'dsa-graphs-intro-part1': 'grafos-intro',
  'dsa-graphs-intro-part2': 'grafos-intro',
  'dsa-hash-table': 'hash-table',
  'dsa-heapsort': 'heap-sort',
  'dsa-linked-lists': 'listas-ligadas',
  'dsa-mergesort': 'merge-sort',
  'dsa-mst': 'mst',
  'dsa-n-ary-tree': 'n-ary-trees',
  'dsa-prefix-sum': 'prefix-sum',
  'dsa-queue': 'filas',
  'dsa-quicksort': 'quick-sort',
  'dsa-recursion-part1': 'recursao',
  'dsa-recursion-part2': 'recursao-funcional',
  'dsa-shellsort': 'shell-sort',
  'dsa-skip-list': 'skip-list',
  'dsa-sliding-window': 'sliding-window',
  'dsa-stacks': 'pilhas',
  'dsa-strings': 'strings',
  'dsa-topological-sorting': 'topological-sort',
  'dsa-trees': 'arvores-binarias',
  'dsa-trees-binary-search': 'bst',
  'dsa-trees-traversals': 'tree-traversals',
  'dsa-two-pointers': 'two-pointers',

  // Posts com id próprio (os demais reaproveitam a chave do evento)
  'dsa-bellman-ford': 'bellman-ford',
  'dsa-dijkstra': 'dijkstra',
};

/**
 * Tópico deste site (`/topics/<slug>`) → destino na plataforma. `null` manda
 * para o roadmap inteiro, que é o equivalente de um arquivo genérico como
 * "Algoritmos"; um tópico específico ganha o link específico.
 */
const TOPIC_BY_SITE_TOPIC: Record<string, TopicSlug | null> = {
  algoritmos: null,
  'estruturas-de-dados': null,
  grafos: 'grafos-intro',
  backtracking: 'backtracking',
};

function toTopic(slug: TopicSlug): DsaTopic {
  return {
    slug,
    label: TOPIC_LABELS[slug],
    // A barra final é a forma canônica da plataforma. Sem ela o link ganha um
    // salto de redirect antes de chegar no destino.
    url: `${DSA_PLATFORM_ORIGIN}/topico/${slug}/`,
  };
}

/** Tópico da plataforma equivalente a um post ou evento, se houver. */
export function getDsaTopicForContent(contentId: string): DsaTopic | null {
  const slug = TOPIC_BY_CONTENT_ID[contentId];
  return slug ? toTopic(slug) : null;
}

/** Um tópico do site cai na plataforma? Se sim, para onde. */
export function getDsaLinkForSiteTopic(
  topicSlug: string,
): { topic: DsaTopic | null } | null {
  if (!(topicSlug in TOPIC_BY_SITE_TOPIC)) return null;

  const slug = TOPIC_BY_SITE_TOPIC[topicSlug];
  return { topic: slug ? toTopic(slug) : null };
}
