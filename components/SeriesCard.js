import FormattedDate from '@/components/FormattedDate'
import { useConfig } from '@/lib/config'
import Link from 'next/link'

const ZhBadge = ({ href, onClick }) => (
  <Link
    href={href}
    className="text-xs px-1.5 py-0.5 rounded-full border border-rose-300/60 dark:border-rose-700/50 text-rose-400 dark:text-rose-400/80 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors flex-shrink-0"
    onClick={onClick}
  >
    中文
  </Link>
)

const SeriesCard = ({ name, posts, latestDate, earliestDate, zhSeriesName }) => {
  const BLOG = useConfig()

  return (
    <details className="mb-6 md:mb-8 group">
      <summary className="cursor-pointer list-none flex items-baseline justify-between gap-2">
        <div className="flex items-baseline gap-2 min-w-0">
          <span className="inline-block transition-transform group-open:rotate-90 text-gray-400 flex-shrink-0">
            ▶
          </span>
          <Link
            href={`/series/${encodeURIComponent(name)}`}
            className="text-lg md:text-xl font-medium text-black dark:text-gray-100 hover:underline truncate"
            onClick={e => e.stopPropagation()}
          >
            {name}
          </Link>
          {zhSeriesName && (
            <ZhBadge
              href={`/series/${encodeURIComponent(zhSeriesName)}`}
              onClick={e => e.stopPropagation()}
            />
          )}
          <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
            {posts.length} parts
          </span>
        </div>
        <span className="text-sm text-gray-600 dark:text-gray-400 flex-shrink-0 whitespace-nowrap">
          <FormattedDate date={earliestDate} /> – <FormattedDate date={latestDate} />
        </span>
      </summary>

      <div className="ml-2 mt-3 pl-4 border-l-2 border-gray-200 dark:border-gray-700 space-y-2">
        {posts.map((post, i) => (
          <div key={post.id} className="flex items-baseline justify-between gap-2 py-1">
            <Link
              href={`${BLOG.path}/${post.slug}`}
              className="min-w-0 hover:text-black dark:hover:text-gray-100 text-gray-700 dark:text-gray-300 transition-colors"
            >
              <span className="text-xs text-gray-400 dark:text-gray-500 mr-2">
                Part {post.part ?? i + 1}
              </span>
              <span className="text-sm">{post.title}</span>
            </Link>
            <span className="flex items-center gap-2 flex-shrink-0">
              {post.hasZh && (
                <ZhBadge href={`${BLOG.path}/${post.zhSlug}`} />
              )}
              <time className="text-xs text-gray-500 dark:text-gray-400">
                <FormattedDate date={post.date} />
              </time>
            </span>
          </div>
        ))}
      </div>
    </details>
  )
}

export default SeriesCard
