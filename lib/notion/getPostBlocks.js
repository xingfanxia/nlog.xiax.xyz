import { compatClient } from '@/lib/server/notion-api'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

const CACHE_DIR = join(process.cwd(), 'content', 'cache')
const EMPTY_RECORD_MAP = { block: {}, collection: {}, collection_query: {}, collection_view: {}, notion_user: {} }

export async function getPostBlocks (id) {
  try {
    // notion-compat converts official API response to react-notion-x recordMap format
    const recordMap = await compatClient.getPage(id)
    return recordMap
  } catch (error) {
    console.error(`Failed to fetch blocks for page ${id}:`, error.message)
    return loadFromCache(id)
  }
}

function loadFromCache (id) {
  const cachePath = join(CACHE_DIR, `${id}.json`)

  if (!existsSync(cachePath)) {
    console.warn(`No cached recordMap found for ${id}`)
    return EMPTY_RECORD_MAP
  }

  console.warn(`Notion unavailable — loading cached recordMap for ${id}`)
  try {
    const raw = readFileSync(cachePath, 'utf-8')
    return JSON.parse(raw)
  } catch (error) {
    console.error(`Failed to load cached recordMap for ${id}:`, error.message)
    return EMPTY_RECORD_MAP
  }
}
