import FormattedDate from '@/components/FormattedDate'
import { useConfig } from '@/lib/config'
import Link from 'next/link'

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
            <Link
              href={`/series/${encodeURIComponent(zhSeriesName)}`}
              className="text-xs px-2 py-0.5 rounded-full border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors flex-shrink-0"
              onClick={e => e.stopPropagation()}
            >
              中文
            </Link>
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
          <Link
            key={post.id}
            href={`${BLOG.path}/${post.slug}`}
            className="flex items-baseline justify-between gap-2 py-1 hover:text-black dark:hover:text-gray-100 text-gray-700 dark:text-gray-300 transition-colors"
          >
            <span className="min-w-0">
              <span className="text-xs text-gray-400 dark:text-gray-500 mr-2">
                Part {post.part ?? i + 1}
              </span>
              <span className="text-sm">{post.title}</span>
            </span>
            <time className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
              <FormattedDate date={post.date} />
            </time>
          </Link>
        ))}
      </div>
    </details>
  )
}

export default SeriesCard
