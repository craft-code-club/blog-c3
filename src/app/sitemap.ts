import { MetadataRoute } from 'next'
import { getSortedPostsData } from '@/lib/posts'
import { getEvents } from '@/lib/events'
import { getSortedTopicList } from '@/lib/topics'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://craftcodeclub.io'
  
  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/topics`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ]

  // Dynamic blog post routes
  const posts = getSortedPostsData()
  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/posts/${post.id}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Dynamic event routes
  const { allEvents } = getEvents()
  const eventRoutes: MetadataRoute.Sitemap = allEvents.map((event) => ({
    url: `${baseUrl}/events/${event.id}`,
    lastModified: new Date(event.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // Dynamic topic routes
  const topics = getSortedTopicList()
  const topicRoutes: MetadataRoute.Sitemap = topics.map((topic) => ({
    url: `${baseUrl}/topics/${topic.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [...staticRoutes, ...postRoutes, ...eventRoutes, ...topicRoutes]
}