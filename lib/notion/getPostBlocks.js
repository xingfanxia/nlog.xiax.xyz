import { compatClient } from '@/lib/server/notion-api'

export async function getPostBlocks (id) {
  try {
    // notion-compat converts official API response to react-notion-x recordMap format
    const recordMap = await compatClient.getPage(id)
    return recordMap
  } catch (error) {
    console.error(`Failed to fetch blocks for page ${id}:`, error.message)
    return { block: {}, collection: {}, collection_query: {}, collection_view: {}, notion_user: {} }
  }
}
