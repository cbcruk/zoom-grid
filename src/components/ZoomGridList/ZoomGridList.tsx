import React, { forwardRef, useImperativeHandle } from 'react'
import styles from './ZoomGridList.module.css'
import type { ZoomGridListProps, ZoomGridListRef } from './types'
import { useGridVirtualizer } from './hooks'

/**
 * Virtualized grid list component with configurable columns
 */
function ZoomGridListInner<T>(
  {
    data,
    numColumns,
    targetIndex,
    width,
    height,
    gap = 2,
    isInteractive = true,
    onScroll,
    renderItem,
    contentContainerStyle,
  }: ZoomGridListProps<T>,
  ref: React.ForwardedRef<ZoomGridListRef>
) {
  const {
    parentRef,
    itemSize,
    virtualItems,
    totalSize,
    scrollTo,
    handleScroll,
  } = useGridVirtualizer({
    dataLength: data.length,
    numColumns,
    width,
    onScroll,
  })

  useImperativeHandle(ref, () => ({ scrollTo }), [scrollTo])

  const paddingTop = contentContainerStyle?.paddingTop ?? 0
  const paddingBottom = contentContainerStyle?.paddingBottom ?? 0

  return (
    <div
      ref={parentRef}
      className={styles.container}
      data-is-interactive={isInteractive}
      style={{ height }}
      onScroll={handleScroll}
    >
      <div
        className={styles.content}
        style={{ height: totalSize + paddingTop + paddingBottom }}
      >
        {virtualItems.map((virtualRow) => {
          const rowIndex = virtualRow.index
          const startIndex = rowIndex * numColumns
          const rowItems = data.slice(startIndex, startIndex + numColumns)

          return (
            <div
              key={virtualRow.key}
              className={styles.row}
              style={{
                height: itemSize,
                transform: `translateY(${virtualRow.start + paddingTop}px)`,
                gap,
              }}
            >
              {rowItems.map((item, colIndex) => {
                const index = startIndex + colIndex
                const isTarget = index === targetIndex

                const cellSize = itemSize - gap

                return (
                  <div
                    key={index}
                    className={styles.cell}
                    style={{ width: cellSize, height: cellSize }}
                  >
                    {renderItem({
                      item,
                      index,
                      size: cellSize,
                      isTarget,
                    })}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export const ZoomGridList = forwardRef(ZoomGridListInner) as <T>(
  props: ZoomGridListProps<T> & { ref?: React.ForwardedRef<ZoomGridListRef> }
) => React.ReactElement
