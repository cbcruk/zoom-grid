import { useRef, useCallback } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'

interface UseGridVirtualizerProps {
  dataLength: number
  numColumns: number
  width: number
  onScroll?: (scrollTop: number) => void
}

/**
 * Hook that provides virtualization for grid layouts using TanStack Virtual
 */
export function useGridVirtualizer({
  dataLength,
  numColumns,
  width,
  onScroll,
}: UseGridVirtualizerProps) {
  const parentRef = useRef<HTMLDivElement>(null)
  const itemSize = width / numColumns
  const rowCount = Math.ceil(dataLength / numColumns)

  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => itemSize,
    overscan: 3,
  })

  const scrollTo = useCallback((offset: number) => {
    if (parentRef.current) {
      parentRef.current.scrollTop = offset
    }
  }, [])

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      if (onScroll) {
        onScroll((e.target as HTMLDivElement).scrollTop)
      }
    },
    [onScroll]
  )

  return {
    /** Ref to attach to the scrollable parent element */
    parentRef,
    /** Calculated size of each item in pixels */
    itemSize,
    /** Total number of rows in the grid */
    rowCount,
    /** TanStack Virtual virtualizer instance */
    virtualizer,
    /** Array of currently visible virtual items */
    virtualItems: virtualizer.getVirtualItems(),
    /** Total height of all content in pixels */
    totalSize: virtualizer.getTotalSize(),
    /** Function to programmatically scroll to a specific offset */
    scrollTo,
    /** Scroll event handler to attach to the scrollable element */
    handleScroll,
  }
}
