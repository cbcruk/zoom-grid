import type { ZoomGridListRef } from '../../ZoomGridList/types'

/**
 * Configuration for a zoom layer at a specific column count
 */
export interface LayerConfig {
  /** Number of empty padding items added to align the target item */
  padding: number
  /** Scroll offset position in pixels */
  scrollOffset: number
  /** Index of the target item (including padding) */
  targetIndex: number
}

/**
 * Complete zoom state returned by useZoomState hook
 * Contains all state values, setters, refs, and utilities for zoom management
 */
export interface ZoomState {
  /** Current number of columns being displayed */
  activeColumns: number
  /** Setter for activeColumns */
  setActiveColumns: React.Dispatch<React.SetStateAction<number>>
  /** Whether a pinch gesture is currently active */
  isPinching: boolean
  /** Setter for isPinching */
  setIsPinching: React.Dispatch<React.SetStateAction<boolean>>
  /** Whether a zoom animation is in progress */
  isAnimating: boolean
  /** Setter for isAnimating */
  setIsAnimating: React.Dispatch<React.SetStateAction<boolean>>
  /** Layer configurations indexed by column count */
  layerConfig: Record<number, LayerConfig>
  /** Setter for layerConfig */
  setLayerConfig: React.Dispatch<
    React.SetStateAction<Record<number, LayerConfig>>
  >
  /** Current scale factor (1 = no zoom, >1 = zoomed in, <1 = zoomed out) */
  scale: React.MutableRefObject<number>
  /** Scale value saved at the start of a gesture */
  savedScale: React.MutableRefObject<number>
  /** X coordinate of the zoom focal point */
  focalX: React.MutableRefObject<number>
  /** Y coordinate of the zoom focal point */
  focalY: React.MutableRefObject<number>
  /** Current scroll offset of the active layer */
  activeScrollOffset: React.MutableRefObject<number>
  /** Shared ref for active columns (used in animation calculations) */
  activeColsShared: React.MutableRefObject<number>
  /** Ref version of isPinching for use in callbacks */
  isPinchingRef: React.MutableRefObject<boolean>
  /** Ref version of layerConfig for use in callbacks */
  layerConfigRef: React.MutableRefObject<Record<number, LayerConfig>>
  /** References to ZoomGridList instances for each column count */
  listRefs: React.MutableRefObject<Record<number, ZoomGridListRef>>
  /** Reference to cancelable animation */
  animationRef: React.MutableRefObject<{ cancel: () => void } | null>
  /** Reference to zoom debounce timeout */
  zoomTimeoutRef: React.MutableRefObject<ReturnType<typeof setTimeout> | null>
  /** Force a re-render (used for ref-based animations) */
  triggerRender: () => void
}

/**
 * Zoom alignment utilities returned by useZoomAlignment hook
 */
export interface ZoomAlignment {
  /**
   * Calculate layer configuration for a target zoom level
   * @param dataIndex - Index of the target item in the data array
   * @param currentCols - Current number of columns
   * @param targetCols - Target number of columns
   * @param fX - Focal point X coordinate
   * @param fY - Focal point Y coordinate
   * @returns Layer configuration for the target zoom level
   */
  calculateLayerConfig: (
    dataIndex: number,
    currentCols: number,
    targetCols: number,
    fX: number,
    fY: number
  ) => LayerConfig
  /**
   * Complete the zoom transition to a new column count
   * @param nextCols - Target number of columns
   */
  handleZoomFinish: (nextCols: number) => void
  /**
   * Prepare all layers for an upcoming zoom gesture
   * @param fX - Focal point X coordinate
   * @param fY - Focal point Y coordinate
   */
  prepareZoom: (fX: number, fY: number) => void
}
