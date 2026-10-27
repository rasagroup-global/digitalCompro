import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Navigation from './components/Navigation'
import CtaSection from './components/CtaSection'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import { basePath, useLocale, useT } from './i18n'

const TITLE_KEYS = { '/': 'home', '/about': 'about', '/contact': 'contact' } as const

// Scroll to the #hash target (footer links like /#team) or to the top on page change.
function useScrollOnNavigate() {
  const { pathname, hash } = useLocation()
  const locale = useLocale()
  const titles = useT().titles
  useEffect(() => {
    const key = TITLE_KEYS[basePath(pathname) as keyof typeof TITLE_KEYS]
    document.title = key ? titles[key] : titles.fallback
    document.documentElement.lang = locale
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash, locale, titles])
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
