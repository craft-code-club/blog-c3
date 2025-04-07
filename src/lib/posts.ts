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
import rehypeSlug from 'rehype-slug';

const postsDirectory = path.join(process.cwd(), '_content', 'posts');

export type BlogPost = {
  id: string;
  title: string;
  date: string;
  description: string;
  topics: string[];
  contentHtml: string;
  authors?: Array<{
    name: string;
    link?: string;
  }>;
}

// Helper function to format topic display
export function formatTopicDisplay(topics: string[]) {
  const MAX_CHARS = 35;
  const visibleTopics: string[] = [];
  const hiddenTopics: string[] = [];
  let currentLength = 0;

  for (const topic of topics) {
    const formattedTopic = topic.charAt(0).toUpperCase() + topic.slice(1).replace(/-/g, ' ');
    if (currentLength + formattedTopic.length <= MAX_CHARS) {
      visibleTopics.push(topic);
      currentLength += formattedTopic.length;
    } else {
      hiddenTopics.push(formattedTopic);
    }
  }

  return {
    visibleTopics,
    hiddenTopics,
    hasHidden: hiddenTopics.length > 0
  };
}

export function getSortedPostsData(): Omit<BlogPost, 'contentHtml'>[] {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, '');

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Combine the data with the id
    return {
      id,
      title: matterResult.data.title,
      date: matterResult.data.date,
      description: matterResult.data.description,
      topics: matterResult.data.topics || [],
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

  const matterResult = matter(fileContents);

  const processedContent = await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype)
      .use(rehypeSlug) 
      .use(rehypeHighlight)
      .use(rehypeStringify)
      .process(matterResult.content);

  let contentHtml = processedContent.toString();

  // Adjust image paths dynamically
  contentHtml = contentHtml
    .replace(/<img src="\/public/g, `<img src="`)
    .replace(/<img src="\.\.\/\.\.\/public/g, `<img src="`);

  return {
    id,
    contentHtml,
    title: matterResult.data.title,
    date: matterResult.data.date,
    description: matterResult.data.description,
    topics: matterResult.data.topics || [],
    authors: matterResult.data.authors,
  };
}

export function getAllTopics(): string[] {
  const posts = getSortedPostsData();
  const topicsSet = new Set<string>();

  posts.forEach(post => {
    post.topics.forEach(topic => {
      topicsSet.add(topic);
    });
  });

  return Array.from(topicsSet).sort();
}
