import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useLocalePath, useT } from '../i18n'

// Matches the published Framer footer (node mtFnYkfPk, component "Footer"). Its only motion is the code
// override on each link column: hovering a link dims its siblings to 50% (0.2s ease-out).

type FooterLink = { label: string; href: string }

const PAGE_LINKS = ['/#homepage', '/#ourbrand', '/#story', '/#starter', '/#team']
const SOCIAL_LINKS: FooterLink[] = [
  { label: 'rasa kopi', href: 'https://www.instagram.com/rasakopi.coffee/' },
  { label: 'rasa matcha', href: 'https://www.instagram.com/rasamatcha.cafe/' },
  { label: 'rasa indonesia', href: 'https://www.instagram.com/rasaindonesia.resto/' },
  { label: 'rasa group', href: 'https://www.instagram.com/rasagroup.global/' },
]

const linkClass = 'block leading-7 tracking-[-0.03em] whitespace-pre text-[#8a8a8a] uppercase select-none'

function FooterAnchor({ label, href }: FooterLink) {
  const localePath = useLocalePath()
  // No destination yet (Privacy Policy until its text arrives): shown in place, not clickable.
  if (!href) return <span className={linkClass}>{label}</span>
  if (href.startsWith('/')) {
    return (
      <Link to={localePath(href)} className={linkClass}>
        {label}
      </Link>
    )
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
      {label}
    </a>
  )
}

/** Framer override: the hovered link stays at full opacity, its siblings drop to 0.5. */
function DimSiblings({ items }: { items: ReactNode[] }) {
  const [hovered, setHovered] = useState<number | null>(null)
  return (
    <ul className="flex w-min flex-col gap-1.5 overflow-hidden" onMouseLeave={() => setHovered(null)}>
      {items.map((item, i) => (
        <li
          key={i}
          onMouseEnter={() => setHovered(i)}
          className="transition-opacity duration-200 ease-out"
          style={{ opacity: hovered === null || hovered === i ? 1 : 0.5 }}
        >
          {item}
        </li>
      ))}
    </ul>
  )
}

const ICON = { fill: 'none', stroke: 'rgb(143, 141, 136)', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
      <path
        transform="translate(2 2)"
        d="M 16 4.022 L 16 4 M 4 20 L 16 20 C 18.209 20 20 18.209 20 16 L 20 4 C 20 1.791 18.209 0 16 0 L 4 0 C 1.791 0 0 1.791 0 4 L 0 16 C 0 18.209 1.791 20 4 20 Z M 14.444 10 C 14.444 12.455 12.455 14.444 10 14.444 C 7.545 14.444 5.556 12.455 5.556 10 C 5.556 7.545 7.545 5.556 10 5.556 C 12.455 5.556 14.444 7.545 14.444 10 Z"
        {...ICON}
      />
    </svg>
  )
}

function YoutubeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
      <path
        transform="translate(2 5)"
        d="M 0.45 1.993 C 0.579 1.091 1.319 0.415 2.227 0.35 C 4.164 0.212 7.536 0 10 0 C 12.464 0 15.836 0.212 17.773 0.35 C 18.681 0.415 19.421 1.091 19.55 1.993 C 19.749 3.377 20 5.436 20 7 C 20 8.565 19.749 10.623 19.55 12.008 C 19.421 12.909 18.681 13.585 17.773 13.65 C 15.836 13.788 12.464 14 10 14 C 7.536 14 4.164 13.788 2.227 13.65 C 1.319 13.585 0.579 12.909 0.45 12.008 C 0.251 10.623 0 8.565 0 7 C 0 5.436 0.251 3.377 0.45 1.993 Z"
        {...ICON}
      />
      <path transform="translate(10 8.536)" d="M 6 3.464 L 0 6.928 L 0 0 Z" {...ICON} />
    </svg>
  )
}

function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
      <path transform="translate(2 2)" d="M 4 2 C 4 3.105 3.105 4 2 4 C 0.895 4 0 3.105 0 2 C 0 0.895 0.895 0 2 0 C 3.105 0 4 0.895 4 2 Z" {...ICON} />
      <path transform="translate(2 9)" d="M 0 0 L 4 0 L 4 13 L 0 13 Z" {...ICON} />
      <path
        transform="translate(10 9)"
        d="M 0 13 L 4 13 L 4 6 C 4 4.895 4.895 4 6 4 C 7.105 4 8 4.895 8 6 L 8 13 L 12 13 L 12 6 C 12 2.686 9.314 0 6 0 C 2.686 0 0 2.686 0 6 Z"
        {...ICON}
      />
    </svg>
  )
}

export default function Footer() {
  const dict = useT()
  const t = dict.footer
  const localePath = useLocalePath()
  const columns: { title: string; links: FooterLink[] }[] = [
    { title: t.columns[0], links: PAGE_LINKS.map((href, i) => ({ label: t.pages[i], href })) },
    { title: t.columns[1], links: SOCIAL_LINKS },
    {
      title: t.columns[2],
      links: [
        { label: t.contact, href: '/contact' },
        { label: t.imprint, href: '/imprint' },
        // TODO: point to the privacy page (/privacy, /de/datenschutz) once its text is ready.
        { label: t.privacy, href: '' },
      ],
    },
  ]
  return (
    <footer className="flex flex-col items-center overflow-hidden bg-ink px-8">
      <div className="flex w-full max-w-[1600px] flex-col items-center gap-8 pt-10">
        <div className="flex w-full flex-col items-start gap-10 overflow-hidden md:gap-[50px] lg:flex-row lg:justify-center lg:gap-2.5">
          <div className="flex w-full flex-col items-start lg:w-px lg:flex-1">
            <Link to={localePath('/')} aria-label={dict.nav.homeAria}>
              <img src="/images/logo-footer.svg" alt="Rasa Group Global" className="h-12 w-[195px]" />
            </Link>
          </div>
          <div className="grid w-full grid-cols-2 gap-y-20 overflow-hidden md:w-[85%] md:grid-cols-3 lg:w-[45%]">
            {columns.map((col) => (
              <div key={col.title} className="flex flex-col items-start gap-5 self-start overflow-hidden">
                <p className="text-xs leading-4 font-medium tracking-[0.02em] whitespace-pre text-cream/50 uppercase">{col.title}</p>
                <DimSiblings items={col.links.map((link) => <FooterAnchor key={link.label} {...link} />)} />
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex w-full py-8">
          <div className="absolute inset-x-0 top-0 z-[1] h-px bg-white/16" />
          <div className="flex w-full flex-col items-start gap-8 md:flex-row md:items-center md:justify-between md:gap-0">
            {/* One line like Framer when it fits; on narrow tablets it wraps instead of pushing the icons out. */}
            <p className="w-full text-sm leading-5 font-medium tracking-[-0.01em] text-cream uppercase select-none md:w-px md:min-w-0 md:flex-1">
              {t.copyright}
            </p>
            <div className="flex flex-none items-center gap-4">
              <a href="https://www.instagram.com/rasagroup.global/" target="_blank" rel="noopener noreferrer" aria-label="Rasa Group on Instagram">
                <InstagramIcon />
              </a>
              {/* YouTube and LinkedIn have no link on the Framer site yet. */}
              <YoutubeIcon />
              <LinkedinIcon />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
