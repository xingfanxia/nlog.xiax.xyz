/**
 * Groups posts by their series name and sorts by part number.
 *
 * @param {Array} posts - All posts from getAllPosts
 * @returns {Object} Map of series name to { posts: [...], count: N }
 */
export function getAllSeriesFromPosts (posts) {
  const seriesMap = {}

  for (const post of posts) {
    if (!post?.series) continue

    if (!seriesMap[post.series]) {
      seriesMap[post.series] = { posts: [], count: 0 }
    }

    seriesMap[post.series].posts.push(post)
    seriesMap[post.series].count++
  }

  // Sort posts within each series by part number
  for (const name of Object.keys(seriesMap)) {
    seriesMap[name].posts.sort((a, b) => (a.part ?? 0) - (b.part ?? 0))
  }

  return seriesMap
}
