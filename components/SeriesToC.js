import Link from 'next/link'

/**
 * Series Table of Contents sidebar — lists all parts in the series with the
 * current part highlighted in bold.
 *
 * @param {object} props
 * @param {string} props.seriesName - Name of the series
 * @param {Array<{slug: string, title: string, part: number}>} props.allPosts - All posts in the series
 * @param {number} props.currentPart - Current post's part number
 */
export default function SeriesToC ({ seriesName, allPosts, currentPart }) {
  if (!allPosts || allPosts.length === 0) return null

  return (
    <aside className="sticky pt-3 pl-4 text-sm text-zinc-700/70 dark:text-neutral-400" style={{ top: '65px' }}>
      <Link
        href={`/series/${encodeURIComponent(seriesName)}`}
        className="block font-semibold text-black dark:text-white hover:underline"
      >
        {seriesName}
      </Link>
      <hr className="my-2 border-gray-200 dark:border-gray-700" />
      <ol className="list-none space-y-1">
        {allPosts.map(p => {
          const isCurrent = p.part === currentPart
          return (
            <li key={p.slug}>
              {isCurrent
                ? (
                  <span className="block py-0.5 font-bold text-black dark:text-white">
                    {p.part}. {p.title}
                  </span>
                  )
                : (
                  <Link
                    href={`/${p.slug}`}
                    className="block py-0.5 hover:text-black dark:hover:text-white transition duration-100"
                  >
                    {p.part}. {p.title}
                  </Link>
                  )}
            </li>
          )
        })}
      </ol>
    </aside>
  )
}
