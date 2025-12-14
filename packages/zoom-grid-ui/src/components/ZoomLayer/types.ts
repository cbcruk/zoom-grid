import type React from 'react'
import type { ZoomGridListRef } from '../ZoomGridList/types'

/**
 * Configuration for layer positioning and alignment
 */
export interface LayerConfigItem {
  /** Number of empty padding items for alignment */
  padding: number
  /** Scroll offset position in pixels */
  scrollOffset: number
  /** Index of the target item (including padding) */
  targetIndex: number
}

/**
 * Props for rendering items in ZoomLayer
 * @template T - Type of data item
 */
export interface ZoomLayerRenderItemProps<T> {
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
 * Props for the ZoomLayer component
 * Represents a single zoom level layer in the ZoomGrid
 * @template T - Type of data items
 */
export interface ZoomLayerProps<T> {
  /** Number of columns for this layer */
  cols: number
  /** Array of data items to display */
  data: T[]
  /** Currently active column count */
  activeColumns: number
  /** Configuration for each zoom level layer */
  layerConfig: Record<number, LayerConfigItem>
  /** Current scale factor ref */
  scale: React.MutableRefObject<number>
  /** Active columns ref for animation calculations */
  activeColsShared: React.MutableRefObject<number>
  /** X coordinate of zoom focal point */
  focalX: React.MutableRefObject<number>
  /** Y coordinate of zoom focal point */
  focalY: React.MutableRefObject<number>
  /** Current scroll offset of the active layer */
  activeScrollOffsetRef: React.MutableRefObject<number>
  /** Width of the container in pixels */
  width: number
  /** Height of the container in pixels */
  height: number
  /** Top content inset in pixels */
  topInset: number
  /** Bottom content inset in pixels */
  bottomInset: number
  /** Gap between grid items in pixels */
  gap: number
  /** Whether a pinch gesture is currently active */
  isPinching: boolean
  /** Whether a zoom animation is in progress */
  isAnimating: boolean
  /** Ref version of isPinching for use in callbacks */
  isPinchingRef: React.MutableRefObject<boolean>
  /** References to ZoomGridList instances */
  listRefsRef: React.MutableRefObject<Record<number, ZoomGridListRef>>
  /** Function to render each grid item */
  renderItem: (props: ZoomLayerRenderItemProps<T>) => React.ReactNode
}
