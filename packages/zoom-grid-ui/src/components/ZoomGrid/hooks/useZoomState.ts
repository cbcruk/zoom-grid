import { useState, useRef, useLayoutEffect, useCallback } from 'react'
import type { LayerConfig, ZoomState } from './types'
import type { ZoomGridListRef } from '../../ZoomGridList/types'

/**
 * Hook that manages all zoom-related state for ZoomGrid
 */
export function useZoomState(
  zoomLevels: number[],
  initialNumColumns: number
): ZoomState {
  const [activeColumns, setActiveColumns] = useState(initialNumColumns)
  const [isPinching, setIsPinching] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [layerConfig, setLayerConfig] = useState<Record<number, LayerConfig>>(
    () =>
      Object.fromEntries(
        zoomLevels.map((cols) => [
          cols,
          { padding: 0, scrollOffset: 0, targetIndex: 0 },
        ])
      )
  )

  const scale = useRef(1)
  const savedScale = useRef(1)
  const focalX = useRef(0)
  const focalY = useRef(0)
  const activeScrollOffset = useRef(0)
  const activeColsShared = useRef(activeColumns)
  const isPinchingRef = useRef(isPinching)
  const layerConfigRef = useRef(layerConfig)
  const listRefs = useRef<Record<number, ZoomGridListRef>>({})
  const animationRef = useRef<{ cancel: () => void } | null>(null)
  const zoomTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [, forceRender] = useState(0)
  const triggerRender = useCallback(() => forceRender((v) => v + 1), [])

  useLayoutEffect(() => {
    isPinchingRef.current = isPinching
  }, [isPinching])

  useLayoutEffect(() => {
    layerConfigRef.current = layerConfig
  }, [layerConfig])

  useLayoutEffect(() => {
    activeColsShared.current = activeColumns
  }, [activeColumns])

  return {
    activeColumns,
    setActiveColumns,
    isPinching,
    setIsPinching,
    isAnimating,
    setIsAnimating,
    layerConfig,
    setLayerConfig,
    scale,
    savedScale,
    focalX,
    focalY,
    activeScrollOffset,
    activeColsShared,
    isPinchingRef,
    layerConfigRef,
    listRefs,
    animationRef,
    zoomTimeoutRef,
    triggerRender,
  }
}
