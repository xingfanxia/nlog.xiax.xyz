# nlog.xiax.xyz

Nobelium-based Next.js blog powered by Notion as CMS.

## Architecture

- **Notion SDK**: Official `@notionhq/client` for DB queries + `notion-compat` for react-notion-x recordMaps
- **Data flow**: `getAllPosts()` queries Notion DB, extracts properties, filters published, sorts by date
- **Block rendering**: `getPostBlocks()` fetches recordMap via `compatClient.getPage(id)` for react-notion-x

## Dual Data Path (Notion + Local Fallback)

The blog has a resilient dual data path. Notion is primary; local files are the fallback.

### Local backup structure

```
content/
  posts.json              # Full metadata array (same shape as getAllPosts returns)
  posts/{slug}.md          # Human-readable markdown with frontmatter
  cache/{pageId}.json      # Cached recordMaps for react-notion-x rendering
```

### Fallback behavior

- `getAllPosts()` tries Notion API first. If it fails (returns empty), loads from `content/posts.json`
- `getPostBlocks()` tries Notion API first. On error, loads cached recordMap from `content/cache/{id}.json`
- The rendering layer sees the same data shape regardless of source

### Scripts

```bash
# Export all posts from Notion to content/ (run periodically to keep backup fresh)
set -a && source .env.local && set +a && node scripts/export-from-notion.mjs

# Restore all posts from content/posts/ back to Notion (skips existing slugs)
set -a && source .env.local && set +a && node scripts/restore-to-notion.mjs [--dry-run]

# Upload individual markdown files to Notion
set -a && source .env.local && set +a && node scripts/upload-to-notion.mjs <path> [--publish]
```

## Series System

- Notion properties: `Series` (select) + `Part` (number)
- `getAllSeriesFromPosts()` groups posts by series, sorts by part
- `groupPostsWithSeries()` builds mixed timeline (standalone posts + collapsible series cards)
- Series detail pages at `/series/[name]`, in-post nav via `SeriesNav` component
- Current series: "Building PanPanMao", "The PanPanMao Story", "Agentic AI Thoughts", "AI智能体随想"

## Language Toggle

- Slug convention: EN `foo` ↔ ZH `foo-zh`
- Auto-detected in `[slug].js` getStaticProps — no extra Notion property needed
- `LanguageToggle` component renders EN/ZH switcher when a counterpart exists

## Key Files

| File | Purpose |
|------|---------|
| `lib/notion/getAllPosts.js` | Post fetching with Notion → local fallback |
| `lib/notion/getPostBlocks.js` | Block fetching with recordMap cache fallback |
| `lib/notion/getAllSeriesFromPosts.js` | Series grouping |
| `lib/groupPostsWithSeries.js` | Mixed timeline builder |
| `components/SeriesCard.js` | Collapsible series card (details/summary) |
| `components/SeriesNav.js` | In-post prev/next navigation |
| `components/LanguageToggle.js` | EN/ZH toggle |
| `components/BlogPost.js` | Post card with clickable tags |
| `scripts/export-from-notion.mjs` | Export Notion → content/ |
| `scripts/restore-to-notion.mjs` | Restore content/ → Notion |
| `scripts/upload-to-notion.mjs` | Upload individual markdown files |

## Content Guidelines

- When writing or editing articles, **always cross-link other articles** when they are mentioned or referenced. Use markdown links with slug paths: `[Part 3](/the-agent-economy)` (EN) or `[第三篇](/the-agent-economy-zh)` (ZH). ZH articles link to ZH slugs, EN to EN.

## Personal Site Sync (xiax.xyz)

The "Agentic AI Thoughts" series is mirrored to the personal portfolio site at `/Users/xingfanxia/projects/personal/personal_site/blog/`. Only this series (6 parts, EN + ZH = 12 files) is synced — not the full blog content.

### Sync workflow

1. Copy updated `.md` files to `personal_site/blog/`
2. Run `node build.js` in personal_site to regenerate `blog-content.js`
3. Commit and push

The personal_site uses a terminal-style UI. `content.js` has two places to update when adding new posts: (1) the `blogPosts` registry (maps post IDs to files + language toggle), and (2) an `ls`-style listing that shows files in the terminal. `build.js` separately maps filenames to post IDs for content generation.

## Environment Variables

- `NOTION_ACCESS_TOKEN` — Notion integration token
- `NOTION_PAGE_ID` — Notion database ID
- Stored in `.env.local` (not committed)
