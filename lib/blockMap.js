import { createContext, useContext } from 'react'

const BlockMapContext = createContext({})
export function BlockMapProvider ({ blockMap, children }) {
  let pageId = null

  // Try collection-based lookup first
  if (blockMap.collection) {
    const collectionId = Object.keys(blockMap.collection)[0]
    if (collectionId) {
      const found = Object.values(blockMap.block).find(
        block => block.value?.type === 'page' && block.value?.parent_id === collectionId
      )
      pageId = found?.value?.id
    }
  }

  // Fallback: find first page block
  if (!pageId) {
    const found = Object.values(blockMap.block).find(
      block => block.value?.type === 'page'
    )
    pageId = found?.value?.id
  }

  const blockMapAltered = {
    ...blockMap,
    pageId,
  }

  return (
    <BlockMapContext.Provider value={blockMapAltered}>
      {children}
    </BlockMapContext.Provider>
  )
}

export default function useBlockMap () {
  return useContext(BlockMapContext)
}
