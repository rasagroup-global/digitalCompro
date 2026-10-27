import { useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react'
import { useBreakpoint, type Breakpoint } from '../hooks/useBreakpoint'
import { useT } from '../i18n'
import Lines from './Lines'

// Motion values below are taken 1:1 from the published Framer page (node kA9zXAc_S "Frame 14"):
// the "Card Container" component (15 variants) driving four "Card" components (Default / Hover).

/** Spring used by both Card and Card Container variant transitions. */
const VARIANT_SPRING = { type: 'spring', stiffness: 500, damping: 60, mass: 1 } as const
/** Heading/paragraph appear: opacity 0 → 1 at 50% in view, once. */
const APPEAR = { type: 'spring', stiffness: 400, damping: 58, mass: 1, delay: 0.1 } as const

/** Card images; title and text come from the dictionary (same order). */
const CARD_IMAGES = [
  'CEEme44W3W1CnUkdnaCHNAayw0.png',
  'qHaGqqWN7Fxb4qhR4V1ujP1s.png',
  'pqoRAaNda9BFprFRhyqTZ8iyg0.png',
  'A2T0jrfXRrctKJjDzCTskiKYMU.png',
]

type CardCopy = { title: string; text: string; image: string }

const HEIGHT: Record<Breakpoint, number> = { desktop: 450, tablet: 300, phone: 295 }

/**
 * Card width inside its pair. Desktop: the hovered card takes 60%, its partner the rest (minus the 10px gap).
 * Tablet: the hovered card takes 2/3. Phone: always full width. Same calc() shape so motion can interpolate.
 */
function cardWidth(bp: Breakpoint, index: number, active: number | null) {
  if (bp === 'phone') return 'calc(100% - 0px)'
  const partner = index ^ 1
  if (active === index) return bp === 'desktop' ? 'calc(60% - 0px)' : 'calc(66.6667% - 3.3333px)'
  if (active === partner) return bp === 'desktop' ? 'calc(40% - 10px)' : 'calc(33.3333% - 6.6667px)'
  return 'calc(50% - 5px)'
}

function Card({ card, hovered }: { card: CardCopy; hovered: boolean }) {
  return (
    <div className="relative flex h-full w-full cursor-pointer flex-col items-start justify-end gap-2.5 overflow-hidden rounded-xl p-7">
      <div className="absolute inset-0 overflow-hidden" style={{ filter: 'brightness(0.76) grayscale(0.19)' }}>
        <img
          src={`/images/${card.image}`}
          alt=""
          loading="lazy"
          className="absolute top-1/2 left-1/2 h-[456px] w-[730px] max-w-none -translate-x-1/2 -translate-y-1/2 object-cover"
        />
        <div className="absolute inset-0 bg-black/15" />
        <motion.div className="absolute inset-0 bg-ink" initial={false} animate={{ opacity: hovered ? 1 : 0 }} transition={VARIANT_SPRING} />
      </div>
      <div className="relative z-[1] flex w-full flex-col gap-6 overflow-hidden">
        <h3 className="font-serif text-[28px] leading-[1.4] font-medium tracking-[-0.02em] [word-break:break-word] text-white">
          {card.title}
        </h3>
        {hovered && (
          <p className="w-[230px] max-w-full text-lg leading-[1.2] font-medium tracking-[-0.02em] text-white">{card.text}</p>
        )}
      </div>
    </div>
  )
}

/**
 * Phone: four invisible markers sit on top of the cards; the card whose marker top has passed
 * 50% of the viewport becomes the hovered one (Framer scroll-target variants, threshold 0.5).
 */
function useScrollActiveCard(
  enabled: boolean,
  cardRefs: RefObject<(HTMLDivElement | null)[]>,
  setActive: (index: number | null) => void,
) {
  const { scrollY } = useScroll()
  const starts = useRef<number[]>([])
  const last = useRef<number | null | undefined>(undefined)

  useLayoutEffect(() => {
    if (!enabled) return
    const measure = () => {
      starts.current = (cardRefs.current ?? []).map((el) =>
        el ? el.getBoundingClientRect().top + window.scrollY - 1 - 0.5 * window.innerHeight : Infinity,
      )
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(document.body)
    return () => observer.disconnect()
  }, [enabled, cardRefs])

  useMotionValueEvent(scrollY, 'change', (y) => {
    if (!enabled) return
    let index: number | null = null
    starts.current.forEach((start, i) => {
      if (y >= start) index = i
    })
    // Only react when the scroll position crosses into another marker, so a tap can still pick a card.
    if (index !== last.current) {
      last.current = index
      setActive(index)
    }
  })
}

function Appear({ children, className }: { children: ReactNode; className?: string }) {
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

export default function DigitalEcosystem() {
  const t = useT().ecosystem
  const bp = useBreakpoint()
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const [active, setActive] = useState<number | null>(null)
  useScrollActiveCard(bp === 'phone', cardRefs, setActive)

  const pairs = [
    [0, 1],
    [2, 3],
  ]

  return (
    <section className="flex w-full flex-col items-center px-6 py-[60px] md:px-8 md:py-20">
      <div className="flex w-full flex-col items-center gap-10 overflow-clip md:gap-20 lg:w-[1136px]">
        <div className="flex w-full flex-col gap-[18px] text-center">
          <Appear>
            <h2 className="h-section">
              <Lines lines={t.heading} />
            </h2>
          </Appear>
          <Appear>
            <p className="text-lg leading-[1.35] tracking-[-0.03em] lg:text-2xl">
              <Lines lines={t.text} breakClass="hidden lg:inline" />
            </p>
          </Appear>
        </div>

        <div
          className="flex w-full flex-col gap-2.5 overflow-hidden lg:flex-row"
          onMouseLeave={() => bp === 'desktop' && setActive(null)}
        >
          {pairs.map((pair) => (
            <div
              key={pair[0]}
              className="flex w-full flex-col gap-2.5 md:flex-row lg:w-auto lg:flex-1"
              onMouseLeave={() => bp !== 'desktop' && setActive(null)}
            >
              {pair.map((i) => (
                <motion.div
                  key={i}
                  ref={(el) => {
                    cardRefs.current[i] = el
                  }}
                  className="shrink-0"
                  style={{ height: HEIGHT[bp] }}
                  initial={false}
                  animate={{ width: cardWidth(bp, i, active) }}
                  transition={VARIANT_SPRING}
                  onMouseEnter={() => setActive(i)}
                >
                  <Card card={{ ...t.cards[i], image: CARD_IMAGES[i] }} hovered={active === i} />
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
