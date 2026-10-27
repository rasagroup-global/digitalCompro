import { useLocation } from 'react-router-dom'
import en from './en'
import de from './de'

// English lives at /, German under /de (/de, /de/about, /de/contact). The locale comes from the URL.

export type Locale = 'en' | 'de'

const DICTS = { en, de }

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
  return '/de' + to
}

export function useLocalePath() {
  const locale = useLocale()
  return (to: string) => localize(to, locale)
}

/** The current page in the other language (EN / DE switch). */
export function switchLocale(pathname: string, target: Locale) {
  return localize(pathname.replace(/^\/de(?=\/|$)/, '') || '/', target)
}

/** Page path without the /de prefix, e.g. for per-page titles. */
export function basePath(pathname: string) {
  return pathname.replace(/^\/de(?=\/|$)/, '') || '/'
}
