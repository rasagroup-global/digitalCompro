import Button from '../components/Button'
import { useT } from '../i18n'

export default function NotFound() {
  const t = useT().notFound
  return (
    <section className="container-site flex min-h-[70vh] flex-col items-center justify-center gap-6 pt-[140px] pb-20 text-center">
      <p className="eyebrow">404</p>
      <h1 className="h-section">{t.title}</h1>
      <Button href="/">{t.back}</Button>
    </section>
  )
}
