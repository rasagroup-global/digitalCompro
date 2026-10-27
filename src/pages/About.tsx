import { motion, useReducedMotion } from 'motion/react'
import Button, { APPLY_URL } from '../components/Button'
import Appear from '../components/Appear'
import CharReveal, { ZOOM } from '../components/CharReveal'
import Team from '../components/Team'
import Ticker from '../components/Ticker'
import Lines from '../components/Lines'
import { useT } from '../i18n'

// Motion values below are taken 1:1 from the published Framer page (node grDVQrmuc "About"): hero words fade
// in on load, the title and the subtitles reveal character by character on mount, the image row is a Framer
// Ticker (40 px/s, not draggable), and text blocks / stats / team tiles use the Framer appear (opacity,
// spring 400/58, delay 0.1, at 50% in view, once).

const img = (file: string) => `/images/${file}`

/** Page-load fade used by the hero's small lines (spring 400/58, delay 0.4). */
const LOAD = { type: 'spring', stiffness: 400, damping: 58, mass: 1, delay: 0.4 } as const

const TICKER = [
  'xZJDbddA9iEd0oCOGy7vLVriY.png',
  '3DMG36Rn41BYKFPauN3CHNgu9U.jpg',
  'HxUIDBrWcpntm2gIoQCuUCPqj8.png',
  'YApzlIRQn1xRnJ4xBuMEvHLWKvY.webp',
  'vhMiJzq3WZxvScrh4LXVKVY2Oyw.webp',
]

const eyebrow = 'font-sans leading-[1.25] font-medium tracking-[0.31em] whitespace-pre text-ink uppercase'
const sectionTitle = 'font-serif text-[30px] leading-[1.2] font-medium text-center uppercase md:text-[42px] lg:text-[46px]'
const subtitle = 'w-full text-lg leading-[1.35] tracking-[-0.03em] text-center text-ink'

function LoadFade({ children, className }: { children: string; className: string }) {
  const reduce = useReducedMotion()
  return (
    <motion.p className={className} initial={reduce ? false : { opacity: 0.001 }} animate={{ opacity: 1 }} transition={LOAD}>
      {children}
    </motion.p>
  )
}

function Stat({ value, label, sub }: { value: string; label: string; sub?: string }) {
  return (
    <div className="flex w-full flex-col items-center gap-1 overflow-clip p-6 md:w-px md:flex-1 md:p-8 lg:w-full lg:flex-none">
      <Appear className="w-full">
        <CharReveal
          text={value}
          effect={ZOOM}
          className="font-serif text-[50px] leading-[1.35] text-center text-ink md:text-[60px]"
        />
      </Appear>
      <Appear className="w-full">
        <p className="text-[26px] leading-[1.35] text-center text-ink">{label}</p>
        {sub && <p className="text-[26px] leading-[1.35] text-center text-ink">{sub}</p>}
      </Appear>
    </div>
  )
}

export default function About() {
  const t = useT().about
  return (
    <>
      {/* Hero (the full navigation bar sits above it in the page flow). */}
      <section className="flex w-full flex-col items-center px-6 pt-[68px] md:px-8 md:pt-[112px]">
        <div className="flex w-full flex-col items-center gap-[60px] pt-[60px] pb-10 lg:w-[1136px]">
          <div className="flex w-full flex-col items-center gap-6">
            <div className="flex w-full justify-center overflow-clip">
              <LoadFade className={eyebrow}>{t.eyebrow}</LoadFade>
            </div>
            <CharReveal
              as="h1"
              key={t.title}
              text={t.title}
              className="w-full font-serif text-[40px] leading-[1.05] font-medium tracking-[-0.03em] text-center text-ink uppercase max-md:[&:lang(de)]:text-[32px] md:text-[48px] lg:text-[58px]"
            />
            <div className="flex w-full justify-center overflow-clip">
              <LoadFade className={`${eyebrow} md:text-2xl`}>{t.company}</LoadFade>
            </div>
          </div>
        </div>
      </section>

      {/* Image ticker; the slim navigation bar slides in while this row passes the middle of the screen. */}
      <section id="nav-slide-target" className="flex w-full flex-col items-center overflow-x-clip" aria-hidden>
        <div className="flex w-full px-6 pt-10 pb-10 md:px-8 md:pb-20 lg:w-[1200px]">
          <div className="w-[500px] max-w-full rounded-[10px]">
            <Ticker draggable={false}>
              {() =>
                TICKER.map((file) => (
                  <img
                    key={file}
                    src={img(file)}
                    alt=""
                    draggable={false}
                    className="aspect-square w-[254px] flex-none rounded-lg object-cover grayscale-[0.29] md:w-[320px]"
                  />
                ))
              }
            </Ticker>
          </div>
        </div>
      </section>

      {/* Ownership */}
      <section className="flex w-full flex-col items-center">
        <div className="flex w-full px-6 py-10 md:px-8 lg:w-[1200px] lg:py-20">
          <div className="flex w-full flex-col items-center gap-10 overflow-clip md:flex-row">
            <img
              src={img('HTmCM8SJiwBbbou3JoT7ldFq8ns.jpeg')}
              alt=""
              className="h-[323px] w-full flex-none rounded-xl object-cover md:h-[413px] md:w-px md:flex-1 lg:h-[508px]"
            />
            <div className="flex w-full flex-col items-start justify-center gap-[60px] overflow-clip md:w-px md:flex-1 md:gap-12 lg:gap-[60px]">
              <div className="flex w-full flex-col items-center gap-2.5 overflow-clip">
                <Appear className="w-full">
                  <p className="text-2xl leading-[1.35] text-ink md:text-[22px] lg:text-[28px]">
                    {t.ownership.pre}
                    <strong>{t.ownership.company}</strong>
                    {t.ownership.mid}
                    <strong>{t.ownership.owner}</strong>
                    {t.ownership.post}
                  </p>
                </Appear>
                <Appear className="w-full">
                  <p className="text-lg leading-[1.35] text-ink">
                    {t.ip}
                  </p>
                </Appear>
              </div>
              <Button href={APPLY_URL} className="max-md:w-full">
                {t.cta}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* First year */}
      <section className="flex w-full flex-col items-center">
        <div className="flex w-full flex-col items-start gap-8 px-6 py-10 md:gap-6 md:px-8 lg:w-[1200px] lg:gap-8 lg:py-20">
          <Appear className="flex w-full flex-col items-center gap-[18px] overflow-clip md:gap-6">
            <Appear className="w-full">
              {/* Framer keeps the trailing space of the first line, which nudges it left. */}
              <h2 className={`${sectionTitle} whitespace-pre-wrap`}>
                <Lines lines={t.firstYear} />
              </h2>
            </Appear>
            <Appear className="w-full">
              <CharReveal key={t.firstYearNote} text={t.firstYearNote} className={subtitle} />
            </Appear>
          </Appear>
          <div className="flex w-full flex-col items-center justify-center gap-10 overflow-clip md:flex-row">
            <div className="flex w-full flex-col items-center justify-center gap-6 overflow-clip md:w-px md:flex-1 md:p-8 lg:h-[592px] lg:flex-row">
              <div className="order-1 flex w-full flex-col items-center justify-center gap-2.5 overflow-clip md:flex-row lg:order-none lg:w-px lg:flex-1 lg:flex-col">
                <Stat value="€ 493 K" label={t.stats[0]} />
                <Stat value={'€ 170 K'} label={t.stats[1]} />
              </div>
              <img
                src={img('SoxEdt82bg6noiw3EsXtqVc48A.jpeg')}
                alt=""
                className="order-0 h-[401px] w-full flex-none rounded-xl object-cover md:h-[349px] md:rounded-[200px] lg:order-none lg:h-full lg:w-[362px]"
              />
              <div className="order-2 flex w-full flex-col items-start justify-center gap-2.5 overflow-clip md:flex-row lg:order-none lg:w-px lg:flex-1 lg:flex-col">
                <Stat value="3,500+" label={t.stats[2]} />
                <Stat value="65+" label={t.stats[3]} sub={t.ownCreations} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core team */}
      <section id="team" className="flex w-full flex-col items-center overflow-clip px-6 pt-10 pb-20 md:px-8 md:py-20">
        <div className="flex w-full flex-col items-center gap-[60px]">
          <Appear className="flex w-full flex-col items-center gap-[18px] overflow-clip md:gap-6">
            <Appear className="w-full">
              <h2 className={sectionTitle}>
                <Lines lines={t.teamHeading} />
              </h2>
            </Appear>
            <Appear className="w-full">
              <CharReveal key={t.teamText} text={t.teamText} className={subtitle} />
            </Appear>
          </Appear>
          <Team layout="grid" />
        </div>
      </section>
    </>
  )
}
