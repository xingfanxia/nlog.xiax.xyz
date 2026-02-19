import { config } from '@/lib/server/config'

import Container from '@/components/Container'
import BlogPost from '@/components/BlogPost'
import SeriesCard from '@/components/SeriesCard'
import Pagination from '@/components/Pagination'
import { getAllPosts } from '@/lib/notion'
import { groupPostsWithSeries } from '@/lib/groupPostsWithSeries'

const Page = ({ itemsToShow, page, showNext }) => {
  return (
    <Container>
      {itemsToShow &&
        itemsToShow.map(item =>
          item.type === 'series'
            ? (
              <SeriesCard
                key={`series-${item.name}`}
                name={item.name}
                posts={item.posts}
                latestDate={item.latestDate}
                earliestDate={item.earliestDate}
              />
              )
            : (
              <BlogPost key={item.post.id} post={item.post} />
              )
        )}
      <Pagination page={page} showNext={showNext} />
    </Container>
  )
}

export async function getStaticProps (context) {
  const { page } = context.params
  const posts = await getAllPosts({ includePages: false })
  const allItems = groupPostsWithSeries(posts)
  const itemsToShow = allItems.slice(
    config.postsPerPage * (page - 1),
    config.postsPerPage * page
  )
  const totalItems = allItems.length
  const showNext = page * config.postsPerPage < totalItems
  return {
    props: {
      page,
      itemsToShow,
      showNext
    },
    revalidate: 1
  }
}

export async function getStaticPaths () {
  const posts = await getAllPosts({ includePages: false })
  const allItems = groupPostsWithSeries(posts)
  const totalItems = allItems.length
  const totalPages = Math.ceil(totalItems / config.postsPerPage)
  return {
    paths: Array.from({ length: totalPages - 1 }, (_, i) => ({
      params: { page: '' + (i + 2) }
    })),
    fallback: true
  }
}

export default Page
