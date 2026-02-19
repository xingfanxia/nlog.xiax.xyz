import Link from 'next/link'
import { useConfig } from '@/lib/config'

/**
 * In-post series navigation — shows series name, part X of Y, and prev/next links.
 *
 * @param {object} props
 * @param {string} props.seriesName - Name of the series
 * @param {number} props.currentPart - Current post's part number
 * @param {number} props.totalParts - Total number of parts in the series
 * @param {object|null} props.prevPost - Previous post in series (or null)
 * @param {object|null} props.nextPost - Next post in series (or null)
 */
export default function SeriesNav ({ seriesName, currentPart, totalParts, prevPost, nextPost }) {
  const BLOG = useConfig()

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 mb-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <Link
            href={`/series/${encodeURIComponent(seriesName)}`}
            className="font-medium text-black dark:text-gray-100 hover:underline"
          >
            {seriesName}
          </Link>
          <span className="ml-2">
            Part {currentPart} of {totalParts}
          </span>
        </div>
        <div className="flex gap-3 text-sm">
          {prevPost
            ? (
              <Link
                href={`${BLOG.path}/${prevPost.slug}`}
                className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-gray-100 transition-colors"
              >
                ← Prev
              </Link>
              )
            : (
              <span className="text-gray-300 dark:text-gray-600">← Prev</span>
              )}
          {nextPost
            ? (
              <Link
                href={`${BLOG.path}/${nextPost.slug}`}
                className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-gray-100 transition-colors"
              >
                Next →
              </Link>
              )
            : (
              <span className="text-gray-300 dark:text-gray-600">Next →</span>
              )}
        </div>
      </div>
    </div>
  )
}
