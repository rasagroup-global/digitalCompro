import { useRef, type ReactNode, type RefObject } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import Button, { APPLY_URL } from '../components/Button'
import Reveal from '../components/Reveal'
import Team from '../components/Team'
import WorldMap from '../components/WorldMap'
import Hero from '../components/Hero'
import OurBrands from '../components/OurBrands'
import DigitalEcosystem from '../components/DigitalEcosystem'
import Process from '../components/Process'
import WhatYouReceive from '../components/WhatYouReceive'
import BusinessSchool from '../components/BusinessSchool'
import Appear from '../components/Appear'
import Lines from '../components/Lines'
import { useT } from '../i18n'

const img = (file: string) => `/images/${file}`

/* ------------------------------------------------------------------ Intro + brands */

/* Framer node iASFye3r7 ("brandcta"): only the paragraph fades in (Framer appear: opacity, spring 400/58,
   delay 0.1, at 50% in view, once); the button has no effect. Desktop: one row, text left, button right.
   Tablet/phone: stacked and centred (40px gap); phone has 60px vertical padding, 18px text and a full-width
   button. */
function Intro({ sectionRef }: { sectionRef: RefObject<HTMLElement | null> }) {
  const t = useT().intro
  return (
    <section
      ref={sectionRef}
      id="brandcta"
      className="mx-auto flex w-full flex-col items-center justify-center gap-10 overflow-clip px-8 py-[60px] md:py-20 lg:w-[1200px] lg:flex-row lg:items-end lg:gap-2.5"
    >
      <Appear className="w-full lg:w-px lg:flex-1">
        <p className="text-lg leading-[1.35] tracking-[-0.03em] text-center text-ink md:text-2xl lg:text-left">
          {t.text.pre}
          <strong>{t.text.brand}</strong>
          {t.text.post}
        </p>
      </Appear>
      <div className="flex w-full flex-col items-center justify-center gap-3.5 overflow-clip lg:w-px lg:flex-1 lg:flex-row lg:justify-end">
        <Button href={APPLY_URL} className="max-md:w-full">
          {t.cta}
        </Button>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ Story + heritage */

function Story() {
  const t = useT().story
  return (
    <section id="story" className="flex w-full flex-col items-center">
      <div className="container-site flex flex-col items-center py-20">
        <Reveal className="flex max-w-[976px] flex-col gap-6 text-center">
          <h2 className="h-section">
            <Lines lines={t.heading} />
          </h2>
          <p className="lead">
            <Lines lines={t.text} />
          </p>
        </Reveal>
      </div>
      <ParallaxImage src={img('zJveyUWbStUuhUTc1RPdHZkQI.webp')} className="h-[360px] w-full md:h-[585px]" />
    </section>
  )
}

function ParallaxImage({ src, className }: { src: string; className: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-10%', '10%'])
  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.img src={src} alt="" loading="lazy" style={{ y }} className="h-[120%] w-full -translate-y-[10%] object-cover" />
    </div>
  )
}

/* Framer node docHoGAZ7: heading and paragraph fade in, the two cards fade in together and each card's
   text fades in again on its own (Framer appear: opacity, spring 400/58, delay 0.1, at 50% in view). */

function SparkleIcon() {
  return (
    <svg viewBox="0 0 24.006 24.006" className="h-6 w-6 overflow-visible" aria-hidden>
      <path
        d="M 10.823 0.98 C 10.929 0.412 11.425 0 12.003 0 C 12.581 0 13.076 0.412 13.182 0.98 L 14.444 7.649 C 14.627 8.62 15.386 9.379 16.356 9.562 L 23.026 10.823 C 23.594 10.929 24.006 11.425 24.006 12.003 C 24.006 12.581 23.594 13.076 23.026 13.182 L 16.356 14.444 C 15.386 14.627 14.627 15.386 14.444 16.356 L 13.182 23.026 C 13.076 23.594 12.581 24.006 12.003 24.006 C 11.425 24.006 10.929 23.594 10.823 23.026 L 9.562 16.356 C 9.379 15.386 8.62 14.627 7.649 14.444 L 0.98 13.182 C 0.412 13.076 0 12.581 0 12.003 C 0 11.425 0.412 10.929 0.98 10.823 L 7.649 9.562 C 8.62 9.379 9.379 8.62 9.562 7.649 Z"
        fill="#000"
        stroke="#000"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Coffee cup; the small white pill on top of it forms the hole in the handle. */
function CupIcon() {
  return (
    <>
      <svg viewBox="0 0 24 24" className="h-6 w-6 overflow-visible" aria-hidden>
        <path
          d="M 8.842 0 L 8.842 2.526 M 13.895 0 L 13.895 2.526 M 16.421 7.579 C 17.119 7.579 17.684 8.144 17.684 8.842 L 17.684 18.947 C 17.684 21.738 15.422 24 12.632 24 L 5.053 24 C 2.262 24 0 21.738 0 18.947 L 0 8.842 C 0 8.144 0.566 7.579 1.263 7.579 L 18.947 7.579 C 21.738 7.579 24 9.841 24 12.632 C 24 15.422 21.738 17.684 18.947 17.684 L 17.684 17.684 M 3.789 0 L 3.789 2.526"
          fill="#000"
          stroke="#000"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="absolute top-[calc(52.5%-3.5px)] left-[26px] z-[1] h-[7px] w-[5px] rounded-r-[50px] bg-white" />
    </>
  )
}

function Feature({
  icon,
  title,
  children,
  tabletLarge = false,
}: {
  icon: ReactNode
  title: string
  children: ReactNode
  /** Framer only overrides the second card's text for tablet (16px); the first keeps its 18px. */
  tabletLarge?: boolean
}) {
  return (
    <div className="flex w-full flex-col items-center gap-6 md:w-px md:flex-1 md:items-start md:self-stretch">
      <div className="relative flex overflow-clip p-2">{icon}</div>
      <div className="flex w-full flex-col items-center gap-3 overflow-clip">
        <h3 className="w-full font-serif text-lg leading-[1.2] font-medium text-center uppercase md:text-left md:text-2xl">{title}</h3>
        <Appear className="w-full">
          <p className={`leading-[1.35] text-center text-ink md:text-left ${tabletLarge ? 'md:text-lg' : 'lg:text-lg'}`}>{children}</p>
        </Appear>
      </div>
    </div>
  )
}

function Heritage() {
  const t = useT().heritage
  return (
    <section className="flex w-full flex-col items-center">
      <div className="flex w-full flex-col items-center gap-[60px] px-6 py-[60px] md:gap-20 md:px-8 md:py-20 lg:w-[1200px]">
        <div className="flex w-full flex-col items-center gap-[18px] overflow-clip text-center lg:flex-row lg:items-end lg:text-left">
          <Appear className="w-full lg:w-px lg:flex-1">
            <h2 className="h-section">{t.heading}</h2>
          </Appear>
          <Appear className="w-full lg:w-px lg:flex-1">
            <p className="text-lg leading-[1.35] tracking-[-0.03em] text-ink lg:text-2xl">
              {t.text}
            </p>
          </Appear>
        </div>
        <Appear className="flex w-full flex-col items-start justify-center gap-10 overflow-clip md:flex-row">
          <Feature title={t.features[0].title} icon={<SparkleIcon />} tabletLarge>
            {t.features[0].text}
          </Feature>
          <Feature title={t.features[1].title} icon={<CupIcon />}>
            {t.features[1].text}
          </Feature>
        </Appear>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ Retail */

/* Framer node nraAs2kEv: heading and the card texts fade in (Framer appear), the photo fades in while
   scaling up from 85% (spring 400/58, no delay). All at 50% in view, once. */
function Retail() {
  const reduce = useReducedMotion()
  const t = useT().retail
  return (
    <section className="flex w-full flex-col items-center">
      <div className="flex w-full flex-col items-center gap-[60px] px-6 py-[60px] md:gap-10 md:px-8 md:py-20 lg:w-[1200px] lg:flex-row">
        <div className="flex w-full flex-col items-center gap-6 overflow-clip text-center lg:w-px lg:flex-1 lg:items-start lg:text-left">
          <Appear className="w-full">
            <h2 className="font-serif text-[30px] leading-[1.2] font-medium uppercase md:text-[46px]">
              <Lines lines={t.heading} />
            </h2>
          </Appear>
          <p className="w-full max-w-[500px] text-lg leading-[1.4] text-body">{t.text}</p>
          <div className="flex w-full flex-col items-start justify-center gap-[18px] overflow-clip md:flex-row">
            {t.boxes.map((box, i) => (
              <div
                key={i}
                className={`flex w-full flex-col items-center gap-3 overflow-clip rounded-xl p-5 shadow-[inset_0_0_0_1px_#dedede] md:w-px md:flex-1 ${
                  i === 0 ? 'justify-center' : 'justify-start md:self-stretch'
                }`}
              >
                <h3 className="w-full font-serif text-2xl leading-[1.2] font-medium text-center uppercase md:text-left">{box.title}</h3>
                <Appear className="w-full">
                  <p className="leading-[1.35] text-center text-ink md:text-left md:text-lg">{box.text}</p>
                </Appear>
              </div>
            ))}
          </div>
        </div>
        <motion.img
          src={img('FbG96reC6tQVfh4Gyqb7sP7iP8s.webp')}
          alt=""
          loading="lazy"
          draggable={false}
          className="h-[359px] w-full flex-none rounded-xl object-cover grayscale-[0.25] md:h-[632px] lg:h-[498px] lg:w-[498px]"
          initial={reduce ? false : { opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ type: 'spring', stiffness: 400, damping: 58, mass: 1 }}
        />
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ Strategic capital (heading above "What you receive") */

function StrategicCapital() {
  const t = useT().strategic
  return (
    <section id="starter" className="flex w-full flex-col items-center">
      <Reveal className="container-site flex max-w-[976px] flex-col gap-[18px] py-20 text-center">
        <h2 className="h-section">
          <Lines lines={t.heading} />
        </h2>
        <p className="lead">
          <Lines lines={t.text} breakClass="max-lg:hidden" />
        </p>
      </Reveal>
    </section>
  )
}

/* ------------------------------------------------------------------ Unica */

function ImageTile({ src, title, className = '' }: { src: string; title: string; className?: string }) {
  return (
    <div className={`relative flex items-end overflow-hidden rounded-[10px] p-6 ${className}`}>
      <img src={img(src)} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      <h3 className="relative font-serif text-[25px] leading-[1.3] font-medium tracking-[-0.03em] text-white capitalize">{title}</h3>
    </div>
  )
}

function SolidTile({ title, dark, icon }: { title: string; dark?: boolean; icon: ReactNode }) {
  return (
    <div className={`flex min-h-[264px] flex-col justify-between rounded-[10px] p-6 ${dark ? 'bg-black text-white' : 'bg-mist text-black'}`}>
      {icon}
      <h3 className="font-serif text-[25px] leading-[1.3] font-medium tracking-[-0.03em] capitalize">{title}</h3>
    </div>
  )
}

function Unica() {
  const t = useT().unica
  return (
    <section className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-16 py-20 md:gap-20">
      <Reveal className="flex flex-col items-center gap-6 px-5 text-center md:px-8">
        <img src={img('vHHQt4UY6Q3oBJUBp4seOcP4MT4.png')} alt="Unica" className="h-16 w-[208px] object-contain" />
        <h2 className="h-section max-w-[710px]">{t.heading}</h2>
        <p className="max-w-[900px] text-lg leading-[1.25] tracking-[-0.03em] md:text-2xl">
          {t.text}
        </p>
      </Reveal>
      <Reveal className="grid w-full grid-cols-1 gap-6 px-5 md:px-8 lg:grid-cols-[1fr_781px]">
        <ImageTile src="K0ikmT6E3zMaNcfqKGDxvgX9rI.webp" title={t.tiles[0]} className="min-h-[360px]" />
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-2.5 md:grid-cols-[497px_1fr]">
            <ImageTile src="L1VfB1p0kykMtLjZsStsnykn3U.webp" title={t.tiles[1]} className="h-[264px]" />
            <SolidTile
              dark
              title={t.tiles[2]}
              icon={
                <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6l-8-3Z" />
                  <path d="m8.5 12 2.5 2.5 4.5-5" />
                </svg>
              }
            />
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_497px]">
            <SolidTile
              title={t.tiles[3]}
              icon={
                <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <circle cx="9" cy="8" r="3.2" />
                  <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
                  <circle cx="17" cy="9" r="2.4" />
                  <path d="M15.5 14.2c3 .2 5.5 2.6 5.5 5.8" />
                </svg>
              }
            />
            <ImageTile src="mOJJwAjQGuH30fbyv74aNYD7Qc.webp" title={t.tiles[4]} className="min-h-[264px]" />
          </div>
        </div>
      </Reveal>
      <Button href="https://www.unica.coffee/features-der-unica-pro/?lang=en">{t.cta}</Button>
    </section>
  )
}

/* ------------------------------------------------------------------ Pour-over */

function PourOver() {
  const t = useT().pourOver
  return (
    <section className="container-site py-20">
      <Reveal className="flex flex-col items-center gap-10 rounded-xl bg-[rgba(156,162,166,0.23)] p-5 md:p-8 lg:flex-row lg:gap-[60px]">
        <div className="relative flex aspect-square w-full flex-col justify-end overflow-hidden rounded-[10px] p-6 lg:w-[472px]">
          <img src={img('jN5iqFGXv6htvHdMrdEk9R6cQQ.png')} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          <p className="relative rounded-[10px] bg-black p-6 font-serif text-[28px] leading-[1.2] font-medium text-white">
            <Lines lines={t.badge} />
          </p>
        </div>
        <div className="flex flex-1 flex-col items-start gap-6">
          <h2 className="h-section">{t.heading}</h2>
          <p className="lead max-w-[800px]">
            {t.text}
          </p>
          <Button href={APPLY_URL}>{t.cta}</Button>
        </div>
      </Reveal>
    </section>
  )
}

/* ------------------------------------------------------------------ Team + map */

function CoreTeam() {
  // Framer node ZcCHo9cFo: text block, heading and paragraph each fade in; ticker and tiles live in <Team>.
  const t = useT().team
  return (
    <section id="team" className="flex w-full flex-col items-center overflow-x-clip">
      <div className="flex w-full flex-col items-center gap-10 px-6 py-20 md:px-8 lg:w-[1200px]">
        <Appear className="flex w-full flex-col items-center gap-6 text-center">
          <Appear className="w-full">
            <h2 className="font-serif text-[30px] leading-[1.2] uppercase md:text-[50px]">
              <Lines lines={t.heading} />
            </h2>
          </Appear>
          <Appear className="w-full">
            <p className="text-2xl leading-[1.35] tracking-[-0.03em] text-ink">{t.text}</p>
          </Appear>
        </Appear>
        <Team layout="ticker" />
        <Button href="/about" className="max-md:w-full">
          {t.cta}
        </Button>
      </div>
    </section>
  )
}

export default function Home() {
  // The hero tiles fade out while this section scrolls into view (Framer scroll target).
  const introRef = useRef<HTMLElement>(null)
  return (
    <>
      <Hero fadeTarget={introRef} />
      <Intro sectionRef={introRef} />
      <OurBrands />
      <Story />
      <Heritage />
      <DigitalEcosystem />
      <Retail />
      <Process />
      <BusinessSchool />
      <StrategicCapital />
      <WhatYouReceive />
      <Unica />
      <PourOver />
      <CoreTeam />
      <WorldMap />
    </>
  )
}
