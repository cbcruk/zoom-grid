import type React from 'react'

/**
 * Props for rendering individual items in ZoomGridList
 * @template T - Type of data item
 */
export interface ZoomGridListRenderItemProps<T> {
  /** The data item to render */
  item: T
  /** Index of the item in the data array */
  index: number
  /** Calculated size (width/height) of the item in pixels */
  size: number
  /** Whether this item is the current zoom target */
  isTarget: boolean
}

/**
 * Props for the ZoomGridList component
 * @template T - Type of data items in the list
 */
export interface ZoomGridListProps<T> {
  /** Array of data items to display */
  data: T[]
  /** Number of columns in the grid */
  numColumns: number
  /** Index of the target item for zoom alignment */
  targetIndex: number
  /** Width of the container in pixels */
  width: number
  /** Height of the container in pixels */
  height: number
  /**
   * Gap between grid items in pixels
   * @default 2
   */
  gap?: number
  /**
   * Whether the list responds to user interactions (scroll, touch)
   * @default true
   */
  isInteractive?: boolean
  /** Callback fired when the list is scrolled */
  onScroll?: (scrollTop: number) => void
  /** Function to render each grid item */
  renderItem: (props: ZoomGridListRenderItemProps<T>) => React.ReactNode
  /** Style for the content container */
  contentContainerStyle?: {
    /** Top padding in pixels */
    paddingTop?: number
    /** Bottom padding in pixels */
    paddingBottom?: number
  }
}

/**
 * Ref interface for ZoomGridList
 * Provides imperative methods to control the list
 */
export interface ZoomGridListRef {
  /**
   * Scroll to a specific offset position
   * @param offset - Scroll offset in pixels
   */
  scrollTo: (offset: number) => void
}
