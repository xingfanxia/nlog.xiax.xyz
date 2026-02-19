import { config as BLOG } from '@/lib/server/config'
import dayjs from 'dayjs'
import { officialClient } from '@/lib/server/notion-api'
import filterPublishedPosts from './filterPublishedPosts'

/**
 * Fetches all posts from the Notion database using the official API.
 *
 * @param {{ includePages: boolean }} - false: posts only / true: include pages
 */
export async function getAllPosts ({ includePages = false }) {
  const databaseId = process.env.NOTION_PAGE_ID

  if (!databaseId) {
    console.error('NOTION_PAGE_ID is not set')
    return []
  }

  if (!process.env.NOTION_ACCESS_TOKEN) {
    console.error('NOTION_ACCESS_TOKEN is not set')
    return []
  }

  let allPages = []
  let hasMore = true
  let startCursor = undefined

  try {
    // Paginate through all database entries
    while (hasMore) {
      const response = await officialClient.databases.query({
        database_id: databaseId,
        start_cursor: startCursor,
        page_size: 100
      })

      allPages = [...allPages, ...response.results]
      hasMore = response.has_more
      startCursor = response.next_cursor
    }
  } catch (error) {
    console.error('Failed to fetch posts from Notion:', error.message)
    return []
  }

  const data = allPages.map(page => {
    const properties = extractProperties(page)
    return properties
  }).filter(Boolean)

  // Filter to published posts/pages
  const posts = filterPublishedPosts({ posts: data, includePages })

  // Sort by date
  if (BLOG.sortByDate) {
    posts.sort((a, b) => b.date - a.date)
  }

  return posts
}

/**
 * Extract typed properties from an official Notion API page object.
 */
function extractProperties (page) {
  const props = page.properties
  if (!props) return null

  const title = extractTitle(props)
  const slug = extractRichText(props, 'slug')
  const summary = extractRichText(props, 'summary')
  const status = extractSelect(props, 'status')
  const type = extractSelect(props, 'type')
  const tags = extractMultiSelect(props, 'tags')
  const dateProperty = extractDate(props, 'date')
  const url = extractRichText(props, 'url')

  // Convert date to unix milliseconds timestamp
  const date = (
    dateProperty
      ? dayjs.tz(dateProperty)
      : dayjs(page.created_time)
  ).valueOf()

  return {
    id: page.id,
    title,
    slug,
    summary,
    status,
    type,
    tags,
    date,
    url,
    fullWidth: false
  }
}

/**
 * Helper: find a property by name (case-insensitive) from page properties.
 */
function findProperty (props, name) {
  const key = Object.keys(props).find(k => k.toLowerCase() === name.toLowerCase())
  return key ? props[key] : undefined
}

function extractTitle (props) {
  const prop = findProperty(props, 'title') || findProperty(props, 'name')
  if (!prop) return ''
  if (prop.type === 'title' && prop.title) {
    return prop.title.map(t => t.plain_text).join('')
  }
  return ''
}

function extractRichText (props, name) {
  const prop = findProperty(props, name)
  if (!prop) return ''
  if (prop.type === 'rich_text' && prop.rich_text) {
    return prop.rich_text.map(t => t.plain_text).join('')
  }
  // Sometimes URL is stored as a url property type
  if (prop.type === 'url') {
    return prop.url || ''
  }
  return ''
}

function extractSelect (props, name) {
  const prop = findProperty(props, name)
  if (!prop) return ''
  // Handle both 'select' and Notion's native 'status' property types
  if (prop.type === 'select' && prop.select) {
    return prop.select.name || ''
  }
  if (prop.type === 'status' && prop.status) {
    return prop.status.name || ''
  }
  return ''
}

function extractMultiSelect (props, name) {
  const prop = findProperty(props, name)
  if (!prop || prop.type !== 'multi_select' || !prop.multi_select) return []
  return prop.multi_select.map(s => s.name)
}

function extractDate (props, name) {
  const prop = findProperty(props, name)
  if (!prop || prop.type !== 'date' || !prop.date) return null
  return prop.date.start || null
}
