import { useState } from 'react'
import { LayoutGroup, motion, useReducedMotion } from 'motion/react'
import Button, { APPLY_URL } from './Button'
import Lines from './Lines'
import { useT } from '../i18n'

// Motion values below are taken 1:1 from the published Framer page (node CuJ0YxrUx "Process"):
// the title appear effect, three static "Card/Step" components and the "Product" component.

/** Title appear: opacity 0 → 1 at 50% in view, once. */
const APPEAR = { type: 'spring', stiffness: 400, damping: 58, mass: 1, delay: 0.1 } as const
/** Product variant transition (Front ↔ Variant 2). */
const PRODUCT_SPRING = { type: 'spring', stiffness: 200, damping: 34, mass: 0.1 } as const

const STEP_NUMBERS = ['01.', '02.', '03.']

const PRODUCT_IMAGES = ['117I5kt1OzEmLnjayERcvxGib3c.png', 'bwhdjbM7wJYuxHyBOVxv4pjZO4c.png']

/** Card/Step: number with a vertical connector line, then title and description. */
function Step({ step, line }: { step: { n: string; title: string; text: string }; line: boolean }) {
  return (
    <div className="flex w-full gap-4 overflow-clip md:gap-5">
      <div className="flex flex-none flex-col items-center self-stretch overflow-clip">
        {/* Fixed 38px box with clipping, as in Framer: at 28px the "." of "02." / "03." is cut off. */}
        <div className="flex w-[38px] items-center overflow-clip">
          <span className="font-serif text-xl leading-[1.2] font-medium whitespace-pre text-black md:text-[28px]">{step.n}</span>
        </div>
        {line && <div className="w-0.5 flex-1 bg-black/10" />}
      </div>
      <div className="flex flex-1 flex-col gap-2.5 overflow-clip pb-5">
        <h5 className="font-serif text-2xl leading-[1.2] font-medium [word-break:break-word] text-black md:text-[28px]">
          {step.title}
        </h5>
        <p className="leading-[1.4] [word-break:break-word] text-body">{step.text}</p>
      </div>
    </div>
  )
}

/**
 * Product: the active photo is 452px in front; the other (374px, 50% opacity) peeks out from
 * behind it. Picking the other thumbnail swaps them with a layout animation.
 */
function Product() {
  const showPhoto = useT().process.showPhoto
  const [active, setActive] = useState(0)
  const back = active === 0 ? 1 : 0

  return (
    <LayoutGroup>
      <div className="flex h-full w-full flex-col items-center justify-center gap-[42px] overflow-visible p-20">
        <div className="relative flex w-full items-center justify-center gap-[17px]">
          {PRODUCT_IMAGES.map((src, i) => (
            <motion.img
              key={src}
              layout
              transition={PRODUCT_SPRING}
              src={`/images/${src}`}
              alt={i === active ? 'Rasa × Unica espresso machine' : ''}
              style={{ borderRadius: 12 }}
              animate={{ opacity: i === active ? 1 : 0.5 }}
              className={
                i === active
                  ? 'relative z-[1] aspect-square w-[452px] max-w-none flex-none object-cover'
                  : `absolute top-1/2 z-0 aspect-square w-[374px] max-w-none -translate-y-1/2 object-cover ${
                      i === 1 ? '-right-[187px]' : '-left-[186px]'
                    }`
              }
            />
          ))}
        </div>
        <div className="flex w-full items-center justify-center gap-2.5">
          {PRODUCT_IMAGES.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`${showPhoto} ${i + 1}`}
              aria-pressed={active === i}
              className={`relative p-2 ${i === back ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <img src={`/images/${src}`} alt="" className="h-[110px] w-[110px] rounded-xl object-cover" />
              <motion.span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-[19px] border-solid border-white"
                initial={false}
                animate={{ borderWidth: active === i ? 3 : 0 }}
                transition={PRODUCT_SPRING}
              />
            </button>
          ))}
        </div>
      </div>
    </LayoutGroup>
  )
}

export default function Process() {
  const reduce = useReducedMotion()
  const t = useT().process
  return (
    <section className="relative flex w-full items-center justify-center overflow-clip px-6 pt-[60px] md:px-5 md:pt-20 lg:px-[30px] lg:py-[100px]">
      <img src="/images/CUTCSw36fYB1R44DsAdvVPQJXik.jpeg" alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 z-0 bg-black/20 backdrop-blur-[5px]" />

      <div className="relative z-[1] flex w-full flex-col items-center justify-center gap-2.5 lg:max-w-[1200px] lg:flex-row lg:justify-start">
        <div className="z-[9] flex w-full flex-none flex-col items-start gap-[30px] overflow-clip rounded-xl bg-white px-5 py-[30px] md:items-center md:px-[30px] lg:w-1/2 lg:max-w-[500px] lg:items-start">
          <div className="flex w-full flex-col items-start gap-5 md:items-center lg:items-start">
            <motion.h2
              className="h-section w-full text-center lg:text-left lg:[&:lang(de)]:text-[40px]"
              initial={reduce ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={APPEAR}
            >
              <Lines lines={t.heading} />
            </motion.h2>
            <p className="w-full text-center leading-[1.4] text-body lg:max-w-[500px] lg:text-left">
              {t.text}
            </p>
          </div>
          <div className="flex w-full flex-col items-center gap-2.5 overflow-clip">
            {t.steps.map((step, i) => (
              <Step key={STEP_NUMBERS[i]} step={{ n: STEP_NUMBERS[i], ...step }} line={i < t.steps.length - 1} />
            ))}
          </div>
          <Button href={APPLY_URL} className="w-full md:w-auto">
            {t.cta}
          </Button>
        </div>

        <div className="h-[836px] w-full flex-none scale-[0.8] md:h-[830px] md:scale-100 lg:h-auto lg:w-px lg:flex-1 lg:self-stretch">
          <Product />
        </div>
      </div>
    </section>
  )
}
