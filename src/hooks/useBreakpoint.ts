import { useEffect, useState } from 'react'

export type Breakpoint = 'phone' | 'tablet' | 'desktop'

// Same breakpoints as the Framer project.
const QUERIES: [Breakpoint, string][] = [
  ['phone', '(max-width: 809.98px)'],
  ['tablet', '(min-width: 810px) and (max-width: 1199.98px)'],
  ['desktop', '(min-width: 1200px)'],
]

const current = (): Breakpoint => QUERIES.find(([, q]) => window.matchMedia(q).matches)?.[0] ?? 'desktop'

export function useBreakpoint(): Breakpoint {
  const [bp, setBp] = useState(current)
  useEffect(() => {
    const lists = QUERIES.map(([, q]) => window.matchMedia(q))
    const onChange = () => setBp(current())
    lists.forEach((l) => l.addEventListener('change', onChange))
    return () => lists.forEach((l) => l.removeEventListener('change', onChange))
  }, [])
  return bp
}
