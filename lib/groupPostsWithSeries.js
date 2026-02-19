/**
 * Transforms a flat post list into a mixed array of standalone posts and series groups.
 *
 * Series groups are positioned at their most recent post's date in the timeline.
 * Single-post series are treated as standalone posts (no collapsed card for 1 item).
 *
 * @param {Array} posts - Sorted posts from getAllPosts (newest first)
 * @returns {Array} Mixed array of:
 *   - { type: 'post', post, date }
 *   - { type: 'series', name, posts, latestDate, earliestDate, date }
 */
export function groupPostsWithSeries (posts) {
  // Collect series posts by name
  const seriesMap = {}
  const standalonePosts = []

  for (const post of posts) {
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
      // Single-post series → treat as standalone
      items.push({ type: 'post', post: seriesPosts[0], date: seriesPosts[0].date })
      continue
    }

    // Sort by part number within the series
    const sorted = [...seriesPosts].sort((a, b) => (a.part ?? 0) - (b.part ?? 0))

    // Find date bounds
    const dates = sorted.map(p => p.date)
    const latestDate = Math.max(...dates)
    const earliestDate = Math.min(...dates)

    items.push({
      type: 'series',
      name,
      posts: sorted,
      latestDate,
      earliestDate,
      date: latestDate // Position series at its most recent post's date
    })
  }

  // Sort all items by date (newest first)
  items.sort((a, b) => b.date - a.date)

  return items
}
