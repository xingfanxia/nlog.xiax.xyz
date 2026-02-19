import { clientConfig } from '@/lib/server/config'

import Container from '@/components/Container'
import BlogPost from '@/components/BlogPost'
import SeriesCard from '@/components/SeriesCard'
import Pagination from '@/components/Pagination'
import { getAllPosts } from '@/lib/notion'
import { groupPostsWithSeries } from '@/lib/groupPostsWithSeries'
import { useConfig } from '@/lib/config'

export async function getStaticProps () {
  const posts = await getAllPosts({ includePages: false })
  const allItems = groupPostsWithSeries(posts)
  const itemsToShow = allItems.slice(0, clientConfig.postsPerPage)
  const totalItems = allItems.length
  const showNext = totalItems > clientConfig.postsPerPage
  return {
    props: {
      page: 1,
      itemsToShow,
      showNext
    },
    revalidate: 1
  }
}

export default function Blog ({ itemsToShow, page, showNext }) {
  const { title, description } = useConfig()

  return (
    <Container title={title} description={description}>
      {itemsToShow.map(item =>
        item.type === 'series'
          ? (
            <SeriesCard
              key={`series-${item.name}`}
              name={item.name}
              posts={item.posts}
              latestDate={item.latestDate}
              earliestDate={item.earliestDate}
              zhSeriesName={item.zhSeriesName}
            />
            )
          : (
            <BlogPost key={item.post.id} post={item.post} />
            )
      )}
      {showNext && <Pagination page={page} showNext={showNext} />}
    </Container>
  )
}
