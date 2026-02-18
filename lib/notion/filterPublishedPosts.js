export default function filterPublishedPosts ({ posts, includePages }) {
  if (!posts || !posts.length) return []
  return posts
    .filter(post =>
      includePages
        ? post?.type === 'Post' || post?.type === 'Page'
        : post?.type === 'Post'
    )
    .filter(post =>
      post.title &&
      post.slug &&
      post?.status === 'Published' &&
      post.date <= new Date()
    )
}
