import { motion, useReducedMotion, type TargetAndTransition, type Transition } from 'motion/react'

// Framer text "appear" effect with character tokenization, triggered on mount: every character starts from
// `from` and animates to its resting state, `stagger` seconds after the previous one.

/** Blur 10px + 10px rise, spring 0.4s without bounce (Framer preset used for titles). */
export const RISE = { from: { opacity: 0.001, y: 10, filter: 'blur(10px)' }, transition: { type: 'spring', duration: 0.4, bounce: 0 } } as const
/** Blur 10px + scale 2 → 1, spring 0.45s with a little bounce (used for the About page numbers). */
export const ZOOM = { from: { opacity: 0.001, scale: 2, filter: 'blur(10px)' }, transition: { type: 'spring', duration: 0.45, bounce: 0.25 } } as const

type Props = {
  text: string
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'p'
  effect?: { from: TargetAndTransition; transition: Transition }
  stagger?: number
}

export default function CharReveal({ text, className = '', as = 'p', effect = RISE, stagger = 0.05 }: Props) {
  const reduce = useReducedMotion()
  const Tag = motion[as]
  let index = 0
  return (
    <Tag aria-label={text} className={className}>
      {text.split(' ').map((word, w) => (
        <span key={w} aria-hidden>
          {w > 0 && ' '}
          <span className="inline-block whitespace-nowrap">
            {[...word].map((ch, c) => (
              <motion.span
                key={c}
                className="inline-block"
                initial={reduce ? false : effect.from}
                animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                transition={{ ...effect.transition, delay: index++ * stagger }}
              >
                {ch}
              </motion.span>
            ))}
          </span>
        </span>
      ))}
    </Tag>
  )
}
