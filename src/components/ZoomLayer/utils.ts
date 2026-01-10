/**
 * Linear interpolation with optional clamping
 */
export function interpolate(
  value: number,
  inputRange: [number, number],
  outputRange: [number, number],
  clamp = true
): number {
  const [inMin, inMax] = inputRange
  const [outMin, outMax] = outputRange

  let result = outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin)

  if (clamp) {
    result = Math.max(
      Math.min(result, Math.max(outMin, outMax)),
      Math.min(outMin, outMax)
    )
  }

  return result
}
