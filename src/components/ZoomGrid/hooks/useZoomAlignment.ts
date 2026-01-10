import { useCallback } from 'react'
import type { ZoomState, LayerConfig, ZoomAlignment } from './types'

/**
 * Props for the useZoomAlignment hook
 */
interface UseZoomAlignmentProps {
  /** Complete zoom state from useZoomState hook */
  zoomState: ZoomState
  /** Container width in pixels */
  width: number
  /** Container height in pixels */
  height: number
  /** Top content inset in pixels */
  topInset: number
  /** Bottom content inset in pixels */
  bottomInset: number
  /** Total number of data items */
  dataLength: number
  /** Available zoom levels (column counts) */
  zoomLevels: number[]
  /** Callback fired when zoom level changes */
  onZoomChange?: (columns: number) => void
}

/**
 * Hook that provides zoom alignment utilities for layer positioning
 */
export function useZoomAlignment({
  zoomState,
  width,
  height,
  topInset,
  bottomInset,
  dataLength,
  zoomLevels,
  onZoomChange,
}: UseZoomAlignmentProps): ZoomAlignment {
  const {
    activeColumns,
    setActiveColumns,
    layerConfig,
    setLayerConfig,
    scale,
    savedScale,
    activeScrollOffset,
    activeColsShared,
    layerConfigRef,
    listRefs,
    triggerRender,
  } = zoomState

  const calculateLayerConfig = useCallback(
    (
      dataIndex: number,
      _currentCols: number,
      targetCols: number,
      fX: number,
      fY: number
    ): LayerConfig => {
      if (width === 0) return { padding: 0, scrollOffset: 0, targetIndex: 0 }

      const targetSize = width / targetCols
      const headerHeight = topInset

      // @fn calculatePadding - align item horizontally with focal point
      const idealCol = Math.floor(fX / targetSize)
      const clampedCol = Math.max(0, Math.min(idealCol, targetCols - 1))
      const currentMod = dataIndex % targetCols
      const padding = (clampedCol - currentMod + targetCols) % targetCols

      // @fn calculateScrollOffset - align item vertically with focal point
      const paddedIndex = dataIndex + padding
      const targetRow = Math.floor(paddedIndex / targetCols)
      const targetItemCenterY =
        targetRow * targetSize + targetSize / 2 + headerHeight
      const targetScroll = targetItemCenterY - fY

      // @fn clampScroll - prevent overscroll
      const totalItems = dataLength + padding
      const totalRows = Math.ceil(totalItems / targetCols)
      const contentHeight = totalRows * targetSize + headerHeight + bottomInset
      const maxScroll = Math.max(0, contentHeight - height)
      const clampedTargetScroll = Math.max(0, Math.min(targetScroll, maxScroll))

      return {
        padding,
        scrollOffset: clampedTargetScroll,
        targetIndex: paddedIndex,
      }
    },
    [width, height, topInset, bottomInset, dataLength]
  )

  const handleZoomFinish = useCallback(
    (nextCols: number) => {
      const config = layerConfigRef.current

      if (config[nextCols]) {
        activeScrollOffset.current = config[nextCols].scrollOffset
      }

      activeColsShared.current = nextCols
      savedScale.current = 1
      scale.current = 1

      setActiveColumns(nextCols)
      onZoomChange?.(nextCols)
      triggerRender()
    },
    [
      activeScrollOffset,
      activeColsShared,
      savedScale,
      scale,
      layerConfigRef,
      setActiveColumns,
      onZoomChange,
      triggerRender,
    ]
  )

  const prepareZoom = useCallback(
    (fX: number, fY: number) => {
      if (width === 0) return

      // @fn findTargetItem - resolve focal point to data index
      const currentCols = activeColumns
      const currentScroll = activeScrollOffset.current
      const currentSize = width / currentCols
      const headerHeight = topInset
      const currentPadding = layerConfig[currentCols]?.padding || 0

      const scrollAdjustedY = fY + currentScroll
      const gridY = scrollAdjustedY - headerHeight
      const row = Math.floor(gridY / currentSize)
      const col = Math.floor(fX / currentSize)
      const visualIndex = row * currentCols + col
      const dataIndex = visualIndex - currentPadding

      if (dataIndex < 0 || dataIndex >= dataLength) return

      const newConfig = Object.fromEntries(
        zoomLevels.map((cols) => [
          cols,
          calculateLayerConfig(dataIndex, currentCols, cols, fX, fY),
        ])
      )

      layerConfigRef.current = { ...layerConfigRef.current, ...newConfig }
      setLayerConfig((prev) => ({ ...prev, ...newConfig }))

      setTimeout(() => {
        zoomLevels.forEach((cols) => {
          if (cols !== currentCols && listRefs.current[cols]) {
            listRefs.current[cols].scrollTo(newConfig[cols].scrollOffset)
          } else if (cols === currentCols && listRefs.current[cols]) {
            listRefs.current[cols].scrollTo(currentScroll)
          }
        })
      }, 0)
    },
    [
      activeColumns,
      activeScrollOffset,
      width,
      topInset,
      dataLength,
      zoomLevels,
      layerConfig,
      layerConfigRef,
      listRefs,
      setLayerConfig,
      calculateLayerConfig,
    ]
  )

  return {
    calculateLayerConfig,
    handleZoomFinish,
    prepareZoom,
  }
}
