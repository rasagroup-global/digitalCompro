import { useLayoutEffect, useRef, type RefObject } from 'react'
import { useScroll, useSpring, useTransform } from 'motion/react'

/** Spring that smooths scroll-linked values (Framer `__framer__spring`). */
export const SCROLL_SMOOTHING = { stiffness: 500, damping: 60, mass: 1 }

/**
 * Page top of `el`. Inside a sticky block this is where the element ends up once the block is released
 * (what Framer measures), not where it happens to be stuck right now.
 */
function settledTop(el: HTMLElement) {
  const top = el.getBoundingClientRect().top + window.scrollY
  for (let node = el.parentElement; node; node = node.parentElement) {
    if (getComputedStyle(node).position !== 'sticky' || !node.parentElement) continue
    const stuck = node.getBoundingClientRect()
    const released = node.parentElement.getBoundingClientRect().bottom - stuck.height
    return top + (released - stuck.top)
  }
  return top
}

/**
 * Framer "scroll target" transform progress (0 → 1), spring-smoothed. The effect starts when the
 * target's top reaches `threshold` of the viewport (1 = bottom edge, 0.5 = middle) and completes once
 * the page has scrolled one target-height further. `target` is a ref or an element id (for targets that
 * live in another part of the tree); with no target on the page the progress stays at 0.
 */
export function useScrollTargetProgress(target: RefObject<HTMLElement | null> | string, threshold: number) {
  const { scrollY } = useScroll()
  const range = useRef<[number, number] | null>(null)

  useLayoutEffect(() => {
    const measure = () => {
      const el = typeof target === 'string' ? document.getElementById(target) : target.current
      if (!el) {
        range.current = null
        return
      }
      const start = settledTop(el) - 1 - threshold * window.innerHeight
      range.current = [Math.max(start, 0), Math.max(start + el.clientHeight, 0)]
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(document.body)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [target, threshold])

  const raw = useTransform(scrollY, (y) => {
    if (!range.current) return 0
    const [from, to] = range.current
    if (to <= from) return y < from ? 0 : 1
    return Math.min(Math.max((y - from) / (to - from), 0), 1)
  })
  return useSpring(raw, SCROLL_SMOOTHING)
}
