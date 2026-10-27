import { useRef, useState, type MouseEvent, type ReactNode } from 'react'
import { motion, useReducedMotion, useSpring } from 'motion/react'
import { useT } from '../i18n'

// Motion values below are taken 1:1 from the published Framer page (node P21ujuJCj "Brand"):
// the Card-brand component (Front / Back variants) wrapped in the project's Flipcard.tsx override.

/** Flipcard.tsx spring, used for the flip and the hover tilt. */
const FLIP_SPRING = { type: 'spring', stiffness: 300, damping: 40 } as const

type Brand = {
  name: string
  tagline: string
  logo: string
  /** Card-brand "fill" property: background of the Back side. */
  fill: string
  text: string
}

/** Tagline and text come from the dictionary (same order). */
const BRANDS = [
  { name: 'Rasa Matcha', logo: 'D65inQ5bwPd5Bmf7cztOdiZpMo.jpeg', fill: 'rgb(236, 255, 219)' },
  { name: 'Rasa Kopi', logo: 'fQuYa8gTBxrXWBbuNJDpczZxjsM.jpeg', fill: 'rgb(238, 193, 173)' },
  { name: 'Rasa Indonesia', logo: 'm1NLiNFeFjAKvlcj6dS9k6NOlI.jpeg', fill: 'rgb(237, 204, 185)' },
]

const faceClass = 'absolute inset-0 flex flex-col justify-between overflow-hidden rounded-lg p-8 [backface-visibility:hidden]'
const title = 'font-brand text-[28px] leading-[1.4] font-medium uppercase'

function Front({ brand }: { brand: Brand }) {
  const moreInfo = useT().brands.moreInfo
  return (
    <>
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <img src={`/images/${brand.logo}`} alt="" className="h-[129px] w-[129px] rounded-full object-cover" />
      </div>
      <div className="flex w-full flex-col gap-3.5">
        <div className="flex w-full flex-col gap-2 text-center">
          <p className={title}>{brand.name}</p>
          <p className="leading-[1.4] uppercase">{brand.tagline}</p>
        </div>
        <div className="w-full rounded-xl border border-[rgba(156,162,166,0.18)] p-2">
          <p className="text-center text-[13px] leading-[1.4] font-medium tracking-[0.12em] text-[rgb(166,166,166)] uppercase">
            {moreInfo}
          </p>
        </div>
      </div>
    </>
  )
}

function Back({ brand }: { brand: Brand }) {
  return (
    <>
      <img src={`/images/${brand.logo}`} alt="" className="h-[99px] w-[99px] rounded-full object-cover" />
      <p className={`${title} text-left`}>{brand.name}</p>
      <p className="text-left text-sm leading-[1.4] font-medium uppercase">{brand.text}</p>
    </>
  )
}

/**
 * Port of Flipcard.tsx `withClick`: click flips the card 180° on Y; hovering scales it to 1.1
 * and tilts it toward the pointer (rotation factor 20).
 */
function FlipCard({ brand }: { brand: Brand }) {
  const [flipped, setFlipped] = useState(false)
  const t = useT().brands
  const ref = useRef<HTMLDivElement>(null)
  const rotateX = useSpring(0, FLIP_SPRING)
  const rotateY = useSpring(0, FLIP_SPRING)

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = ref.current!.getBoundingClientRect()
    const mouseX = e.clientY - rect.y - rect.height / 2
    const mouseY = e.clientX - rect.x - rect.width / 2
    rotateX.set(-((mouseX / rect.width) * 20))
    rotateY.set((mouseY / rect.height) * 20)
  }
  const onMouseLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
  }

  return (
    <motion.div
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      aria-label={`${brand.name}: ${flipped ? t.showFront : t.moreInfo}`}
      onClick={() => setFlipped((f) => !f)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          setFlipped((f) => !f)
        }
      }}
      className="h-full w-full cursor-pointer outline-none [perspective:1200px] [transform-style:preserve-3d]"
    >
      <motion.div
        ref={ref}
        whileHover={{ scale: 1.1 }}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        transition={FLIP_SPRING}
        style={{ rotateX, rotateY }}
        className="h-full w-full"
      >
        <div className="relative h-full w-full [perspective:1200px] [transform-style:preserve-3d]">
          <motion.div
            animate={{ rotateY: flipped ? -180 : 0 }}
            transition={FLIP_SPRING}
            style={{ zIndex: flipped ? 0 : 1 }}
            className={`${faceClass} bg-[rgb(250,250,250)] text-black`}
            aria-hidden={flipped}
          >
            <Front brand={brand} />
          </motion.div>
          <motion.div
            initial={{ rotateY: 180 }}
            animate={{ rotateY: flipped ? 0 : 180 }}
            transition={FLIP_SPRING}
            style={{ zIndex: flipped ? 1 : 0, backgroundColor: brand.fill }}
            className={`${faceClass} text-black`}
            aria-hidden={!flipped}
          >
            <Back brand={brand} />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}

/** Card-brand appear: from opacity 0 / y 24 once 50% is in view, spring 400/58, delay 0.2s. */
function AppearOnScroll({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ type: 'spring', stiffness: 400, damping: 58, mass: 1, delay: 0.2 }}
      className="h-[340px] w-full md:h-[421px] lg:w-auto lg:flex-1"
    >
      {children}
    </motion.div>
  )
}

export default function OurBrands() {
  const t = useT().brands
  return (
    <section
      id="ourbrand"
      className="mx-auto flex w-full flex-col items-center gap-6 overflow-clip pt-[60px] md:pt-20 lg:w-[1200px]"
    >
      <h2 className="w-[51%] text-center text-xl leading-[1.25] tracking-[-0.03em] uppercase md:text-2xl">{t.heading}</h2>
      <div className="flex w-full flex-col items-center gap-6 px-6 pb-[60px] md:px-8 md:pb-20 lg:flex-row">
        {BRANDS.map((brand, i) => (
          <AppearOnScroll key={brand.name}>
            <FlipCard brand={{ ...brand, ...t.items[i] }} />
          </AppearOnScroll>
        ))}
      </div>
    </section>
  )
}
