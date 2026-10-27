import { lazy, Suspense } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import RasaMark from './RasaMark'

// three.js is large, so the globe loads as its own chunk.
const Globe = lazy(() => import('./Globe'))

// Motion values below are taken 1:1 from the published Framer page (node a9mLnweII "Maps"): every word
// fades in on page load (spring 400/58, delay 0.4), the globe rises 20px and fades in (spring 1s, bounce 0,
// delay 1.1). The globe box fades out towards the bottom with a mask.

const WORD_IN = { type: 'spring', stiffness: 400, damping: 58, mass: 1, delay: 0.4 } as const
const GLOBE_IN = { type: 'spring', duration: 1, bounce: 0, delay: 1.1 } as const
const GLOBE_MASK = 'linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.96878) 41%, rgb(0,0,0) 83%)'

function Word({ children, kind }: { children: string; kind: 'top' | 'bottom' | 'mid' }) {
  const reduce = useReducedMotion()
  const style = {
    // "Rooted" / "Indonesia": 1.25 line height, tighter tracking on phone.
    top: 'font-sans text-2xl leading-[1.25] tracking-[0.18em] uppercase md:tracking-[0.24em]',
    // "Reaching" / "World".
    bottom: 'font-sans text-2xl leading-none tracking-[0.24em] uppercase',
    // Small italic serif connector ("In" / "The").
    mid: 'font-serif text-sm leading-[0.9] font-[425] tracking-[0.05em] capitalize italic',
  }[kind]
  return (
    <motion.p
      className={`whitespace-pre text-center text-ink ${style}`}
      initial={reduce ? false : { opacity: 0.001 }}
      animate={{ opacity: 1 }}
      transition={WORD_IN}
    >
      {children}
    </motion.p>
  )
}

export default function WorldMap() {
  const reduce = useReducedMotion()
  const half = 'flex w-full flex-none flex-col items-center justify-center gap-2.5 overflow-clip md:flex-row lg:w-px lg:flex-1'
  return (
    <section className="flex w-full flex-col items-start justify-center gap-6 overflow-x-clip pt-[60px] md:h-[654px] md:py-20 lg:h-[840px]">
      <div className="flex w-full flex-col items-center justify-center gap-8 overflow-clip opacity-90 lg:flex-row">
        <div className={`${half} lg:justify-end`}>
          <Word kind="top">Rooted</Word>
          <Word kind="mid">IN</Word>
          <Word kind="top">Indonesia</Word>
        </div>
        <RasaMark className="h-9 w-9 flex-none" />
        <div className={`${half} lg:justify-start`}>
          <Word kind="bottom">Reaching</Word>
          <Word kind="mid">THE</Word>
          <Word kind="bottom">WORld</Word>
        </div>
      </div>
      <motion.div
        className="relative h-[425px] w-full flex-none md:h-[463px] lg:h-px lg:flex-1"
        style={{ maskImage: GLOBE_MASK, WebkitMaskImage: GLOBE_MASK }}
        initial={reduce ? false : { opacity: 0.001, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={GLOBE_IN}
      >
        {/* The canvas is much larger than its box; the globe sits centred and runs past the bottom. */}
        <div className="absolute -top-[27px] -right-[283px] -bottom-[462px] -left-[281px] z-[1] md:top-0 md:-right-[446px] md:-bottom-[727px] md:-left-[446px] lg:-right-[436px] lg:-bottom-[688px] lg:-left-[435px]">
          <Suspense fallback={null}>
            <Globe />
          </Suspense>
        </div>
      </motion.div>
    </section>
  )
}
