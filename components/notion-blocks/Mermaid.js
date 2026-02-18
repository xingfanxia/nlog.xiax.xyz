import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'
import useTheme from '@/lib/theme'
import { getTextContent } from 'notion-utils'

export default function Mermaid ({ block }) {
  const { dark } = useTheme()

  useEffect(() => {
    mermaid.initialize({ theme: dark ? 'dark' : 'neutral', startOnLoad: false })
  }, [dark])

  const source = block?.properties?.title ? getTextContent(block.properties.title) : ''
  const container = useRef(null)
  const [svg, setSVG] = useState('')

  useEffect(() => {
    if (!source) return
    const id = `mermaid-${block.id.replace(/-/g, '')}`
    mermaid.render(id, source)
      .then(({ svg }) => setSVG(svg))
      .catch(err => console.error('Mermaid render error:', err))
  }, [block?.id, source])

  // Note: dangerouslySetInnerHTML is safe here as source is mermaid-generated SVG,
  // not user-controlled HTML from external input
  return (
    <div
      ref={container}
      className="w-full leading-normal flex justify-center"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
