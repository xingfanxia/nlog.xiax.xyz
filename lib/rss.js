import { Feed } from 'feed'
import { config } from '@/lib/server/config'

export async function generateRss(posts) {
  const year = new Date().getFullYear()
  const feed = new Feed({
    title: config.title,
    description: config.description,
    id: `${config.link}/${config.path}`,
    link: `${config.link}/${config.path}`,
    language: config.lang,
    favicon: `${config.link}/favicon.svg`,
    copyright: `All rights reserved ${year}, ${config.author}`,
    author: {
      name: config.author,
      email: config.email,
      link: config.link
    }
  })
  for (const post of posts) {
    feed.addItem({
      title: post.title,
      id: `${config.link}/${post.slug}`,
      link: `${config.link}/${post.slug}`,
      description: post.summary,
      date: new Date(post.date)
    })
  }
  return feed.atom1()
}
