import Link from 'next/link'
import { useConfig } from '@/lib/config'

/**
 * Language toggle for posts that have EN/ZH counterparts.
 * Convention: ZH slugs end with '-zh', EN slugs are the base.
 *
 * @param {object} props
 * @param {string} props.currentSlug - Current post's slug
 * @param {string} props.otherSlug - The counterpart slug
 * @param {boolean} props.isZh - Whether the current post is the ZH version
 */
export default function LanguageToggle ({ currentSlug, otherSlug, isZh }) {
  const BLOG = useConfig()

  return (
    <div className="flex items-center gap-1 text-sm">
      {isZh
        ? (
          <>
            <Link
              href={`${BLOG.path}/${otherSlug}`}
              className="px-2 py-0.5 rounded text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-gray-100 transition-colors"
            >
              EN
            </Link>
            <span className="px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white font-medium">
              ZH
            </span>
          </>
          )
        : (
          <>
            <span className="px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white font-medium">
              EN
            </span>
            <Link
              href={`${BLOG.path}/${otherSlug}`}
              className="px-2 py-0.5 rounded text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-gray-100 transition-colors"
            >
              ZH
            </Link>
          </>
          )}
    </div>
  )
}
