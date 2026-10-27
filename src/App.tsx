import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Navigation from './components/Navigation'
import CtaSection from './components/CtaSection'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import { basePath, localize, useLocale, useT } from './i18n'

const SITE_ORIGIN = 'https://rasagroup.global'
const TITLE_KEYS = { '/': 'home', '/about': 'about', '/contact': 'contact' } as const

function setMeta(selector: string, content: string) {
  document.querySelector<HTMLMetaElement>(selector)?.setAttribute('content', content)
}

function setLink(selector: string, href: string) {
  document.querySelector<HTMLLinkElement>(selector)?.setAttribute('href', href)
}

// Update SEO head tags and scroll to the #hash target (footer links like /#team) or to the top on page change.
function useScrollOnNavigate() {
  const { pathname, hash } = useLocation()
  const locale = useLocale()
  const { titles, descriptions } = useT()
  useEffect(() => {
    const base = basePath(pathname)
    const key = TITLE_KEYS[base as keyof typeof TITLE_KEYS]
    const title = key ? titles[key] : titles.fallback
    const description = key ? descriptions[key] : descriptions.fallback
    const canonicalPath = key ? localize(base, locale) : pathname
    const canonicalUrl = `${SITE_ORIGIN}${canonicalPath}`
    const enUrl = `${SITE_ORIGIN}${base}`
    const deUrl = `${SITE_ORIGIN}${localize(base, 'de')}`

    document.title = title
    document.documentElement.lang = locale

    setMeta('meta[name="description"]', description)
    setMeta('meta[name="robots"]', key ? 'index, follow' : 'noindex, nofollow')
    setMeta('meta[property="og:title"]', title)
    setMeta('meta[property="og:description"]', description)
    setMeta('meta[property="og:url"]', canonicalUrl)
    setMeta('meta[property="og:locale"]', locale === 'de' ? 'de_DE' : 'en_US')
    setMeta('meta[property="og:locale:alternate"]', locale === 'de' ? 'en_US' : 'de_DE')
    setMeta('meta[name="twitter:title"]', title)
    setMeta('meta[name="twitter:description"]', description)

    setLink('link[rel="canonical"]', canonicalUrl)
    setLink('link[rel="alternate"][hreflang="en"]', enUrl)
    setLink('link[rel="alternate"][hreflang="de"]', deUrl)
    setLink('link[rel="alternate"][hreflang="x-default"]', enUrl)

    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash, locale, titles, descriptions])
}

export default function App() {
  useScrollOnNavigate()
  return (
    <>
      <Navigation />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/de" element={<Home />} />
          <Route path="/de/about" element={<About />} />
          <Route path="/de/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <CtaSection />
      <Footer />
    </>
  )
}
