import { Client } from '@notionhq/client'
import { NotionCompatAPI } from 'notion-compat'

const { NOTION_ACCESS_TOKEN } = process.env

// Official Notion API client — used for database queries
const officialClient = new Client({ auth: NOTION_ACCESS_TOKEN })

// Compat wrapper — converts official API responses to react-notion-x recordMap format
const compatClient = new NotionCompatAPI(officialClient)

export { officialClient, compatClient }
export default compatClient
