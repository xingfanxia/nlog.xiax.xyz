import { useRouter } from 'next/router'
import Container from '@/components/Container'
import BlogPost from '@/components/BlogPost'
import FormattedDate from '@/components/FormattedDate'
import { getAllPosts, getAllSeriesFromPosts } from '@/lib/notion'

export default function SeriesPage ({ seriesName, posts }) {
  const router = useRouter()

  if (router.isFallback) return null

  if (!posts || posts.length === 0) {
    return (
      <Container title={seriesName}>
        <p className="text-gray-500 dark:text-gray-400">No posts found in this series.</p>
      </Container>
    )
  }

  const dates = posts.map(p => p.date)
  const earliestDate = Math.min(...dates)
  const latestDate = Math.max(...dates)

  return (
    <Container title={seriesName}>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-black dark:text-white mb-2">
          {seriesName}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {posts.length} parts · <FormattedDate date={earliestDate} /> – <FormattedDate date={latestDate} />
        </p>
      </div>

      {posts.map(post => (
        <BlogPost key={post.id} post={post} />
      ))}
    </Container>
  )
}

export async function getStaticProps ({ params }) {
  const seriesName = decodeURIComponent(params.series)
  const posts = await getAllPosts({ includePages: false })
  const allSeries = getAllSeriesFromPosts(posts)

  const seriesData = allSeries[seriesName]

  if (!seriesData) {
    return { notFound: true }
  }

  return {
    props: {
      seriesName,
      posts: seriesData.posts
    },
    revalidate: 1
  }
}

export async function getStaticPaths () {
  const posts = await getAllPosts({ includePages: false })
  const allSeries = getAllSeriesFromPosts(posts)

  return {
    paths: Object.keys(allSeries).map(name => ({
      params: { series: encodeURIComponent(name) }
    })),
    fallback: true
  }
}
