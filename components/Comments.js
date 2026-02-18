import { useConfig } from '@/lib/config'
import dynamic from 'next/dynamic'
import cn from 'classnames'

const UtterancesComponent = dynamic(
  () => {
    return import('@/components/Utterances')
  },
  { ssr: false }
)

const Comments = ({ frontMatter }) => {
  const BLOG = useConfig()

  const fullWidth = frontMatter.fullWidth ?? false

  return (
    <div
      className={cn(
        'px-4 font-medium text-gray-500 dark:text-gray-400 my-5',
        fullWidth ? 'md:px-24' : 'mx-auto max-w-2xl',
      )}
    >
      {BLOG.comment && BLOG.comment.provider === 'utterances' && (
        <UtterancesComponent issueTerm={frontMatter.id} />
      )}
    </div>
  )
}

export default Comments
