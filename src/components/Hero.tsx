import { type RefObject } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useBreakpoint } from '../hooks/useBreakpoint'
import { useScrollTargetProgress } from '../hooks/useScrollTarget'
import { useT } from '../i18n'

// Motion values below are taken 1:1 from the published Framer page (node Vige9lMnM "Hero").

/** Framer "appear" spring used for the nav, the "Taste of Indonesia" row and tile 5. */
const APPEAR = { type: 'spring', stiffness: 400, damping: 58, mass: 1, delay: 0.4 } as const

type Tile = {
  src: string
  /** Framer parallax speed: 100 = moves with the page, 170 = 1.7× faster. */
  speed: number
  aspect: number
  grayscale: number
  /** Tablet (md) and desktop (lg) position; tiles are hidden on phones. */
  className: string
  appear?: boolean
}

const TILES: Tile[] = [
  {
    src: '3DMG36Rn41BYKFPauN3CHNgu9U.jpg',
    speed: 170,
    aspect: 1.29861,
    grayscale: 0.24,
    className: 'md:w-[22%] md:top-[1181px] md:right-[47px] lg:w-[17%] lg:top-[1189px] lg:right-[204px]',
  },
  {
    src: 'vhMiJzq3WZxvScrh4LXVKVY2Oyw.webp',
    speed: 145,
    aspect: 1.5493,
    grayscale: 0.24,
    className: 'md:w-[23%] md:top-[823px] md:right-0 lg:w-[20%] lg:top-[805px] lg:right-[6px]',
  },
  {
    src: 'YApzlIRQn1xRnJ4xBuMEvHLWKvY.webp',
    speed: 160,
    aspect: 1.23596,
    grayscale: 0.24,
    className: 'md:w-[27%] md:top-[1064px] md:left-[88px] lg:w-[20%] lg:top-[1285px] lg:left-[96px]',
  },
  {
    src: 'Vt7OZonxIk9azWUXdWmOqKF9Aoo.webp',
    speed: 170,
    aspect: 1.41667,
    grayscale: 0.24,
    className: 'md:w-[27%] md:top-[1382px] md:right-[195px] lg:w-[17%] lg:top-[1493px] lg:right-[432px]',
  },
  {
    src: 'j7np1X8q73tPkPOHclJb0473JY.webp',
    speed: 125,
    aspect: 1.40426,
    grayscale: 0.29,
    className: 'md:w-[23%] md:top-[700px] md:left-0 lg:w-[18%] lg:top-[732px] lg:left-[6px]',
    appear: true,
  },
]

/** Phone-only ticker (Framer ticker: velocity 40px/s, gap 10px, 200px square tiles). */
const TICKER = [
  'j7np1X8q73tPkPOHclJb0473JY.webp',
  '3DMG36Rn41BYKFPauN3CHNgu9U.jpg',
  'Vt7OZonxIk9azWUXdWmOqKF9Aoo.webp',
  'YApzlIRQn1xRnJ4xBuMEvHLWKvY.webp',
  'vhMiJzq3WZxvScrh4LXVKVY2Oyw.webp',
]
const TICKER_SECONDS = (TICKER.length * (200 + 10)) / 40

/**
 * Framer "transform on scroll target" (threshold 1): opacity goes 1 → 0 while the target
 * section travels from the bottom of the viewport by its own height, then gets spring-smoothed.
 */
/** Tile opacity: 1 → 0 while the intro section enters from the bottom of the viewport. */
function useFadeOutAtTarget(target: RefObject<HTMLElement | null>) {
  const progress = useScrollTargetProgress(target, 1)
  return useTransform(progress, (p) => 1 - p)
}

function ParallaxTile({ tile, fadeTarget }: { tile: Tile; fadeTarget: RefObject<HTMLElement | null> }) {
  const reduceMotion = useReducedMotion()
  const { scrollY } = useScroll()
  // Framer parallax with adjustPosition off: y = -scrollY * (speed / 100 - 1)
  const y = useTransform(scrollY, (v) => (reduceMotion ? 0 : -v * (tile.speed / 100 - 1)))
  const opacity = useFadeOutAtTarget(fadeTarget)

  return (
    <motion.div
      style={{ y, opacity, aspectRatio: tile.aspect }}
      className={`absolute z-[1] hidden will-change-transform md:block ${tile.className}`}
    >
      <motion.img
        src={`/images/${tile.src}`}
        alt=""
        className="h-full w-full rounded-[10px] object-cover"
        style={{ filter: `grayscale(${tile.grayscale})` }}
        initial={tile.appear ? { opacity: 0.001 } : false}
        animate={{ opacity: 1 }}
        transition={APPEAR}
      />
    </motion.div>
  )
}

/**
 * Framer text "appear" effect. Tablet/desktop: per character, blur(10px) + y 10, stagger 0.05s.
 * Phone: per word, no blur, stagger 0.075s. Both use spring { duration: 0.4, bounce: 0 }.
 */
function AnimatedHeadline({ lines }: { lines: string[] }) {
  const isPhone = useBreakpoint() === 'phone'
  const reduceMotion = useReducedMotion()
  let index = 0

  const token = (text: string, key: string) => {
    const delay = index++ * (isPhone ? 0.075 : 0.05)
    if (reduceMotion) return <span key={key}>{text}</span>
    return (
      <motion.span
        key={key}
        className="inline-block"
        initial={{ opacity: 0.001, y: 10, filter: isPhone ? 'blur(0px)' : 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ type: 'spring', duration: 0.4, bounce: 0, delay }}
      >
        {text}
      </motion.span>
    )
  }

  return (
    <h1
      aria-label={lines.join(' ')}
      className="font-serif text-[36px] leading-[1.05] font-medium tracking-[-0.03em] uppercase md:text-[50px] lg:text-[70px]"
    >
      {lines.map((line, l) => (
        <span key={l} aria-hidden className="md:block">
          {line.split(' ').map((word, w) => (
            <span key={w}>
              {w > 0 && ' '}
              <span className="inline-block whitespace-nowrap">
                {isPhone ? token(word, 'w') : [...word].map((ch, c) => token(ch, String(c)))}
              </span>
            </span>
          ))}
          {l < lines.length - 1 && ' '}
        </span>
      ))}
    </h1>
  )
}

function TasteOfIndonesia() {
  const word = 'text-sm leading-[1.25] tracking-[0.36em] uppercase md:text-2xl md:tracking-[0.55em]'
  const fade = { initial: { opacity: 0.001 }, animate: { opacity: 1 }, transition: APPEAR }
  return (
    <p className="flex items-center justify-center gap-[14px] overflow-clip md:gap-6">
      <motion.span {...fade} className={word}>
        Taste
      </motion.span>
      <motion.span
        {...fade}
        className="font-serif text-xs leading-[0.9] font-[425] tracking-[0.06em] capitalize italic md:text-sm"
      >
        OF
      </motion.span>
      <motion.span {...fade} className={word}>
        Indonesia
      </motion.span>
    </p>
  )
}

export default function Hero({ fadeTarget }: { fadeTarget: RefObject<HTMLElement | null> }) {
  const t = useT().hero
  return (
    <section
      id="homepage"
      className="relative mx-auto flex w-full flex-col md:h-[219.146vh] md:flex-row md:items-start md:justify-center md:px-8 lg:h-[228vh] lg:w-[1200px]"
    >
      {/* Invisible scroll target for the slim navigation bar, placed where the About page's image row sits
          (471px down, 400px tall) so the bar slides in at the same moment on every page. */}
      <div id="nav-slide-target" aria-hidden className="pointer-events-none absolute inset-x-0 top-[471px] h-[400px]" />
      <div className="relative z-[1] flex w-full flex-col items-center gap-10 pt-20 pb-[60px] md:sticky md:top-0 md:h-[92.0732vh] md:justify-center md:gap-2.5 md:pt-8 md:pb-0 lg:h-screen">
        <div className="flex w-[200px] scale-[0.8] flex-col items-center gap-1.5 md:hidden">
          <img src="/images/logo-mark.svg" alt="" className="h-9 w-9" />
          <img src="/images/logo-nav.svg" alt="" className="w-[200px]" />
        </div>

        <div className="flex w-full flex-col items-center gap-6 px-5 text-center md:px-0">
          <AnimatedHeadline key={t.headline.join(' ')} lines={t.headline} />
          <TasteOfIndonesia />
        </div>

        <div className="w-full overflow-hidden md:hidden">
          <div className="animate-marquee flex w-max" style={{ ['--marquee-duration' as string]: `${TICKER_SECONDS}s` }}>
            {[...TICKER, ...TICKER].map((src, i) => (
              <img
                key={i}
                src={`/images/${src}`}
                alt=""
                className="mr-2.5 aspect-square w-[200px] shrink-0 rounded-lg object-cover"
                style={{ filter: 'grayscale(0.29)' }}
              />
            ))}
          </div>
        </div>

        {TILES.map((tile) => (
          <ParallaxTile key={tile.src} tile={tile} fadeTarget={fadeTarget} />
        ))}
      </div>
    </section>
  )
}
