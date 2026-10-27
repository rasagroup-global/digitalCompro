import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useLocalePath } from '../i18n'

export const APPLY_URL = 'https://franchise.rasagroup.global/apply-now/'

type Variant = 'dark' | 'light'

const VARIANTS: Record<Variant, string> = {
  // Base "Button" variant: Satoshi regular 16px.
  dark: 'bg-black text-base font-normal text-white hover:bg-[rgb(54,54,54)]',
  // "Button Light 2": white, turns near-black with white text on hover.
  light: 'bg-white text-base font-medium text-ink hover:bg-[rgb(10,10,10)] hover:text-white',
}

type Props = {
  href: string
  children: ReactNode
  variant?: Variant
  className?: string
}

export default function Button({ href, children, variant = 'dark', className = '' }: Props) {
  // Internal links stay in the current language (/about → /de/about on German pages).
  const localePath = useLocalePath()
  const classes = `group inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-lg px-8 py-3.5 leading-6 uppercase transition-colors duration-300 ${VARIANTS[variant]} ${className}`
  const label = (
    <span className="relative block overflow-hidden">
      <span className="block transition-transform duration-300 group-hover:-translate-y-full">{children}</span>
      <span aria-hidden className="absolute inset-0 block translate-y-full transition-transform duration-300 group-hover:translate-y-0">
        {children}
      </span>
    </span>
  )

  if (href.startsWith('/')) {
    return (
      <Link to={localePath(href)} className={classes}>
        {label}
      </Link>
    )
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
      {label}
    </a>
  )
}
