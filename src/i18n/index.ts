import { useLocation } from 'react-router-dom'
import en from './en'
import de from './de'

// English lives at /, German under /de (/de, /de/about, /de/contact, /de/impressum). The locale comes from the URL.

export type Locale = 'en' | 'de'

const DICTS = { en, de }

/** German pages whose slug differs from the English one (English path → German path without /de). */
const DE_SLUGS: Record<string, string> = { '/imprint': '/impressum' }
const EN_SLUGS = Object.fromEntries(Object.entries(DE_SLUGS).map(([en, de]) => [de, en]))

export function localeOf(pathname: string): Locale {
  return /^\/de(\/|$)/.test(pathname) ? 'de' : 'en'
}

export function useLocale(): Locale {
  return localeOf(useLocation().pathname)
}

/** Copy for the current locale. */
export function useT() {
  return DICTS[useLocale()]
}

/** Prefixes an internal path ("/about", "/#team") with /de for German; external links pass through. */
export function localize(to: string, locale: Locale) {
  if (locale === 'en' || !to.startsWith('/')) return to
  if (to === '/' || to.startsWith('/#')) return '/de' + to.slice(1)
  return '/de' + (DE_SLUGS[to] ?? to)
}

export function useLocalePath() {
  const locale = useLocale()
  return (to: string) => localize(to, locale)
}

/** The current page in the other language (EN / DE switch). */
export function switchLocale(pathname: string, target: Locale) {
  return localize(basePath(pathname), target)
}

/** The English path of a page (/de/impressum → /imprint), e.g. for per-page titles. */
export function basePath(pathname: string) {
  if (localeOf(pathname) === 'en') return pathname || '/'
  const rest = pathname.replace(/^\/de/, '') || '/'
  return EN_SLUGS[rest] ?? rest
}
