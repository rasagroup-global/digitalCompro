import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useInView } from 'motion/react'
import { TEAM, type TeamMember } from '../data/team'
import { useBreakpoint } from '../hooks/useBreakpoint'
import Ticker from './Ticker'
import Appear from './Appear'
import { useT } from '../i18n'

// Motion values below are taken 1:1 from the published Framer page (node ZcCHo9cFo "Team"): the Framer
// Ticker, the "Project tile" component (variant "Mobile" with hover; on phone "Default" ↔ "Hover Section"
// once a tile is fully in view) and the "Detail Team" overlay that slides in from the right.

/** Tile hover transition (Framer tween, ease [.5, 0, .88, .77]). */
const HOVER = { type: 'tween', duration: 0.25, ease: [0.5, 0, 0.88, 0.77] } as const
/** Phone "Hover Section" text block entrance. */
const REVEAL = { type: 'spring', stiffness: 230, damping: 30, mass: 1 } as const
/** Overlay panel in/out. */
const PANEL = { type: 'spring', stiffness: 200, damping: 24, mass: 1 } as const


function Arrow({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" className="h-10 w-10" aria-hidden>
      <motion.path
        d="M 13 0 L 0 13 M 13 0 L 3 0 M 13 0 L 13 10"
        transform="translate(5.5 5.5)"
        fill="none"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={false}
        animate={{ stroke: color }}
        transition={HOVER}
      />
    </svg>
  )
}

/** Name, role and hook shown over the photo. */
function TileText({ member }: { member: TeamMember }) {
  const label = 'font-sans text-sm leading-[1.2] font-medium tracking-[-0.01em] text-white/60 uppercase'
  return (
    <div className="flex w-full flex-col gap-2.5">
      <p className="font-serif text-lg leading-[1.2] font-bold tracking-[-0.01em] text-white uppercase">{member.name}</p>
      <p className={label}>{member.role}</p>
      <p className={label}>{member.hook}</p>
    </div>
  )
}

/**
 * The "Project tile" component. `hover`: photo dims, the arrow and text slide in on hover (tablet/desktop).
 * `scroll`: the same reveal plays while the tile is fully in view (phone).
 */
function TeamTile({
  member,
  mode,
  onOpen,
  className = '',
  copy = false,
}: {
  member: TeamMember
  mode: 'hover' | 'scroll'
  onOpen: () => void
  className?: string
  /** Ticker duplicate: still hoverable and clickable, but skipped by keyboard and screen readers. */
  copy?: boolean
}) {
  const ref = useRef<HTMLButtonElement>(null)
  const t = useT().team
  const [hovered, setHovered] = useState(false)
  const inView = useInView(ref, { amount: 1 })
  const active = mode === 'hover' ? hovered : inView

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={onOpen}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className={`flex flex-col gap-[15px] overflow-hidden text-left ${mode === 'hover' ? 'cursor-pointer' : ''} ${className}`}
      aria-label={`${t.readMore} ${member.name}`}
      tabIndex={copy ? -1 : undefined}
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-[10px]">
        <motion.img
          src={member.image}
          alt=""
          loading="lazy"
          draggable={false}
          className="h-full w-full rounded-lg object-cover"
          initial={false}
          animate={{ filter: active ? 'brightness(0.5)' : 'brightness(1)' }}
          transition={HOVER}
        />
        {mode === 'hover' ? (
          // Sits 80px below the photo and slides up to the bottom edge on hover.
          <motion.div
            className="absolute inset-x-0 top-0 z-[1] flex flex-col items-end justify-between p-6"
            initial={false}
            animate={{ bottom: hovered ? 0 : -80 }}
            transition={HOVER}
          >
            <Arrow color={hovered ? 'rgb(255,255,255)' : 'rgba(255,255,255,0)'} />
            <motion.div className="w-full" initial={false} animate={{ opacity: hovered ? 1 : 0 }} transition={HOVER}>
              <TileText member={member} />
            </motion.div>
          </motion.div>
        ) : (
          inView && (
            <motion.div
              className="absolute inset-0 z-[1] flex flex-col items-end justify-between p-6"
              initial={{ opacity: 0.001, y: 150 }}
              animate={{ opacity: 1, y: 0 }}
              transition={REVEAL}
            >
              <Arrow color="rgb(255,255,255)" />
              <TileText member={member} />
            </motion.div>
          )
        )}
      </div>
      <div className="flex w-full items-start gap-2.5 text-xs leading-[1.2] font-medium tracking-[-0.01em] uppercase">
        <p className="w-1/2 max-w-1/2 text-[rgba(15,15,15,0.6)] opacity-80">{member.role}</p>
        <div className="flex flex-1 justify-end self-stretch">
          <p className="max-w-full text-right text-ink">{member.name}</p>
        </div>
      </div>
    </motion.button>
  )
}

/** The "Detail Team" overlay: dark panel sliding in from the right, full screen on phone. */
function TeamDetail({ member, onClose }: { member: TeamMember; onClose: () => void }) {
  const bp = useBreakpoint()
  const phone = bp === 'phone'
  const closeLabel = useT().team.close

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <>
      <motion.div
        className="fixed inset-0 z-[60] bg-black/80 select-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0 } }}
        exit={{ opacity: 0, transition: { type: 'spring', stiffness: 240, damping: 35, mass: 1 } }}
      />
      <div className="fixed inset-x-0 top-0 z-[61] flex h-screen justify-end overflow-clip" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="team-detail-name"
          className={`relative flex h-screen bg-ink [scrollbar-width:none] ${
            phone ? 'w-full flex-col gap-8 overflow-auto px-8 pt-[100px] pb-20' : `w-[738px] flex-row items-start gap-8 px-8 pt-[100px] pb-10 ${bp === 'tablet' ? 'overflow-auto' : 'overflow-clip'}`
          }`}
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          transition={PANEL}
        >
          <motion.button
            type="button"
            onClick={onClose}
            className="absolute top-8 right-8 z-[1] rounded-lg border border-[rgba(110,110,110,0.18)] bg-white px-5 py-2.5 font-mono text-xs leading-[1.2] font-medium tracking-[-0.01em] text-ink uppercase"
            whileHover={{ scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30, mass: 1 }}
          >
            {closeLabel}
          </motion.button>
          <div className={`z-[1] flex flex-none flex-col items-center gap-6 overflow-clip ${phone ? 'w-full' : 'w-[234px]'}`}>
            <img src={member.image} alt={member.name} className="aspect-[0.985] w-full rounded-xl object-cover" />
            <div className="flex w-full flex-col gap-2">
              <p id="team-detail-name" className="font-serif text-2xl leading-[1.1] tracking-[-0.04em] text-white">
                {member.name}
              </p>
              <p className="text-base leading-[1.6] tracking-[-0.02em] text-[rgb(155,161,165)]">{member.role}</p>
            </div>
          </div>
          <div className={phone ? 'w-full' : 'flex h-full w-px flex-1 flex-col self-stretch overflow-auto [scrollbar-width:none]'}>
            <div className="flex w-full flex-col gap-6">
              <h3 className="font-serif text-[32px] leading-[1.1] font-medium tracking-[-0.04em] text-white">{member.title}</h3>
              <div
                className="flex flex-col gap-4 text-base leading-[1.6] tracking-[-0.02em] text-[#c9c9c9] [&_li]:ml-5 [&_li]:list-disc [&_li]:pl-1 [&_strong]:font-bold"
                dangerouslySetInnerHTML={{ __html: member.bioHtml }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </>
  )
}

/** Team members as a ticker (home) or a 3-column grid (about). On phone both become a list. */
export default function Team({ layout }: { layout: 'ticker' | 'grid' }) {
  const [active, setActive] = useState<TeamMember | null>(null)
  const phone = useBreakpoint() === 'phone'
  const mode = phone ? 'scroll' : 'hover'

  const tiles = (className: string, copy = false) =>
    TEAM.map((m) => (
      <TeamTile key={m.slug} member={m} mode={mode} onOpen={() => setActive(m)} className={className} copy={copy} />
    ))

  return (
    <>
      {layout === 'grid' ? (
        // About page: 3 / 2 / 1 columns; on tablet and desktop every tile fades in at 50% in view.
        <div className="grid w-full grid-cols-1 gap-x-5 gap-y-[42px] md:grid-cols-2 lg:w-[1136px] lg:grid-cols-3">
          {phone
            ? tiles('w-full')
            : TEAM.map((m) => (
                // Tiles keep the component's 342px width and sit at the start of their column.
                <Appear key={m.slug} className="self-start justify-self-start">
                  <TeamTile member={m} mode={mode} onOpen={() => setActive(m)} className="w-[342px]" />
                </Appear>
              ))}
        </div>
      ) : phone ? (
        <div className="flex w-full flex-col gap-8">{tiles('w-full')}</div>
      ) : (
        <Ticker itemGap={20} className="rounded-[10px]">
          {(copy) => tiles('w-[342px] flex-none', copy)}
        </Ticker>
      )}
      {createPortal(
        <AnimatePresence>{active && <TeamDetail key={active.slug} member={active} onClose={() => setActive(null)} />}</AnimatePresence>,
        document.body,
      )}
    </>
  )
}
