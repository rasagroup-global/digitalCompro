import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, useReducedMotion, useTransform } from 'motion/react'
import RasaMark from './RasaMark'
import { useBreakpoint } from '../hooks/useBreakpoint'
import { switchLocale, useLocale, useLocalePath, useT } from '../i18n'
import { useScrollTargetProgress } from '../hooks/useScrollTarget'

// Motion values below are taken 1:1 from the published Framer site (component "Navigation", About page
// setup, used on every page): the full bar slides in on load and scrolls away with the page; a slim bar
// (EN / DE / Menu; logo + menu on phone) slides in from above later and opens the menu.

/** Bar entrance on page load. */
const APPEAR = { type: 'spring', stiffness: 400, damping: 58, mass: 1, delay: 0.4 } as const
/** Component default transition (menu button colours, Menu ↔ Close label, pill hover). */
const SPRING = { type: 'spring', stiffness: 500, damping: 60, mass: 1 } as const
const BUTTON_HOVER = { type: 'spring', stiffness: 400, damping: 30, mass: 1 } as const
/** Grey menu background: drops in, and waits 0.2s before lifting on close. */
const BG_OPEN = { type: 'tween', duration: 0.7, ease: [0.44, 0, 0.56, 1] } as const
const BG_CLOSE = { ...BG_OPEN, delay: 0.2 } as const
/** Pills fade in one after another (About first) and fade out together. */
const PILL_DELAYS = [0.45, 0.4, 0.5]
const PILL_IN = { type: 'tween', duration: 1.1, ease: [0.12, 0.23, 0.5, 1] } as const
const PILL_OUT = { type: 'tween', duration: 0.45, ease: [0.5, 0, 0.88, 0.77] } as const

const INK = 'rgb(16, 16, 16)'
const PAGES = ['/', '/about', '/contact']

/** Component variants: Desktop, "Variant 5" (slim: EN / DE / Menu only), Tablet, Mobile. */
type Kind = 'desktop' | 'slim' | 'tablet' | 'mobile'

function MenuPill({ label, to, index, open, stacked }: { label: string; to: string; index: number; open: boolean; stacked: boolean }) {
  return (
    <motion.div
      className={`relative z-[1] flex-1 ${stacked ? 'h-px w-full' : 'h-full w-px'}`}
      initial={false}
      animate={{ opacity: open ? 1 : 0 }}
      transition={open ? { ...PILL_IN, delay: PILL_DELAYS[index] } : PILL_OUT}
    >
      <motion.div className="h-full w-full" initial="rest" whileHover="hover" animate="rest">
        <Link to={to} tabIndex={open ? undefined : -1} className="block h-full w-full">
          <motion.span
            className="flex h-full w-full items-center justify-center rounded-[1000px] border border-ink"
            variants={{ rest: { backgroundColor: 'rgba(16, 16, 16, 0)' }, hover: { backgroundColor: INK } }}
            transition={SPRING}
          >
            {/* Framer asks for "Libre Caslon Condensed" but never loads it, so the live site shows the
                browser's default sans-serif; this matches what visitors see. */}
            <motion.span
              className="font-[sans-serif] text-[76px] leading-[0.95] tracking-[-0.03em] whitespace-pre [&:lang(de)]:text-[min(76px,6.6vw)]"
              variants={{ rest: { color: INK }, hover: { color: 'rgb(247, 242, 237)' } }}
              transition={SPRING}
            >
              {label}
            </motion.span>
          </motion.span>
        </Link>
      </motion.div>
    </motion.div>
  )
}

function Bar({
  kind,
  open = false,
  onToggle,
  slimPadding = 50,
}: {
  kind: Kind
  open?: boolean
  onToggle?: () => void
  /** Side padding of the slim bar (the About page uses 24px on tablet). */
  slimPadding?: number
}) {
  // Opening the slim bar switches it to the full layout ("Variant 6").
  const layout: Kind = kind === 'slim' && open ? 'desktop' : kind
  const slim = layout === 'slim'
  const stacked = layout === 'tablet' || layout === 'mobile'
  const spacer = layout === 'desktop' ? 'h-[50px] w-[50px]' : 'h-6 w-6'
  const closedButton = kind === 'slim' || kind === 'mobile' ? 'rgb(255, 255, 255)' : 'rgba(0, 0, 0, 0)'
  const t = useT().nav
  const locale = useLocale()
  const localePath = useLocalePath()
  const { pathname } = useLocation()
  const small = 'font-sans text-xs leading-[1.2] font-medium tracking-[-0.01em] uppercase'

  return (
    <div
      className="pointer-events-none relative flex w-full items-center justify-between pb-3"
      style={{
        paddingInline: slim ? slimPadding : undefined,
        background: slim ? 'rgba(0, 0, 0, 0)' : 'linear-gradient(180deg, rgb(255, 255, 255) -24%, rgba(255, 255, 255, 0) 100%)' }}
    >
      {!slim && <div className={`flex-none ${spacer}`} />}

      {/* Menu: grey background dropping from the top and the three pills. */}
      <div
        id={onToggle ? 'site-menu' : undefined}
        className={`absolute top-0 left-0 z-[1] flex h-screen w-full pt-[150px] pb-[50px] ${
          stacked ? 'flex-col gap-6 px-6' : 'flex-row gap-8 px-[50px]'
        } ${open ? 'pointer-events-auto' : ''}`}
      >
        <motion.div
          className="absolute inset-x-0 z-[1] bg-[rgb(181,181,181)]"
          initial={false}
          animate={open ? { top: 0, height: '100%' } : { top: -200, height: '10%' }}
          transition={open ? BG_OPEN : BG_CLOSE}
        />
        {PAGES.map((to, i) => (
          <MenuPill key={to} label={t.pages[i]} to={localePath(to)} index={i} open={open} stacked={stacked} />
        ))}
      </div>

      <div className={`relative z-[7] flex w-px flex-1 items-start pt-5 ${slim ? 'justify-end' : 'justify-between'}`}>
        {!slim && layout !== 'mobile' && (
          <div className={`flex items-center gap-8 text-ink ${small}`}>
            <p>®2026</p>
            <p>rasa Group Global</p>
          </div>
        )}
        {!slim && (
          <Link to={localePath('/')} aria-label={t.homeAria} className="pointer-events-auto">
            {layout === 'mobile' ? (
              <RasaMark className="h-9 w-9" />
            ) : (
              <span className="relative block h-20 w-[200px]">
                <RasaMark className="absolute top-0 left-[82px] h-9 w-9" />
                <img src="/images/logo-nav.svg" alt="Rasa Group Global" className="absolute top-[43px] left-0 h-[22px] w-[200px]" />
              </span>
            )}
          </Link>
        )}
        <div className="pointer-events-auto flex items-center gap-3.5">
          <div className={`flex w-20 items-center justify-center gap-6 ${small}`}>
            {(['en', 'de'] as const).map((lang) => (
              <Link
                key={lang}
                to={switchLocale(pathname, lang)}
                hrefLang={lang}
                aria-current={locale === lang ? 'true' : undefined}
                className={locale === lang ? 'text-black' : 'text-[#8a8a8a]'}
              >
                {lang.toUpperCase()}
              </Link>
            ))}
          </div>
          <motion.button
            type="button"
            onClick={onToggle}
            aria-expanded={onToggle ? open : undefined}
            aria-controls={onToggle ? 'site-menu' : undefined}
            className="relative cursor-pointer rounded-lg px-5 shadow-[inset_0_0_0_1px_rgba(110,110,110,0.18)] py-2.5 font-mono text-xs leading-[1.2] font-medium tracking-[-0.01em] uppercase"
            initial={false}
            animate={{ backgroundColor: open ? INK : closedButton }}
            whileHover={{ scale: 1.1, transition: BUTTON_HOVER }}
            transition={SPRING}
          >
            <motion.span className="block text-ink" initial={false} animate={{ opacity: open ? 0 : 1 }} transition={SPRING}>
              {t.menu}
            </motion.span>
            <motion.span
              aria-hidden
              className="absolute top-1/2 left-0 w-full -translate-y-1/2 text-center text-white"
              initial={false}
              animate={{ opacity: open ? 1 : 0 }}
              transition={SPRING}
            >
              {t.close}
            </motion.span>
          </motion.button>
        </div>
      </div>

      {!slim && <div className={`flex-none ${spacer}`} />}
    </div>
  )
}

export default function Navigation() {
  const bp = useBreakpoint()
  const reduce = useReducedMotion()
  const [open, setOpen] = useState<'full' | 'slim' | null>(null)
  const { pathname } = useLocation()

  // Every page uses the Framer About setup: the full bar sits at the top of the page and scrolls away
  // with it; the slim bar slides down from y -67 while the page's target (#nav-slide-target: the hero's
  // "Taste" word on Home, the image ticker on About, the form card on Contact) passes 50% of the viewport.
  const slide = useScrollTargetProgress('nav-slide-target', 0.5)
  const slideY = useTransform(slide, (p) => -67 + 67 * p)

  useEffect(() => setOpen(null), [pathname])

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(null)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const toggle = (bar: 'full' | 'slim') => () => setOpen((o) => (o === bar ? null : bar))

  return (
    <>
      <motion.header
        className="pointer-events-none absolute inset-x-0 top-0 z-50"
        initial={reduce ? false : { opacity: 0.001, y: -51 }}
        animate={{ opacity: 1, y: 0 }}
        transition={APPEAR}
      >
        <nav aria-label="Main">
          <Bar kind={bp === 'phone' ? 'mobile' : bp} open={open === 'full'} onToggle={toggle('full')} />
        </nav>
      </motion.header>
      <motion.div className="pointer-events-none fixed inset-x-0 top-0 z-[51]" style={{ y: slideY }}>
        <Bar
          kind={bp === 'phone' ? 'mobile' : 'slim'}
          slimPadding={bp === 'tablet' ? 24 : 50}
          open={open === 'slim'}
          onToggle={toggle('slim')}
        />
      </motion.div>
    </>
  )
}
