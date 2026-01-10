import { useGesture } from '@use-gesture/react'
import type { ZoomState, ZoomAlignment } from './types'

interface UseZoomGesturesProps {
  containerRef: React.RefObject<HTMLDivElement | null>
  zoomState: ZoomState
  alignment: ZoomAlignment
  zoomLevels: number[]
}

/**
 * Hook that binds pinch and wheel gestures for zoom control
 */
export function useZoomGestures({
  containerRef,
  zoomState,
  alignment,
  zoomLevels,
}: UseZoomGesturesProps) {
  const {
    activeColumns,
    isPinching,
    setIsPinching,
    setIsAnimating,
    scale,
    savedScale,
    focalX,
    focalY,
    animationRef,
    zoomTimeoutRef,
    triggerRender,
  } = zoomState

  const { handleZoomFinish, prepareZoom } = alignment

  const determineNextColumns = (
    currentScale: number,
    zoomInThreshold: number,
    zoomOutThreshold: number
  ): number => {
    const currentIndex = zoomLevels.indexOf(activeColumns)

    if (currentIndex === -1) return activeColumns

    const isDescending = zoomLevels[0] > zoomLevels[zoomLevels.length - 1]

    if (currentScale > zoomInThreshold) {
      if (isDescending) {
        if (currentIndex < zoomLevels.length - 1)
          return zoomLevels[currentIndex + 1]
      } else {
        if (currentIndex > 0) return zoomLevels[currentIndex - 1]
      }
    } else if (currentScale < zoomOutThreshold) {
      if (isDescending) {
        if (currentIndex > 0) return zoomLevels[currentIndex - 1]
      } else {
        if (currentIndex < zoomLevels.length - 1)
          return zoomLevels[currentIndex + 1]
      }
    }

    return activeColumns
  }

  const animateToTarget = (nextCols: number) => {
    const targetScale =
      nextCols !== activeColumns ? activeColumns / nextCols : 1

    if (animationRef.current) {
      animationRef.current.cancel()
    }

    setIsAnimating(true)
    scale.current = targetScale
    triggerRender()

    setTimeout(() => {
      if (nextCols !== activeColumns) {
        handleZoomFinish(nextCols)
        setTimeout(() => {
          setIsAnimating(false)
          setIsPinching(false)
        }, 280)
      } else {
        setIsAnimating(false)
        setIsPinching(false)
      }
    }, 260)
  }

  useGesture(
    {
      onPinchStart: ({ origin: [ox, oy] }) => {
        if (!containerRef.current) return

        // @fn getLocalCoordinates - convert screen coords to container-relative
        const rect = containerRef.current.getBoundingClientRect()
        const localX = ox - rect.left
        const localY = oy - rect.top

        setIsPinching(true)
        savedScale.current = scale.current
        focalX.current = localX
        focalY.current = localY
        prepareZoom(localX, localY)
      },
      onPinch: ({ movement: [ms] }) => {
        scale.current = savedScale.current * ms
        triggerRender()
      },
      onPinchEnd: () => {
        const nextCols = determineNextColumns(scale.current, 1.5, 0.6)
        animateToTarget(nextCols)
      },
      onWheel: ({ event, delta: [, dy], ctrlKey, metaKey }) => {
        if (!ctrlKey && !metaKey) return
        event.preventDefault()

        if (!containerRef.current) return
        const rect = containerRef.current.getBoundingClientRect()
        const localX = (event as WheelEvent).clientX - rect.left
        const localY = (event as WheelEvent).clientY - rect.top

        if (!isPinching) {
          setIsPinching(true)
          savedScale.current = scale.current
          focalX.current = localX
          focalY.current = localY
          prepareZoom(localX, localY)
        }

        const newScale = Math.max(
          0.5,
          Math.min(2.5, scale.current - dy * 0.005)
        )
        scale.current = newScale
        triggerRender()

        if (zoomTimeoutRef.current) {
          clearTimeout(zoomTimeoutRef.current)
        }
        zoomTimeoutRef.current = setTimeout(() => {
          const nextCols = determineNextColumns(scale.current, 1.3, 0.7)
          animateToTarget(nextCols)
        }, 150)
      },
    },
    {
      target: containerRef,
      eventOptions: { passive: false },
    }
  )
}
