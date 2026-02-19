#!/usr/bin/env node
/**
 * Restore all blog posts from local backup to a Notion database.
 *
 * Reads all markdown files from content/posts/ and uploads them
 * to the Notion database, skipping any that already exist (by slug).
 *
 * Usage:
 *   node scripts/restore-to-notion.mjs [--dry-run]
 *
 * Environment variables (from .env.local or exported):
 *   NOTION_ACCESS_TOKEN  - Notion integration token
 *   NOTION_PAGE_ID       - Notion database ID
 *
 * All restored posts are created with their original status from frontmatter.
 */

import { Client } from '@notionhq/client'
import { readFileSync, readdirSync } from 'fs'
import { join, basename } from 'path'

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

const args = process.argv.slice(2)
const dryRunFlag = args.includes('--dry-run')

const ROOT = join(import.meta.dirname, '..')
const POSTS_DIR = join(ROOT, 'content', 'posts')

// ---------------------------------------------------------------------------
// Frontmatter parser
// ---------------------------------------------------------------------------

function parseFrontmatter (content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) return { meta: {}, body: content }

  const raw = match[1]
  const body = match[2]
  const meta = {}

  for (const line of raw.split('\n')) {
    const idx = line.indexOf(':')
    if (idx === -1) continue
    const key = line.slice(0, idx).trim()
    let value = line.slice(idx + 1).trim()

    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }

    if (value.startsWith('[') && value.endsWith(']')) {
      value = value.slice(1, -1)
        .split(',')
        .map(s => s.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean)
    }

    meta[key] = value
  }

  return { meta, body }
}

// ---------------------------------------------------------------------------
// Markdown to Notion blocks
// ---------------------------------------------------------------------------

function parseInlineFormatting (text) {
  const results = []
  const regex = /(\*\*(.+?)\*\*)|(\*(.+?)\*)|(`(.+?)`)|(\[([^\]]+)\]\(([^)]+)\))/g
  let lastIndex = 0
  let match

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      results.push({ type: 'text', text: { content: text.slice(lastIndex, match.index) } })
    }
    if (match[1]) {
      results.push({ type: 'text', text: { content: match[2] }, annotations: { bold: true } })
    } else if (match[3]) {
      results.push({ type: 'text', text: { content: match[4] }, annotations: { italic: true } })
    } else if (match[5]) {
      results.push({ type: 'text', text: { content: match[6] }, annotations: { code: true } })
    } else if (match[7]) {
      results.push({ type: 'text', text: { content: match[8], link: { url: match[9] } } })
    }
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    results.push({ type: 'text', text: { content: text.slice(lastIndex) } })
  }
  if (results.length === 0) {
    results.push({ type: 'text', text: { content: text } })
  }
  return results
}

function clampRichText (richText) {
  const clamped = []
  for (const rt of richText) {
    const content = rt.text.content
    if (content.length <= 2000) {
      clamped.push(rt)
    } else {
      for (let i = 0; i < content.length; i += 2000) {
        clamped.push({ ...rt, text: { ...rt.text, content: content.slice(i, i + 2000) } })
      }
    }
  }
  return clamped
}

function markdownToBlocks (markdown) {
  const lines = markdown.split('\n')
  const blocks = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    if (line.trim() === '') { i++; continue }

    if (line.trim().startsWith('```')) {
      const lang = line.trim().slice(3).trim() || 'plain text'
      const codeLines = []
      i++
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }
      i++
      blocks.push({
        object: 'block', type: 'code',
        code: {
          rich_text: clampRichText([{ type: 'text', text: { content: codeLines.join('\n') } }]),
          language: lang === '' ? 'plain text' : lang
        }
      })
      continue
    }

    if (line.startsWith('### ')) {
      blocks.push({ object: 'block', type: 'heading_3', heading_3: { rich_text: clampRichText(parseInlineFormatting(line.slice(4))) } })
      i++; continue
    }
    if (line.startsWith('## ')) {
      blocks.push({ object: 'block', type: 'heading_2', heading_2: { rich_text: clampRichText(parseInlineFormatting(line.slice(3))) } })
      i++; continue
    }
    if (line.startsWith('# ')) {
      blocks.push({ object: 'block', type: 'heading_1', heading_1: { rich_text: clampRichText(parseInlineFormatting(line.slice(2))) } })
      i++; continue
    }
    if (line.startsWith('> ')) {
      blocks.push({ object: 'block', type: 'quote', quote: { rich_text: clampRichText(parseInlineFormatting(line.slice(2))) } })
      i++; continue
    }
    if (line.match(/^[-*] /)) {
      blocks.push({ object: 'block', type: 'bulleted_list_item', bulleted_list_item: { rich_text: clampRichText(parseInlineFormatting(line.replace(/^[-*] /, ''))) } })
      i++; continue
    }
    if (line.match(/^\d+\. /)) {
      blocks.push({ object: 'block', type: 'numbered_list_item', numbered_list_item: { rich_text: clampRichText(parseInlineFormatting(line.replace(/^\d+\. /, ''))) } })
      i++; continue
    }
    if (line.trim().match(/^[-*_]{3,}$/)) {
      blocks.push({ object: 'block', type: 'divider', divider: {} })
      i++; continue
    }

    blocks.push({ object: 'block', type: 'paragraph', paragraph: { rich_text: clampRichText(parseInlineFormatting(line)) } })
    i++
  }

  return blocks
}

// ---------------------------------------------------------------------------
// Schema + helpers
// ---------------------------------------------------------------------------

let dbSchema = null

async function getDbSchema () {
  if (dbSchema) return dbSchema
  const db = await notion.databases.retrieve({ database_id: DATABASE_ID })
  dbSchema = {}
  for (const [name, prop] of Object.entries(db.properties)) {
    dbSchema[name.toLowerCase()] = { name, type: prop.type }
  }
  return dbSchema
}

function buildPropertyValue (schema, propName, type, value) {
  const entry = schema[propName.toLowerCase()]
  if (!entry) return null

  const actualName = entry.name
  const actualType = entry.type

  switch (type) {
    case 'title':
      return { [actualName]: { title: [{ text: { content: value } }] } }
    case 'rich_text':
      return { [actualName]: { rich_text: [{ text: { content: value } }] } }
    case 'select':
      if (actualType === 'status') return { [actualName]: { status: { name: value } } }
      return { [actualName]: { select: { name: value } } }
    case 'multi_select':
      return { [actualName]: { multi_select: (Array.isArray(value) ? value : [value]).map(v => ({ name: v })) } }
    case 'number':
      return { [actualName]: { number: value } }
    case 'date':
      return { [actualName]: { date: { start: value } } }
    default:
      return null
  }
}

async function getExistingSlugs () {
  const slugs = new Set()
  let hasMore = true
  let startCursor = undefined

  while (hasMore) {
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      start_cursor: startCursor,
      page_size: 100
    })
    for (const page of response.results) {
      const props = page.properties
      const slugKey = Object.keys(props).find(k => k.toLowerCase() === 'slug')
      if (slugKey && props[slugKey].rich_text) {
        const slugVal = props[slugKey].rich_text.map(t => t.plain_text).join('')
        if (slugVal) slugs.add(slugVal)
      }
    }
    hasMore = response.has_more
    startCursor = response.next_cursor
  }
  return slugs
}

// ---------------------------------------------------------------------------
// Upload a single article
// ---------------------------------------------------------------------------

async function restoreArticle (filePath, schema, existingSlugs) {
  const content = readFileSync(filePath, 'utf-8')
  const { meta, body } = parseFrontmatter(content)

  if (!meta.title) {
    console.warn(`  Skipping ${filePath}: no title in frontmatter`)
    return null
  }

  const slug = basename(filePath, '.md')

  if (existingSlugs.has(slug)) {
    console.log(`  Skipping "${meta.title}" — slug "${slug}" already exists`)
    return null
  }

  const status = meta.status || 'Published'
  const type = meta.type || 'Post'

  const properties = {
    ...buildPropertyValue(schema, 'title', 'title', meta.title),
    ...buildPropertyValue(schema, 'slug', 'rich_text', slug),
    ...buildPropertyValue(schema, 'status', 'select', status),
    ...buildPropertyValue(schema, 'type', 'select', type)
  }

  if (meta.summary) Object.assign(properties, buildPropertyValue(schema, 'summary', 'rich_text', meta.summary))
  if (meta.date) Object.assign(properties, buildPropertyValue(schema, 'date', 'date', meta.date))
  if (meta.tags) Object.assign(properties, buildPropertyValue(schema, 'tags', 'multi_select', meta.tags))
  if (meta.series) Object.assign(properties, buildPropertyValue(schema, 'series', 'select', meta.series))
  if (meta.part) Object.assign(properties, buildPropertyValue(schema, 'part', 'number', Number(meta.part)))

  const blocks = markdownToBlocks(body)

  if (dryRunFlag) {
    console.log(`  [DRY RUN] Would restore: "${meta.title}" (slug: ${slug}, ${blocks.length} blocks)`)
    return { title: meta.title, slug }
  }

  const firstBatch = blocks.slice(0, 100)
  const remainingBatches = []
  for (let j = 100; j < blocks.length; j += 100) {
    remainingBatches.push(blocks.slice(j, j + 100))
  }

  const page = await notion.pages.create({
    parent: { database_id: DATABASE_ID },
    properties,
    children: firstBatch
  })

  for (const batch of remainingBatches) {
    await notion.blocks.children.append({ block_id: page.id, children: batch })
  }

  console.log(`  Restored: "${meta.title}" (slug: ${slug}, ${blocks.length} blocks)`)
  return { title: meta.title, slug, id: page.id }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main () {
  const files = readdirSync(POSTS_DIR)
    .filter(f => f.endsWith('.md'))
    .sort()
    .map(f => join(POSTS_DIR, f))

  if (files.length === 0) {
    console.log('No markdown files found in content/posts/')
    return
  }

  console.log(`Found ${files.length} backup file(s) in content/posts/\n`)

  if (dryRunFlag) console.log('DRY RUN MODE — no changes will be made\n')

  console.log('Fetching database schema...')
  const schema = await getDbSchema()

  console.log('Checking existing articles...')
  const existingSlugs = await getExistingSlugs()
  console.log(`  Found ${existingSlugs.size} existing articles\n`)

  const results = []
  for (const file of files) {
    try {
      const result = await restoreArticle(file, schema, existingSlugs)
      if (result) results.push(result)
    } catch (err) {
      console.error(`  Error restoring ${basename(file)}: ${err.message}`)
    }
  }

  console.log(`\nDone. ${results.length} article(s) restored.`)
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
