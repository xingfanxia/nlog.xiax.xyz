import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import { useConfig } from '@/lib/config'

dayjs.extend(localizedFormat)

export default function FormattedDate ({ date }) {
  const lang = useConfig()?.lang?.slice(0, 2) || 'en'

  // Use static import for English locale (default)
  // dayjs defaults to English, no need to dynamically load
  return <span>{dayjs(date).format('ll')}</span>
}
