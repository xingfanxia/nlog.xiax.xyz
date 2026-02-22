import { clientConfig } from '@/lib/server/config'

import { useRouter } from 'next/router'
import cn from 'classnames'
import { getAllPosts, getPostBlocks, getAllSeriesFromPosts } from '@/lib/notion'
import { useLocale } from '@/lib/locale'
import { useConfig } from '@/lib/config'
import { createHash } from 'crypto'
import Container from '@/components/Container'
import Post from '@/components/Post'
import SeriesNav from '@/components/SeriesNav'
import LanguageToggle from '@/components/LanguageToggle'
import Comments from '@/components/Comments'

export default function BlogPost ({ post, blockMap, emailHash, seriesNav, langToggle }) {
  const router = useRouter()
  const BLOG = useConfig()
  const locale = useLocale()

  // TODO: It would be better to render something
  if (router.isFallback) return null

  const fullWidth = post.fullWidth ?? false

  return (
    <Container
      layout="blog"
      title={post.title}
      description={post.summary}
      slug={post.slug}
      // date={new Date(post.publishedAt).toISOString()}
      type="article"
      fullWidth={fullWidth}
    >
      {langToggle && (
        <div className={cn(
          'px-4 mb-4 flex justify-end',
          fullWidth ? 'md:px-24' : 'mx-auto max-w-2xl w-full'
        )}>
          <LanguageToggle
            currentSlug={langToggle.currentSlug}
            otherSlug={langToggle.otherSlug}
            isZh={langToggle.isZh}
          />
        </div>
      )}

      <Post
        post={post}
        blockMap={blockMap}
        emailHash={emailHash}
        fullWidth={fullWidth}
        seriesNav={seriesNav}
      />

      {/* Series navigation */}
      {seriesNav && (
        <div className={cn(
          'px-4 my-4',
          fullWidth ? 'md:px-24' : 'mx-auto max-w-2xl'
        )}>
          <SeriesNav
            seriesName={seriesNav.seriesName}
            currentPart={seriesNav.currentPart}
            totalParts={seriesNav.totalParts}
            prevPost={seriesNav.prevPost}
            nextPost={seriesNav.nextPost}
          />
        </div>
      )}

      {/* Back and Top */}
      <div
        className={cn(
          'px-4 flex justify-between font-medium text-gray-500 dark:text-gray-400 my-5',
          fullWidth ? 'md:px-24' : 'mx-auto max-w-2xl'
        )}
      >
        <a>
          <button
            onClick={() => router.push(BLOG.path || '/')}
            className="mt-2 cursor-pointer hover:text-black dark:hover:text-gray-100"
          >
            ← {locale.POST.BACK}
          </button>
        </a>
        <a>
          <button
            onClick={() => window.scrollTo({
              top: 0,
              behavior: 'smooth'
            })}
            className="mt-2 cursor-pointer hover:text-black dark:hover:text-gray-100"
          >
            ↑ {locale.POST.TOP}
          </button>
        </a>
      </div>

      <Comments frontMatter={post} />
    </Container>
  )
}

export async function getStaticPaths () {
  const posts = await getAllPosts({ includePages: true })
  return {
    paths: posts.map(row => `${clientConfig.path}/${row.slug}`),
    fallback: true
  }
}

export async function getStaticProps ({ params: { slug } }) {
  const posts = await getAllPosts({ includePages: true })
  const post = posts.find(t => t.slug === slug)

  if (!post) return { notFound: true }

  const blockMap = await getPostBlocks(post.id)
  const emailHash = createHash('md5')
    .update(clientConfig.email)
    .digest('hex')
    .trim()
    .toLowerCase()

  // Build series navigation context if this post belongs to a series
  let seriesNav = null
  if (post.series) {
    const allSeries = getAllSeriesFromPosts(posts)
    const seriesData = allSeries[post.series]
    if (seriesData && seriesData.count > 1) {
      const seriesPosts = seriesData.posts
      const currentIndex = seriesPosts.findIndex(p => p.slug === slug)
      const prevPost = currentIndex > 0
        ? { slug: seriesPosts[currentIndex - 1].slug, title: seriesPosts[currentIndex - 1].title }
        : null
      const nextPost = currentIndex < seriesPosts.length - 1
        ? { slug: seriesPosts[currentIndex + 1].slug, title: seriesPosts[currentIndex + 1].title }
        : null

      seriesNav = {
        seriesName: post.series,
        currentPart: post.part ?? currentIndex + 1,
        totalParts: seriesData.count,
        prevPost,
        nextPost,
        allPosts: seriesPosts.map((p, i) => ({
          slug: p.slug, title: p.title, part: p.part ?? i + 1
        }))
      }
    }
  }

  // Detect language pair by slug convention: 'foo-zh' <-> 'foo'
  let langToggle = null
  const isZh = slug.endsWith('-zh')
  const otherSlug = isZh ? slug.slice(0, -3) : `${slug}-zh`
  const otherPost = posts.find(p => p.slug === otherSlug)
  if (otherPost) {
    langToggle = { currentSlug: slug, otherSlug, isZh }
  }

  return {
    props: { post, blockMap, emailHash, seriesNav, langToggle },
    revalidate: 1
  }
}
