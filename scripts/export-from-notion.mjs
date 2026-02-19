#!/usr/bin/env node
/**
 * Export all published blog posts from Notion to local files.
 *
 * Creates:
 *   content/posts/{slug}.md   — Markdown with frontmatter + body
 *   content/posts.json        — Full metadata array (getAllPosts shape)
 *   content/cache/{pageId}.json — Cached recordMaps for react-notion-x
 *
 * Usage:
 *   node scripts/export-from-notion.mjs
 *
 * Environment variables (from .env.local or exported):
 *   NOTION_ACCESS_TOKEN  - Notion integration token
 *   NOTION_PAGE_ID       - Notion database ID
 */

import { Client } from '@notionhq/client'
import { NotionCompatAPI } from 'notion-compat'
import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js'
import timezone from 'dayjs/plugin/timezone.js'

dayjs.extend(utc)
dayjs.extend(timezone)

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const NOTION_ACCESS_TOKEN = process.env.NOTION_ACCESS_TOKEN
const DATABASE_ID = process.env.NOTION_PAGE_ID

if (!NOTION_ACCESS_TOKEN || !DATABASE_ID) {
  console.error('Missing NOTION_ACCESS_TOKEN or NOTION_PAGE_ID env vars')
  process.exit(1)
}

const notion = new Client({ auth: NOTION_ACCESS_TOKEN })
const compatClient = new NotionCompatAPI(notion)

const ROOT = join(import.meta.dirname, '..')
const POSTS_DIR = join(ROOT, 'content', 'posts')
const CACHE_DIR = join(ROOT, 'content', 'cache')

mkdirSync(POSTS_DIR, { recursive: true })
mkdirSync(CACHE_DIR, { recursive: true })

// ---------------------------------------------------------------------------
// Property extractors (mirrors lib/notion/getAllPosts.js)
// ---------------------------------------------------------------------------

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
  if (prop.type === 'url') return prop.url || ''
  return ''
}

function extractSelect (props, name) {
  const prop = findProperty(props, name)
  if (!prop) return ''
  if (prop.type === 'select' && prop.select) return prop.select.name || ''
  if (prop.type === 'status' && prop.status) return prop.status.name || ''
  return ''
}

function extractNumber (props, name) {
  const prop = findProperty(props, name)
  if (!prop || prop.type !== 'number') return null
  return prop.number
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

function extractProperties (page) {
  const props = page.properties
  if (!props) return null

  const title = extractTitle(props)
  const slug = extractRichText(props, 'slug')
  const summary = extractRichText(props, 'summary')
  const status = extractSelect(props, 'status')
  const type = extractSelect(props, 'type')
  const tags = extractMultiSelect(props, 'tags')
  const series = extractSelect(props, 'series')
  const part = extractNumber(props, 'part')
  const dateProperty = extractDate(props, 'date')

  const date = (
    dateProperty
      ? dayjs(dateProperty)
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
    series: series || null,
    part: part ?? null,
    date,
    fullWidth: false
  }
}

// ---------------------------------------------------------------------------
// Notion blocks → Markdown
// ---------------------------------------------------------------------------

function richTextToMarkdown (richTexts) {
  if (!richTexts) return ''
  return richTexts.map(rt => {
    let text = rt.plain_text || ''
    const ann = rt.annotations || {}
    if (ann.code) text = `\`${text}\``
    if (ann.bold) text = `**${text}**`
    if (ann.italic) text = `*${text}*`
    if (ann.strikethrough) text = `~~${text}~~`
    if (rt.href) text = `[${text}](${rt.href})`
    return text
  }).join('')
}

async function fetchAllBlocks (blockId) {
  const blocks = []
  let hasMore = true
  let startCursor = undefined

  while (hasMore) {
    const response = await notion.blocks.children.list({
      block_id: blockId,
      start_cursor: startCursor,
      page_size: 100
    })
    blocks.push(...response.results)
    hasMore = response.has_more
    startCursor = response.next_cursor
  }

  return blocks
}

function blockToMarkdown (block) {
  const type = block.type
  const data = block[type]

  switch (type) {
    case 'paragraph':
      return richTextToMarkdown(data?.rich_text) || ''

    case 'heading_1':
      return `# ${richTextToMarkdown(data?.rich_text)}`

    case 'heading_2':
      return `## ${richTextToMarkdown(data?.rich_text)}`

    case 'heading_3':
      return `### ${richTextToMarkdown(data?.rich_text)}`

    case 'bulleted_list_item':
      return `- ${richTextToMarkdown(data?.rich_text)}`

    case 'numbered_list_item':
      return `1. ${richTextToMarkdown(data?.rich_text)}`

    case 'quote':
      return `> ${richTextToMarkdown(data?.rich_text)}`

    case 'code':
      return `\`\`\`${data?.language || ''}\n${richTextToMarkdown(data?.rich_text)}\n\`\`\``

    case 'divider':
      return '---'

    case 'image': {
      const url = data?.file?.url || data?.external?.url || ''
      const caption = richTextToMarkdown(data?.caption)
      return `![${caption}](${url})`
    }

    case 'callout':
      return `> ${richTextToMarkdown(data?.rich_text)}`

    case 'toggle':
      return richTextToMarkdown(data?.rich_text)

    case 'bookmark':
      return data?.url || ''

    default:
      // For unsupported block types, extract any rich_text if present
      if (data?.rich_text) return richTextToMarkdown(data.rich_text)
      return ''
  }
}

// ---------------------------------------------------------------------------
// Build frontmatter
// ---------------------------------------------------------------------------

function buildFrontmatter (post, dateStr) {
  const lines = ['---']
  lines.push(`title: "${post.title.replace(/"/g, '\\"')}"`)
  lines.push(`date: "${dateStr}"`)
  if (post.summary) lines.push(`summary: "${post.summary.replace(/"/g, '\\"')}"`)
  if (post.tags && post.tags.length > 0) {
    lines.push(`tags: [${post.tags.map(t => `"${t}"`).join(', ')}]`)
  }
  if (post.series) lines.push(`series: "${post.series}"`)
  if (post.part != null) lines.push(`part: ${post.part}`)
  if (post.type) lines.push(`type: "${post.type}"`)
  if (post.status) lines.push(`status: "${post.status}"`)
  lines.push('---')
  return lines.join('\n')
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main () {
  console.log('Fetching all posts from Notion...\n')

  let allPages = []
  let hasMore = true
  let startCursor = undefined

  while (hasMore) {
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      start_cursor: startCursor,
      page_size: 100
    })
    allPages = [...allPages, ...response.results]
    hasMore = response.has_more
    startCursor = response.next_cursor
  }

  console.log(`Fetched ${allPages.length} pages from database.\n`)

  // Extract metadata for all pages
  const allPosts = allPages.map(page => extractProperties(page)).filter(Boolean)

  // Filter to published posts only
  const publishedPosts = allPosts.filter(p =>
    p.title && p.slug && p.status === 'Published' &&
    (p.type === 'Post' || p.type === 'Page')
  )

  console.log(`Found ${publishedPosts.length} published posts.\n`)

  // Sort by date descending
  publishedPosts.sort((a, b) => b.date - a.date)

  // Save posts.json manifest
  writeFileSync(
    join(ROOT, 'content', 'posts.json'),
    JSON.stringify(publishedPosts, null, 2)
  )
  console.log('Saved content/posts.json\n')

  // Export each post
  for (const post of publishedPosts) {
    const dateStr = dayjs(post.date).format('YYYY-MM-DD')

    // 1. Fetch blocks and convert to markdown
    console.log(`Exporting: ${post.title} (${post.slug})`)
    try {
      const blocks = await fetchAllBlocks(post.id)
      const bodyLines = blocks.map(b => blockToMarkdown(b))
      const body = bodyLines.join('\n\n')

      const frontmatter = buildFrontmatter(post, dateStr)
      const markdown = `${frontmatter}\n\n${body}\n`

      writeFileSync(join(POSTS_DIR, `${post.slug}.md`), markdown)
      console.log(`  Saved content/posts/${post.slug}.md`)
    } catch (err) {
      console.error(`  Error fetching blocks for ${post.slug}: ${err.message}`)
      // Still save frontmatter-only file
      const frontmatter = buildFrontmatter(post, dateStr)
      writeFileSync(join(POSTS_DIR, `${post.slug}.md`), `${frontmatter}\n`)
      console.log(`  Saved content/posts/${post.slug}.md (frontmatter only)`)
    }

    // 2. Fetch recordMap and cache it
    try {
      const recordMap = await compatClient.getPage(post.id)
      writeFileSync(
        join(CACHE_DIR, `${post.id}.json`),
        JSON.stringify(recordMap)
      )
      console.log(`  Saved content/cache/${post.id}.json`)
    } catch (err) {
      console.error(`  Error caching recordMap for ${post.slug}: ${err.message}`)
    }

    console.log('')
  }

  console.log(`Done. Exported ${publishedPosts.length} posts.`)
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
