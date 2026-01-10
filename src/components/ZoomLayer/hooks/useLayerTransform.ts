import { interpolate } from '../utils'

interface LayerConfig {
  padding: number
  scrollOffset: number
  targetIndex: number
}

interface UseLayerTransformProps {
  cols: number
  scale: React.MutableRefObject<number>
  activeColsShared: React.MutableRefObject<number>
  focalX: React.MutableRefObject<number>
  focalY: React.MutableRefObject<number>
  activeScrollOffsetRef: React.MutableRefObject<number>
  layerConfig: Record<number, LayerConfig>
  config: LayerConfig
  width: number
  height: number
  topInset: number
  isActive: boolean
}

/**
 * Hook that calculates CSS transform values for a zoom layer
 */
export function useLayerTransform({
  cols,
  scale,
  activeColsShared,
  focalX,
  focalY,
  activeScrollOffsetRef,
  layerConfig,
  config,
  width,
  height,
  topInset,
  isActive,
}: UseLayerTransformProps) {
  const s = scale.current
  const currentActiveCols = activeColsShared.current

  // @fn calculateLayerVisibility - determine opacity/zIndex based on zoom direction
  let opacity = 0
  let zIndex = 0

  if (cols === currentActiveCols) {
    zIndex = 10
    if (s < 1) {
      opacity = interpolate(s, [0.66, 1], [0, 1])
    } else {
      opacity = 1
    }
  } else {
    const isZoomInTarget = cols < currentActiveCols
    const isZoomOutTarget = cols > currentActiveCols

    if (isZoomInTarget) {
      if (s > 1) {
        zIndex = 20
        const ratio = currentActiveCols / cols
        opacity = interpolate(s, [1, ratio], [0, 1])
      }
    } else if (isZoomOutTarget) {
      if (s < 1) {
        zIndex = 5
        opacity = 1
      }
    }
  }

  const headerHeight = topInset
  const centerX = width / 2
  const centerY = height / 2

  // @fn calculateItemPosition - compute screen position from grid index
  const activeConfig = layerConfig[currentActiveCols] || {
    padding: 0,
    scrollOffset: 0,
    targetIndex: 0,
  }
  const activeSize = width / currentActiveCols
  const activeIdx = activeConfig.targetIndex
  const activeRow = Math.floor(activeIdx / currentActiveCols)
  const activeCol = activeIdx % currentActiveCols

  const posAx = activeCol * activeSize
  const posAy =
    activeRow * activeSize + headerHeight - activeScrollOffsetRef.current

  const thisSize = width / cols
  const thisIdx = config.targetIndex
  const thisRow = Math.floor(thisIdx / cols)
  const thisCol = thisIdx % cols

  const thisScroll = isActive
    ? activeScrollOffsetRef.current
    : config.scrollOffset
  const posBx = thisCol * thisSize
  const posBy = thisRow * thisSize + headerHeight - thisScroll

  // @fn calculateTranslation - align both layers at focal point
  const relativeScale = s * (cols / currentActiveCols)
  const term1X = (posAx - centerX) * s
  const term1Y = (posAy - centerY) * s
  const term2X = (focalX.current - centerX) * (1 - s)
  const term2Y = (focalY.current - centerY) * (1 - s)
  const term3X = (posBx - centerX) * relativeScale
  const term3Y = (posBy - centerY) * relativeScale

  const translateX = term1X + term2X - term3X
  const translateY = term1Y + term2Y - term3Y

  return {
    /** Opacity value (0-1) for layer visibility during transitions */
    opacity,
    /** Z-index for layer stacking order */
    zIndex,
    /** Horizontal translation in pixels */
    translateX,
    /** Vertical translation in pixels */
    translateY,
    /** Scale factor relative to the active layer */
    relativeScale,
  }
}
