// composables/useBoundedDraggable.ts
import { useDraggable, useWindowSize } from '@vueuse/core'

interface Options {
  initialX?: number
  initialY?: number
}

export function useBoundedDraggable(target: any, options: Options = {}) {
  const { width, height } = useWindowSize()
  const { initialX = 0, initialY = 0 } = options

  const { style } = useDraggable(target, {
    initialValue: { x: initialX, y: initialY },
    onMove: (position) => {
      position.x = Math.max(0, Math.min(position.x, width.value))
      position.y = Math.max(0, Math.min(position.y, height.value))
    },
    preventDefault: true,
    stopPropagation: true,
  })

  return { style }
}
