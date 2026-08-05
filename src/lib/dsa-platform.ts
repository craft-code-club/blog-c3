const DSA_PLATFORM_ORIGIN = 'https://dsa.craftcodeclub.io';

export const DSA_PLATFORM_URL = `${DSA_PLATFORM_ORIGIN}/`;
export const DSA_PLATFORM_ROADMAP_URL = `${DSA_PLATFORM_ORIGIN}/roadmap/`;

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

type TopicSlug = keyof typeof TOPIC_LABELS;

export type DsaTopic = {
  slug: TopicSlug;
  label: string;
  url: string;
};

const TOPIC_BY_CONTENT_ID: Record<string, TopicSlug> = {
  'dsa-a-star': 'a-star',
  'dsa-arrays': 'arrays',
  'dsa-backtracking': 'backtracking',
  'dsa-basic-sorting-algorithms': 'ordenacao-basica',
  'dsa-big-o': 'big-o',
  'dsa-binary-heap': 'binary-heap',
  'dsa-binary-search': 'busca-binaria',
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
  'dsa-bellman-ford': 'bellman-ford',
  'dsa-dijkstra': 'dijkstra',
};

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
    url: `${DSA_PLATFORM_ORIGIN}/topico/${slug}/`,
  };
}

export function getDsaTopicForContent(contentId: string): DsaTopic | null {
  if (!Object.hasOwn(TOPIC_BY_CONTENT_ID, contentId)) return null;

  return toTopic(TOPIC_BY_CONTENT_ID[contentId]);
}

export function getDsaLinkForSiteTopic(
  topicSlug: string,
): { topic: DsaTopic | null } | null {
  if (!Object.hasOwn(TOPIC_BY_SITE_TOPIC, topicSlug)) return null;

  const slug = TOPIC_BY_SITE_TOPIC[topicSlug];
  return { topic: slug ? toTopic(slug) : null };
}
