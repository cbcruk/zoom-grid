import type React from 'react'

/**
 * Props for rendering individual grid items
 * @template T - Type of data item
 */
export interface RenderItemProps<T> {
  /** The data item to render */
  item: T
  /** Index of the item in the data array */
  index: number
  /** Calculated size (width/height) of the item in pixels */
  size: number
  /** Whether this item is the current zoom target */
  isTarget: boolean
  /** Ref indicating whether a pinch gesture is in progress */
  isPinching: React.MutableRefObject<boolean>
}

/**
 * Props for the ZoomGrid component
 * @template T - Type of data items in the grid
 */
export interface ZoomGridProps<T> {
  /** Array of data items to display in the grid */
  data: T[]
  /**
   * Available zoom levels as column counts
   * @default [5, 3, 1]
   * @example [7, 5, 3, 1] - 4 zoom levels from 7 columns to 1 column
   */
  zoomLevels?: number[]
  /**
   * Initial number of columns to display
   * @default 3
   */
  initialNumColumns?: number
  /** Function to render each grid item */
  renderItem: (props: RenderItemProps<T>) => React.ReactNode
  /** Callback fired when zoom level changes */
  onZoomChange?: (columns: number) => void
  /** Custom styles for the container */
  style?: React.CSSProperties
  /**
   * Gap between grid items in pixels
   * @default 2
   */
  gap?: number
  /** Content insets for top and bottom padding */
  contentInsets?: {
    /** Top padding in pixels */
    top?: number
    /** Bottom padding in pixels */
    bottom?: number
  }
}
