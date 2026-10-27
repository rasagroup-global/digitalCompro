import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import Button, { APPLY_URL } from './Button'
import { useT } from '../i18n'

// Motion values below are taken 1:1 from the published Framer site (node AROcQjiak, component "CTA
// Section"): the chip rises 80px and fades in as soon as it enters the viewport, and the title appears
// character by character (blur 10px + 10px rise, 0.05s apart) when it scrolls into view. Both run once.

const CHIP_IN = { type: 'tween', duration: 0.6, ease: [0.12, 0.23, 0.5, 1] } as const

function RevealTitle({ title }: { title: string }) {
  const ref = useRef<HTMLHeadingElement>(null)
  const inView = useInView(ref, { once: true })
  const reduce = useReducedMotion()
  let index = 0

  return (
    <h2
      ref={ref}
      aria-label={title}
      className="w-full font-serif text-[50px] leading-none tracking-[-0.02em] text-cream md:text-[70px]"
    >
      {title.split(' ').map((word, w) => (
        <span key={w} aria-hidden>
          {w > 0 && ' '}
          <span className="inline-block whitespace-nowrap">
            {[...word].map((ch, c) => {
              const delay = index++ * 0.05
              return (
                <motion.span
                  key={c}
                  className="inline-block"
                  initial={reduce ? false : { opacity: 0.001, y: 10, filter: 'blur(10px)' }}
                  animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : undefined}
                  transition={{ type: 'spring', duration: 0.4, bounce: 0, delay }}
                >
                  {ch}
                </motion.span>
              )
            })}
          </span>
        </span>
      ))}
    </h2>
  )
}

export default function CtaSection() {
  const reduce = useReducedMotion()
  const t = useT().cta
  return (
    <section className="relative flex flex-col items-center overflow-hidden bg-cream px-4 md:px-5 lg:px-8">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/video/cta.mp4"
        poster="/images/WVwLJRmP6YWapOqqDuskyaOQKY.jpeg"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden
      />
      <div className="absolute inset-0 bg-[rgba(15,15,15,0.6)]" />
      <div className="absolute inset-x-0 bottom-0 z-[1] h-[150px] bg-gradient-to-b from-[rgba(16,16,16,0)] to-ink" />

      <div className="relative z-[2] flex w-full max-w-[1600px] justify-center overflow-hidden py-20 md:py-[100px] lg:py-[136px]">
        <div className="flex w-full flex-col items-center gap-6 text-center">
          <div className="flex w-full max-w-[480px] flex-col items-center gap-2.5 lg:max-w-[640px]">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0 }}
              transition={CHIP_IN}
              className="rounded-3xl px-4 py-1 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.16)]"
            >
              <p className="font-[DM_Mono,monospace] text-xs leading-4 font-medium tracking-[0.02em] whitespace-pre text-cream uppercase">
                {t.chip}
              </p>
            </motion.div>
            <RevealTitle key={t.title} title={t.title} />
          </div>
          <Button href={APPLY_URL} variant="light">
            {t.button}
          </Button>
        </div>
      </div>
    </section>
  )
}
