import styles from './ZoomGrid.module.css'
import type { ZoomGridProps } from './types'
import { ZoomLayer } from '../ZoomLayer'
import {
  useContainerDimensions,
  useZoomState,
  useZoomAlignment,
  useZoomGestures,
} from './hooks'

const DEFAULT_ZOOM_LEVELS = [5, 3, 1]

/**
 * Zoomable grid component with pinch gesture support
 */
export function ZoomGrid<T>({
  data,
  zoomLevels = DEFAULT_ZOOM_LEVELS,
  initialNumColumns = 3,
  renderItem,
  onZoomChange,
  style,
  gap = 2,
  contentInsets,
}: ZoomGridProps<T>) {
  const { containerRef, width, height } = useContainerDimensions()

  const topInset = contentInsets?.top ?? 0
  const bottomInset = contentInsets?.bottom ?? 0

  const zoomState = useZoomState(zoomLevels, initialNumColumns)

  const alignment = useZoomAlignment({
    zoomState,
    width,
    height,
    topInset,
    bottomInset,
    dataLength: data?.length ?? 0,
    zoomLevels,
    onZoomChange,
  })

  useZoomGestures({
    containerRef,
    zoomState,
    alignment,
    zoomLevels,
  })

  const {
    activeColumns,
    isPinching,
    isAnimating,
    layerConfig,
    scale,
    activeColsShared,
    focalX,
    focalY,
    activeScrollOffset,
    isPinchingRef,
    listRefs,
  } = zoomState

  return (
    <div ref={containerRef} className={styles.container} style={style}>
      {width > 0 &&
        height > 0 &&
        zoomLevels.map((cols) => (
          <ZoomLayer
            key={cols}
            cols={cols}
            data={data}
            activeColumns={activeColumns}
            layerConfig={layerConfig}
            scale={scale}
            activeColsShared={activeColsShared}
            focalX={focalX}
            focalY={focalY}
            activeScrollOffsetRef={activeScrollOffset}
            width={width}
            height={height}
            topInset={topInset}
            bottomInset={bottomInset}
            gap={gap}
            isPinching={isPinching}
            isAnimating={isAnimating}
            isPinchingRef={isPinchingRef}
            listRefsRef={listRefs}
            renderItem={renderItem}
          />
        ))}
    </div>
  )
}
