import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import '../assets/code-stackoverflow-dark.css';
import '../assets/inline-code.css';
import rehypeSlug from 'rehype-slug';
import { getTopicsMetadataAsDictionary, Topic } from './topics';
import { resolveDiscordLinks } from './discord';

const postsDirectory = path.join(process.cwd(), '_content', 'posts');

export type BlogPost = {
  id: string;
  title: string;
  date: string;
  description: string;
  topics: Topic[];
  keywords?: string[];
  contentHtml: string;
  authors?: Array<{
    name: string;
    link?: string;
  }>;
}

export function getSortedPostsData(): Omit<BlogPost, 'contentHtml'>[] {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);
  const topicsMetadata = getTopicsMetadataAsDictionary();
  const allPostsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, '');

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const { data } = matter(resolveDiscordLinks(fileContents));

    // Combine the data with the id
    return {
      id,
      title: data.title,
      date: data.date,
      description: data.description,
      topics: mountTopics(data.topics, topicsMetadata),
      keywords: Array.isArray(data.keywords) ? data.keywords : data.keywords ? [data.keywords] : [],
    };
  });
  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export const POSTS_PER_PAGE = 8;

export interface PaginatedPosts {
  posts: Omit<BlogPost, 'contentHtml'>[];
  total: number;
  totalPages: number;
}

function paginatePosts(posts: Omit<BlogPost, 'contentHtml'>[], page: number, limit: number): PaginatedPosts {
  // Guard the public `limit` param: a non-positive value would make totalPages
  // Infinity/NaN and blow up array allocation downstream.
  const safeLimit = limit > 0 ? Math.floor(limit) : POSTS_PER_PAGE;
  const total = posts.length;
  // An empty list is still "one (empty) page", so page 1 always exists and its
  // canonical redirect keeps working under output: export.
  const totalPages = Math.max(1, Math.ceil(total / safeLimit));
  const startIndex = (page - 1) * safeLimit;

  return {
    posts: posts.slice(startIndex, startIndex + safeLimit),
    total,
    totalPages,
  };
}

export function getPaginatedPosts(page: number = 1, limit: number = POSTS_PER_PAGE): PaginatedPosts {
  return paginatePosts(getSortedPostsData(), page, limit);
}

export function getPostsByTopic(topicKey: string): Omit<BlogPost, 'contentHtml'>[] {
  return getSortedPostsData().filter((post) => post.topics.some((topic) => topic.key === topicKey));
}

export function getPaginatedPostsByTopic(topicKey: string, page: number = 1, limit: number = POSTS_PER_PAGE): PaginatedPosts {
  return paginatePosts(getPostsByTopic(topicKey), page, limit);
}

export async function getPostData(id: string): Promise<BlogPost> {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(resolveDiscordLinks(fileContents));
  const processedContent = await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype, { allowDangerousHtml: true }) // Allow HTML to pass through
      .use(rehypeSlug)
      .use(rehypeHighlight)
      .use(rehypeStringify, { allowDangerousHtml: true }) // Preserve HTML in the output
      .process(content);

  let contentHtml = processedContent.toString();
  // Adjust image paths dynamically
  contentHtml = contentHtml
    .replace(/<img src="\/public/g, `<img src="`)
    .replace(/<img src="\.\.\/\.\.\/public/g, `<img src="`)

  const topicsMetadata = getTopicsMetadataAsDictionary();

  return {
    id,
    contentHtml,
    title: data.title,
    date: data.date,
    description: data.description,
    topics: mountTopics(data.topics, topicsMetadata),
    keywords: Array.isArray(data.keywords) ? data.keywords : [],
    authors: data.authors,
  };
}

export function getPostsTopics(): Topic[] {
  const seenSlugs = new Set<string>();
  return getSortedPostsData().reduce((topics, post) => {
    post.topics.forEach(topic => {
      if (seenSlugs.has(topic.slug)) return;
      topics.push(topic);
      seenSlugs.add(topic.slug);
    });
    return topics;
  }, [] as Topic[]);
}

function mountTopics(topics: string[], topicsMetadata: Record<string, Topic>): Topic[] {
  return topics.map(topic => {
    const newTopic = new Topic(topic);
    const topicMetadata = topicsMetadata[newTopic.key];
    return topicMetadata ?? newTopic;
  });
}
