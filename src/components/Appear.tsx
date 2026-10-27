import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'

/** Framer "Appear" effect used across the page: opacity 0 → 1 at 50% in view, once. */
export const APPEAR = { type: 'spring', stiffness: 400, damping: 58, mass: 1, delay: 0.1 } as const

export default function Appear({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={APPEAR}
    >
      {children}
    </motion.div>
  )
}
