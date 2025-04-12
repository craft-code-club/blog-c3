import { getAllPostsTopicsAsRawStringsSet, getSortedPostsData } from './posts';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export class Topic {
  name: string;
  key: string;
  description?: string;
  featured?: boolean;
  order: number;

  constructor(name: string, description?: string, key?: string, featured?: boolean, order?: number) {
    this.name = name;
    this.key = key ?? Topic.slugify(name);
    this.description = description;
    this.featured = featured;
    this.order = order ?? 1_000;
  }

  get slug(): string {
    return this.key;
  }

  private static slugify(name: string): string {
    return name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  }
}

const topicsDirectory = path.join(process.cwd(), '_content/tags');

export function getTopicsMetadataAsDictionary(): Record<string, Topic> {
  const topics = getTopicsMetadataFiles();
  return topics.reduce((topics, topic) => {
    topics[topic.key] = topic;
    return topics;
  }, {} as Record<string, Topic>);
}

function getAllTopicsFromMetadataAndPostsAsDictionary(): Record<string, Topic> {
  const topics = getTopicsMetadataAsDictionary();
  const topicsFromPosts = getAllPostsTopicsAsRawStringsSet();

  topicsFromPosts.forEach(topic => {
    if (!topics[topic]) {
      topics[topic] = new Topic(topic);
    }
  });
  return topics;
}

export function getSortedTopicList(): Topic[] {
  const topics = getAllTopicsFromMetadataAndPostsAsDictionary();
  const topicsList = Object.values(topics);
  const sortedTopicsList = sortTopics(topicsList);
  return sortedTopicsList;
}

export function getTopicBySlug(slug: string): Topic {
  const topics = getAllTopicsFromMetadataAndPostsAsDictionary();
  return topics[slug.toLowerCase()];
}

function sortTopics(topics: Topic[]) {
  return topics.sort((a, b) => {
    const diff = a.order - b.order;
    if (diff === 0)
      return a.name.localeCompare(b.name);
    return diff;
  });
}

function getTopicsMetadataFiles(): Topic[] {
  const fileNames = fs.readdirSync(topicsDirectory);

  const allTopics = fileNames.map((fileName) => {
    const fullPath = path.join(topicsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);

    return new Topic(
      data.name,
      data.description,
      data.key,
      data.featured,
      data.order);
  });
  return allTopics;
}
