import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { motion, useAnimationFrame, useMotionValue, useReducedMotion } from 'motion/react'

/**
 * Framer Ticker: an endless row moving left at a fixed speed that overflows its box to the viewport edges.
 * `children(copy)` renders one set of items; copies (`copy === true`) are duplicates for the loop.
 */
export default function Ticker({
  children,
  speed = 40,
  gap = 10,
  itemGap = gap,
  draggable = true,
  className = '',
}: {
  children: (copy: boolean) => ReactNode
  /** px per second. */
  speed?: number
  /** Space between repeated sets. */
  gap?: number
  /** Space between items inside one set. */
  itemGap?: number
  draggable?: boolean
  className?: string
}) {
  const boxRef = useRef<HTMLDivElement>(null)
  const copyRef = useRef<HTMLDivElement>(null)
  const metrics = useRef({ step: 1, lead: 0 })
  const [copies, setCopies] = useState(2)
  const x = useMotionValue(0)
  const offset = useRef(0)
  const drag = useRef<{ startX: number; startOffset: number; moved: boolean } | null>(null)
  const suppressClick = useRef(false)
  const reduce = useReducedMotion()

  // The row overflows to both viewport edges, so enough copies are rendered to cover the whole screen.
  useLayoutEffect(() => {
    const measure = () => {
      const step = copyRef.current!.offsetWidth + gap
      const left = boxRef.current!.getBoundingClientRect().left
      const lead = Math.ceil(Math.max(left, 0) / step) * step
      metrics.current = { step, lead }
      setCopies(Math.ceil((window.innerWidth + lead) / step) + 1)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(copyRef.current!)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [gap])

  useAnimationFrame((_, delta) => {
    if (!drag.current && !reduce) offset.current -= (speed * Math.min(delta, 100)) / 1000
    const { step, lead } = metrics.current
    const wrapped = ((offset.current % step) + step) % step
    x.set(wrapped - step - lead)
  })

  useEffect(() => {
    const move = (e: PointerEvent) => {
      const d = drag.current
      if (!d) return
      const dx = e.clientX - d.startX
      if (Math.abs(dx) > 3) d.moved = true
      offset.current = d.startOffset + dx
    }
    const up = () => {
      if (drag.current?.moved) suppressClick.current = true
      drag.current = null
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
    }
  }, [])

  return (
    <div
      ref={boxRef}
      className={`w-full touch-pan-y select-none ${className}`}
      onPointerDown={(e) => {
        if (!draggable || e.button !== 0) return
        drag.current = { startX: e.clientX, startOffset: offset.current, moved: false }
        suppressClick.current = false
      }}
      onClickCapture={(e) => {
        // A drag must not open the tile under the pointer.
        if (suppressClick.current) {
          e.preventDefault()
          e.stopPropagation()
          suppressClick.current = false
        }
      }}
      onDragStart={(e) => e.preventDefault()}
    >
      <motion.div className="flex w-max" style={{ x, gap }}>
        {Array.from({ length: copies }, (_, i) => (
          <div key={i} ref={i === 0 ? copyRef : undefined} className="flex" style={{ gap: itemGap }} aria-hidden={i > 0 || undefined}>
            {children(i > 0)}
          </div>
        ))}
      </motion.div>
    </div>
  )
}
