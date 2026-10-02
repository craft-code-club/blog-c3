import type { Event } from '@/lib/events';
import type { BlogPost } from '@/lib/posts';
import { OG_DEFAULTS } from '@/lib/seo';
import { absoluteUrl, SITE_URL } from '@/lib/site';

/**
 * Structured data (JSON-LD, schema.org) do site. Cada builder devolve o objeto
 * pronto para o componente `JsonLd`, renderizado no Server Component para sair
 * no HTML estático.
 *
 * Não usar: FAQPage (descontinuado em mai/2026), HowTo (2023) e SearchAction
 * (sitelinks search box, nov/2024). Validar mudanças no Rich Results Test e no
 * validator.schema.org.
 */

type JsonLdObject = Record<string, unknown>;

const CONTEXT = 'https://schema.org';

const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

const SITE_LANGUAGE = 'pt-BR';

/** Perfis oficiais da comunidade, para o Google consolidar a entidade. */
const ORGANIZATION_SAME_AS = [
  'https://github.com/craft-code-club',
  'https://www.youtube.com/@CraftCodeClub',
  // A página de convite, e não o discord.gg: o convite é rotacionável.
  absoluteUrl('/join'),
];

/** Offset fixo do horário de Brasília (sem horário de verão desde 2019). */
const BRAZIL_OFFSET = '-03:00';

/** Referência curta à organização, completa o bastante para valer sozinha. */
function organizationRef(): JsonLdObject {
  return {
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: OG_DEFAULTS.siteName,
    url: SITE_URL,
    logo: absoluteUrl('/logo.png'),
  };
}

export function organizationJsonLd(): JsonLdObject {
  return {
    '@context': CONTEXT,
    ...organizationRef(),
    description: 'Comunidade de desenvolvimento de software: Algoritmos, Estruturas de Dados, System Design, DDD e clube do livro.',
    sameAs: ORGANIZATION_SAME_AS,
  };
}

export function websiteJsonLd(): JsonLdObject {
  return {
    '@context': CONTEXT,
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: OG_DEFAULTS.siteName,
    url: SITE_URL,
    inLanguage: SITE_LANGUAGE,
    publisher: { '@id': ORGANIZATION_ID },
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>): JsonLdObject {
  return {
    '@context': CONTEXT,
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function blogPostingJsonLd(post: BlogPost): JsonLdObject {
  const url = absoluteUrl(`/posts/${post.id}`);

  return {
    '@context': CONTEXT,
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    mainEntityOfPage: url,
    url,
    headline: post.title,
    description: post.description,
    // Sem data de modificação no frontmatter: a publicação é a última versão conhecida.
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: SITE_LANGUAGE,
    image: absoluteUrl('/logo.png'),
    keywords: post.keywords?.length ? post.keywords : undefined,
    articleSection: post.topics.map((topic) => topic.name),
    author: (post.authors ?? []).map((author) => ({
      '@type': 'Person',
      name: author.name.trim(),
      ...(author.link && { url: author.link }),
    })),
    publisher: organizationRef(),
    isPartOf: { '@id': WEBSITE_ID },
  };
}

export function blogCollectionJsonLd(
  posts: Array<Pick<BlogPost, 'id' | 'title'>>,
  meta: { name: string; description: string; path: string },
): JsonLdObject {
  return {
    '@context': CONTEXT,
    '@type': 'CollectionPage',
    name: meta.name,
    description: meta.description,
    url: absoluteUrl(meta.path),
    inLanguage: SITE_LANGUAGE,
    isPartOf: { '@id': WEBSITE_ID },
    publisher: { '@id': ORGANIZATION_ID },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: posts.map((post, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: absoluteUrl(`/posts/${post.id}`),
        name: post.title,
      })),
    },
  };
}

/** Hosts exatos: `endsWith('youtube.com')` aceitaria `evilyoutube.com`. */
const YOUTUBE_HOSTS = new Set(['youtube.com', 'www.youtube.com', 'm.youtube.com']);

/** Extrai o id do vídeo dos formatos usados no conteúdo (watch, youtu.be, live). */
function getYouTubeVideoId(link: string): string | null {
  try {
    const url = new URL(link);
    if (url.hostname === 'youtu.be') return url.pathname.slice(1) || null;
    if (!YOUTUBE_HOSTS.has(url.hostname)) return null;

    const fromQuery = url.searchParams.get('v');
    if (fromQuery) return fromQuery;

    const match = url.pathname.match(/^\/(?:live|embed|shorts)\/([^/]+)/);
    return match?.[1] ?? null;
  } catch {
    return null;
  }
}

function toEventDateTime(date: string, time: string | undefined): string {
  return time && /^\d{2}:\d{2}$/.test(time) ? `${date}T${time}:00${BRAZIL_OFFSET}` : date;
}

function recordingJsonLd(event: Event, startDate: string): JsonLdObject | undefined {
  if (!event.recordingLink) return undefined;

  const videoId = getYouTubeVideoId(event.recordingLink);

  return {
    '@type': 'VideoObject',
    name: event.title,
    description: event.description,
    uploadDate: startDate,
    url: event.recordingLink,
    ...(videoId && {
      thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      embedUrl: `https://www.youtube.com/embed/${videoId}`,
    }),
    inLanguage: SITE_LANGUAGE,
    publisher: organizationRef(),
  };
}

export function eventJsonLd(event: Event): JsonLdObject {
  const url = absoluteUrl(`/events/${event.id}`);
  const date = event.date.slice(0, 10);
  const [start, end] = (event.time ?? '').split('-').map((part) => part.trim());
  const startDate = toEventDateTime(date, start);
  const endDate = end ? toEventDateTime(date, end) : undefined;
  const joinUrl = event.registrationLink ? absoluteUrl(event.registrationLink) : url;

  // Mesma resolução do banner usada na página do evento (`public/events/`).
  const banner = event.banner
    ? absoluteUrl(/^(https?:\/\/|\/)/.test(event.banner) ? event.banner : `/events/${event.banner}`)
    : undefined;

  return {
    '@context': CONTEXT,
    '@type': 'Event',
    '@id': `${url}#event`,
    url,
    name: event.title,
    description: event.description,
    startDate,
    endDate,
    inLanguage: SITE_LANGUAGE,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
    location: {
      '@type': 'VirtualLocation',
      name: event.location,
      url: joinUrl,
    },
    image: banner ?? absoluteUrl('/logo.png'),
    isAccessibleForFree: true,
    offers: {
      '@type': 'Offer',
      price: 0,
      priceCurrency: 'BRL',
      availability: 'https://schema.org/InStock',
      url: joinUrl,
    },
    organizer: organizationRef(),
    performer: event.speakers?.length
      ? event.speakers.map((name) => ({ '@type': 'Person', name: name.trim() }))
      : undefined,
    keywords: event.tags?.length ? event.tags.join(', ') : undefined,
    recordedIn: recordingJsonLd(event, startDate),
  };
}
