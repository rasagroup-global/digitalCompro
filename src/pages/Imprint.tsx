import { motion, useReducedMotion } from 'motion/react'
import Appear from '../components/Appear'
import CharReveal from '../components/CharReveal'
import { useT } from '../i18n'

// Imprint (EN /imprint) / Impressum (DE /de/impressum). Same hero as the Contact and About pages: the small
// line fades in on load and the title reveals character by character; the details fade in at 50% in view.

/** Page-load fade used by the hero's small line (spring 400/58, delay 0.4). */
const LOAD = { type: 'spring', stiffness: 400, damping: 58, mass: 1, delay: 0.4 } as const

const PHONE = '+49 1567 8493185'
const EMAIL = 'support@rasakopi.coffee'

export default function Imprint() {
  const t = useT().imprint
  const reduce = useReducedMotion()
  const label = 'text-sm leading-[1.3] font-medium tracking-[0.02em] text-ink/50 uppercase'

  return (
    <section className="flex w-full flex-col items-center px-6 pt-[68px] pb-20 md:px-8 md:pt-[112px] md:pb-[120px]">
      <div className="flex w-full flex-col items-center lg:w-[1136px]">
        <div className="flex w-full flex-col items-center gap-6 pt-[60px] pb-10">
          <div className="flex w-full justify-center overflow-clip">
            <motion.p
              className="leading-[1.25] font-medium tracking-[0.31em] whitespace-pre text-ink uppercase"
              initial={reduce ? false : { opacity: 0.001 }}
              animate={{ opacity: 1 }}
              transition={LOAD}
            >
              Rasa Group Global
            </motion.p>
          </div>
          <CharReveal
            key={t.title}
            as="h1"
            text={t.title}
            className="w-full font-serif text-[40px] leading-[1.05] font-medium tracking-[-0.03em] text-center text-ink uppercase md:text-[58px]"
          />
        </div>

        {/* The slim navigation bar slides in while this block passes the middle of the screen. */}
        <div id="nav-slide-target" className="flex w-full max-w-[720px] flex-col gap-10 pt-10 text-lg leading-[1.5] tracking-[-0.02em] text-ink">
          <Appear className="flex flex-col gap-1">
            <p className="font-medium">Osman Gedik, Rasa Kopi</p>
            <p>Jochbergweg 10, 85748 Garching b. München</p>
          </Appear>

          <Appear className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-1">
              <p className={label}>{t.phone}</p>
              <a href={`tel:${PHONE.replace(/\s/g, '')}`} className="underline-offset-4 hover:underline">
                {PHONE}
              </a>
            </div>
            <div className="flex flex-col gap-1">
              <p className={label}>{t.email}</p>
              <a href={`mailto:${EMAIL}`} className="underline-offset-4 hover:underline">
                {EMAIL}
              </a>
            </div>
            <div className="flex flex-col gap-1">
              <p className={label}>{t.vatId}</p>
              <p>DE450962803</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className={label}>{t.authority}</p>
              <p>BLM</p>
            </div>
          </Appear>

          <Appear className="border-t border-ink/10 pt-10">
            <p>{t.dispute}</p>
          </Appear>
        </div>
      </div>
    </section>
  )
}
