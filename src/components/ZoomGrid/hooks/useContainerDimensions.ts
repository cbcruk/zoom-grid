import { useState, useEffect, useRef } from 'react'

/**
 * Hook that tracks container element dimensions
 */
export function useContainerDimensions() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (!containerRef.current) return

    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        })
      }
    }

    updateDimensions()

    // @fn useResizeObserver - reusable observer pattern
    const observer = new ResizeObserver(updateDimensions)
    observer.observe(containerRef.current)

    return () => observer.disconnect()
  }, [])

  return {
    /** Ref to attach to the container element for dimension tracking */
    containerRef,
    /** Current width of the container in pixels */
    width: dimensions.width,
    /** Current height of the container in pixels */
    height: dimensions.height,
  }
}
