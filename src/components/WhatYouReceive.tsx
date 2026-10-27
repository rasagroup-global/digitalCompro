import { useLayoutEffect, useRef, useState, type RefObject } from 'react'
import { motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useBreakpoint, type Breakpoint } from '../hooks/useBreakpoint'
import ScrollTextDistortion from './ScrollTextDistortion'
import { useT } from '../i18n'

// Motion values below are taken 1:1 from the published Framer page (node LsUUdboms "What You Receive"):
// three 100vh sticky panels stacking over each other, the "Desc" accordion switching variant per
// panel (scroll targets, threshold 0.5) and Scroll Text Distortion words on every image.

/** Desc variant transition. */
const DESC_SPRING = { type: 'spring', bounce: 0.2, duration: 0.4 } as const

/** Panel photos; the accordion items and the words on each photo come from the dictionary. */
const PANEL_IMAGES = ['Vt7OZonxIk9azWUXdWmOqKF9Aoo.webp', 'YApzlIRQn1xRnJ4xBuMEvHLWKvY.webp', 'ggRRadvJjdCCzknOyhkCs7PtOM.webp']

type Panel = { image: string; words: Record<'phone' | 'other', string[]> }

/** Desc title sizes per breakpoint: [active, inactive]. */
const TITLE_SIZE: Record<Breakpoint, [number, number]> = { desktop: [40, 24], tablet: [32, 24], phone: [28, 18] }

/** The "Desc" component: the active item gets the big title and its description. */
function Desc({ active, bp }: { active: number; bp: Breakpoint }) {
  const phone = bp === 'phone'
  const [big, small] = TITLE_SIZE[bp]
  const items = useT().receive.items
  return (
    <div className={`flex w-full flex-col justify-center ${phone ? 'py-[18px]' : 'gap-2.5 py-6'}`}>
      {items.map((item, i) => (
        <motion.div
          key={i}
          layout
          transition={DESC_SPRING}
          className={`flex w-full flex-col ${phone ? 'pb-3.5' : 'pb-[18px]'} ${i < items.length - 1 ? 'border-b border-[rgba(34,34,34,0.24)]' : ''}`}
        >
          <div className={`flex w-full ${phone ? 'py-2' : 'py-3'}`}>
            {/* Framer swaps the text size per variant and lets the layout animation scale between them. */}
            <motion.h3
              layout
              transition={DESC_SPRING}
              style={{ fontSize: active === i ? big : small, transformOrigin: '0% 50%' }}
              className="flex-1 font-serif leading-[1.25] font-medium tracking-[-0.03em] [word-break:break-word] text-ink uppercase"
            >
              {item.title}
            </motion.h3>
          </div>
          {active === i && (
            <motion.p layout="position" className={`w-full leading-[1.2] [word-break:break-word] text-ink ${phone ? '' : 'text-lg'}`}>
              {item.text}
            </motion.p>
          )}
        </motion.div>
      ))}
    </div>
  )
}

/**
 * Word font size: the Framer size, shrunk only when a word is wider than the photo (long German words like
 * "Maßgeschneidertes"; the English words always fit, so they keep the Framer size).
 */
function useFittedFontSize(ref: RefObject<HTMLDivElement | null>, words: string[], base: number) {
  const [size, setSize] = useState(base)
  useLayoutEffect(() => {
    const el = ref.current!
    const ctx = document.createElement('canvas').getContext('2d')!
    const fit = () => {
      ctx.font = `400 ${base}px 'Editor', serif`
      // Same nbsp padding as the ScrollTextDistortion sizing copy.
      const widest = Math.max(...words.map((w) => ctx.measureText(`\u00a0${w}\u00a0`).width))
      setSize(widest > el.clientWidth ? Math.floor((base * el.clientWidth) / widest) : base)
    }
    fit()
    document.fonts?.ready.then(fit)
    const observer = new ResizeObserver(fit)
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, words, base])
  return size
}

function PanelImage({ panel, bp }: { panel: Panel; bp: Breakpoint }) {
  const words = panel.words[bp === 'phone' ? 'phone' : 'other']
  const ref = useRef<HTMLDivElement>(null)
  const fontSize = useFittedFontSize(ref, words, bp === 'desktop' ? 80 : 60)
  return (
    <div ref={ref} className="relative flex min-h-0 w-full flex-1 flex-col overflow-clip md:h-full md:w-px">
      <img
        src={`/images/${panel.image}`}
        alt=""
        draggable={false}
        loading="lazy"
        className="h-full min-h-0 w-full flex-1 object-cover"
        style={{ filter: 'brightness(0.5) grayscale(0.24)' }}
      />
      <div className="absolute inset-x-0 top-1/2 z-[1] flex -translate-y-1/2 flex-col items-center mix-blend-difference lg:gap-2.5">
        {words.map((word) => (
          <ScrollTextDistortion key={word} text={word} fontSize={fontSize} />
        ))}
      </div>
    </div>
  )
}

export default function WhatYouReceive() {
  const bp = useBreakpoint()
  const words = useT().receive.words
  const panels: Panel[] = PANEL_IMAGES.map((image, i) => ({ image, words: words[i] }))
  const containerRef = useRef<HTMLDivElement>(null)
  const starts = useRef<number[]>([])
  const [active, setActive] = useState(0)
  const { scrollY } = useScroll()

  // Panels 2 and 3 are the scroll targets: once a panel's top passes 50% of the viewport, its item
  // becomes active (before panel 2 the Desc stays on item 1).
  useLayoutEffect(() => {
    const measure = () => {
      const top = containerRef.current!.getBoundingClientRect().top + window.scrollY
      // Natural (unstuck) panel tops: each panel is exactly 100vh tall.
      starts.current = [1, 2].map((i) => top + i * window.innerHeight - 1 - 0.5 * window.innerHeight)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(document.body)
    return () => observer.disconnect()
  }, [])

  useMotionValueEvent(scrollY, 'change', (y) => {
    let index = 0
    starts.current.forEach((start, i) => {
      if (y >= start) index = i + 1
    })
    setActive(index)
  })

  const panelRow = 'sticky top-0 flex h-screen w-full flex-none flex-col overflow-clip md:flex-row'
  const spacer = 'pointer-events-none flex w-full flex-1 md:h-full md:w-px md:flex-[0.7] md:px-8'

  return (
    <section id="whatyoureceive" className="flex w-full flex-col items-center overflow-clip">
      <div ref={containerRef} className="flex w-full flex-col items-center overflow-clip lg:w-[1200px]">
        <div className="sticky top-0 z-[2] flex h-screen w-full flex-none flex-col md:flex-row md:items-center md:gap-8 md:overflow-clip md:pl-8">
          <div className="flex min-h-0 w-full flex-1 flex-col items-center justify-center overflow-clip px-6 md:h-full md:w-px md:flex-[0.7] md:px-0">
            <div className="flex w-full flex-1 flex-col items-start justify-center gap-6 md:py-8">
              <Desc active={active} bp={bp} />
            </div>
          </div>
          <PanelImage panel={panels[0]} bp={bp} />
        </div>

        {panels.slice(1).map((panel, i) => (
          <div
            key={panel.image}
            className={`${panelRow} ${i === 0 ? 'z-[3]' : 'z-[4]'}`}
          >
            <div className={spacer} />
            <PanelImage panel={panel} bp={bp} />
          </div>
        ))}

        {/* Phone only: one more empty sticky screen so the last panel stays in view. */}
        <div className="sticky top-0 z-[4] flex h-screen w-full flex-none md:hidden">
          <div className="pointer-events-none w-full flex-1" />
        </div>
      </div>
    </section>
  )
}
