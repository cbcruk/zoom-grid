import { useMemo } from 'react'

interface UseLayerDataProps<T> {
  data: T[]
  padding: number
  cols: number
}

/**
 * Hook that prepends empty padding items for grid alignment
 */
export function useLayerData<T>({ data, padding, cols }: UseLayerDataProps<T>) {
  return useMemo(() => {
    if (!data) return []

    if (padding === 0) return data

    const emptyItems = Array(padding)
      .fill(0)
      .map((_, i) => ({
        type: 'empty',
        id: `pad-${cols}-${i}`,
      }))

    return [...emptyItems, ...data] as T[]
  }, [data, padding, cols])
}
