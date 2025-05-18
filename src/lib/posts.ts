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

const postsDirectory = path.join(process.cwd(), '_content', 'posts');

export type BlogPost = {
  id: string;
  title: string;
  date: string;
  description: string;
  topics: Topic[];
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
    const { data } = matter(fileContents);

    // Combine the data with the id
    return {
      id,
      title: data.title,
      date: data.date,
      description: data.description,
      topics: mountTopics(data.topics, topicsMetadata),
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

export async function getPostData(id: string): Promise<BlogPost> {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
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
    
  // Fix inline code styling
  contentHtml = contentHtml
    .replace(/`([^`]+)`/g, (match, code) => {
      return `<code>${code}</code>`;
    });

  const topicsMetadata = getTopicsMetadataAsDictionary();

  return {
    id,
    contentHtml,
    title: data.title,
    date: data.date,
    description: data.description,
    topics: mountTopics(data.topics, topicsMetadata),
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
