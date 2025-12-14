import type { ZoomLayerProps } from './types'
import { ZoomGridList } from '../ZoomGridList'
import { useLayerData, useLayerTransform } from './hooks'
import styles from './ZoomLayer.module.css'

/**
 * Single zoom level layer with transform animations
 */
export function ZoomLayer<T>({
  cols,
  data,
  activeColumns,
  layerConfig,
  scale,
  activeColsShared,
  focalX,
  focalY,
  activeScrollOffsetRef,
  width,
  height,
  topInset,
  bottomInset,
  gap,
  isPinching,
  isAnimating,
  isPinchingRef,
  listRefsRef,
  renderItem,
}: ZoomLayerProps<T>) {
  const isActive = cols === activeColumns
  const config = layerConfig[cols] || {
    padding: 0,
    scrollOffset: 0,
    targetIndex: 0,
  }

  const layerData = useLayerData({
    data,
    padding: config.padding,
    cols,
  })

  const { opacity, zIndex, translateX, translateY, relativeScale } =
    useLayerTransform({
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
    })

  return (
    <div
      className={styles.container}
      data-is-animating={isAnimating}
      data-is-active={isActive}
      style={{
        opacity,
        zIndex,
        transform: `translate(${translateX}px, ${translateY}px) scale(${relativeScale})`,
      }}
    >
      <ZoomGridList
        ref={(r) => {
          if (r) listRefsRef.current[cols] = r
        }}
        data={layerData}
        numColumns={cols}
        targetIndex={config.targetIndex}
        width={width}
        height={height}
        gap={gap}
        isInteractive={isActive && !isPinching}
        onScroll={(scrollTop) => {
          if (isActive) {
            activeScrollOffsetRef.current = scrollTop
          }
        }}
        renderItem={({ item, index, size, isTarget }) => {
          if (
            item &&
            typeof item === 'object' &&
            'type' in item &&
            item.type === 'empty'
          ) {
            return <div style={{ width: size, height: size }} />
          }

          return renderItem({
            item,
            index,
            size,
            isTarget,
            isPinching: isPinchingRef,
          })
        }}
        contentContainerStyle={{
          paddingTop: topInset,
          paddingBottom: bottomInset,
        }}
      />
    </div>
  )
}
