/**
 * Transforms a flat post list into a mixed array of standalone posts and series groups.
 *
 * - Filters out `-zh` locale posts from the listing
 * - Detects ZH counterparts and marks items with `hasZh` + link info
 * - Series groups are positioned at their most recent post's date in the timeline
 * - Single-post series are treated as standalone posts
 *
 * @param {Array} posts - Sorted posts from getAllPosts (newest first)
 * @returns {Array} Mixed array of:
 *   - { type: 'post', post, date }
 *   - { type: 'series', name, posts, latestDate, earliestDate, date, zhSeriesName? }
 */
export function groupPostsWithSeries (posts) {
  // Build slug lookup for ZH detection
  const slugToPost = {}
  for (const post of posts) {
    slugToPost[post.slug] = post
  }

  // Separate EN and ZH posts
  const enPosts = posts.filter(p => !p.slug.endsWith('-zh'))

  // Annotate each EN post with ZH availability
  const annotated = enPosts.map(post => {
    const zhPost = slugToPost[post.slug + '-zh']
    if (zhPost) {
      return { ...post, hasZh: true, zhSlug: zhPost.slug }
    }
    return post
  })

  // Collect series posts by name
  const seriesMap = {}
  const standalonePosts = []

  for (const post of annotated) {
    if (post.series) {
      if (!seriesMap[post.series]) {
        seriesMap[post.series] = []
      }
      seriesMap[post.series].push(post)
    } else {
      standalonePosts.push(post)
    }
  }

  // Build the mixed items array
  const items = []

  // Add standalone posts
  for (const post of standalonePosts) {
    items.push({ type: 'post', post, date: post.date })
  }

  // Add series groups (or promote single-post series to standalone)
  for (const [name, seriesPosts] of Object.entries(seriesMap)) {
    if (seriesPosts.length === 1) {
      items.push({ type: 'post', post: seriesPosts[0], date: seriesPosts[0].date })
      continue
    }

    // Sort by part number within the series
    const sorted = [...seriesPosts].sort((a, b) => (a.part ?? 0) - (b.part ?? 0))

    // Find date bounds
    const dates = sorted.map(p => p.date)
    const latestDate = Math.max(...dates)
    const earliestDate = Math.min(...dates)

    // Detect ZH series name from the first post's ZH counterpart
    let zhSeriesName = null
    for (const p of sorted) {
      if (p.hasZh) {
        const zhPost = slugToPost[p.zhSlug]
        if (zhPost?.series) {
          zhSeriesName = zhPost.series
          break
        }
      }
    }

    items.push({
      type: 'series',
      name,
      posts: sorted,
      latestDate,
      earliestDate,
      date: latestDate,
      zhSeriesName
    })
  }

  // Sort all items by date (newest first)
  items.sort((a, b) => b.date - a.date)

  return items
}
