import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import CharReveal from '../components/CharReveal'
import { useLocalePath, useT } from '../i18n'

// Motion values below are taken 1:1 from the published Framer page (node hH5_C23iU "Contact"): "Contact us"
// fades in on load, the title reveals character by character, and the form grid rises 80px from 90% scale
// (2s ease-out, delay 0.1). The slim navigation bar slides in while the grid passes the middle of the screen.

// Framer form settings (node PuQe5WE59): send to Email, redirect Home, basic antispam. Framer's own form
// service doesn't come with the export, so submissions are emailed through FormSubmit (formsubmit.co).
// To change who receives the messages, edit `to` below.
const EMAIL = {
  to: 'access@rasagroup.global',
  from_name: 'Contact Us',
  subject: 'New Submission',
  intro: 'You’ve just received a new submission.',
}

type Status = 'idle' | 'sending' | 'sent' | 'error'

/** Field names are the keys in the email (kept in English); labels and placeholders come from the dictionary. */
const FIELDS = [
  { name: 'Name', type: 'text', autoComplete: 'name' },
  { name: 'Email', type: 'email', autoComplete: 'email' },
  { name: 'Phone number', type: 'tel', autoComplete: 'tel' },
  { name: 'Subject', type: 'text', autoComplete: 'off' },
] as const
const ROWS = [FIELDS.slice(0, 2).map((f, i) => ({ ...f, i })), FIELDS.slice(2).map((f, i) => ({ ...f, i: i + 2 }))]

/** Framer form input: #242424, 10px radius, white border fading in on focus (0.3s). */
const inputClass =
  'w-full rounded-[10px] border border-transparent bg-[#242424] p-3 text-base leading-[1.2] font-medium text-white outline-none placeholder:text-white/18 transition-[border-color] duration-300 ease-[cubic-bezier(0.44,0,0.56,1)] focus:border-white autofill:shadow-[inset_0_0_0_1000px_#242424] autofill:[-webkit-text-fill-color:#fff]'
const labelText = 'text-sm leading-[1.3] font-medium whitespace-pre text-white/38'

/** Conic gradient masked to a ring, spinning once per second (the Framer "Loading" spinner). */
function Spinner() {
  return (
    <motion.span
      aria-hidden
      className="block h-5 w-5 rounded-full"
      style={{
        background: 'conic-gradient(from 0deg at 50% 50%, rgba(0,0,0,0) 7.2deg, rgb(255,255,255) 342deg)',
        mask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 2px))',
        WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 2px))',
      }}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, ease: 'linear', repeat: Infinity }}
    />
  )
}

/** The "Button Contact" component with its Loading / Success / Error variants. */
function SubmitButton({ status }: { status: Status }) {
  const t = useT().contact
  const bg = { idle: 'rgb(255, 255, 255)', sending: 'rgb(71, 71, 71)', sent: 'rgb(255, 255, 255)', error: 'rgba(255, 34, 68, 0.15)' }[status]
  const idle = status === 'idle'
  return (
    <motion.button
      type="submit"
      disabled={status === 'sending'}
      className={`flex h-[46px] w-full items-center justify-center rounded-[50px] px-[30px] py-3.5 ${idle ? 'cursor-pointer' : ''}`}
      initial={false}
      animate={{ backgroundColor: bg }}
      whileHover={idle ? { backgroundColor: 'rgb(138, 138, 138)' } : undefined}
      whileTap={idle ? { backgroundColor: 'rgb(71, 71, 71)' } : undefined}
      transition={{ type: 'tween', duration: 0.2, ease: [0.44, 0, 0.56, 1] }}
    >
      {status === 'sending' ? (
        <Spinner />
      ) : (
        <span
          className={`text-sm leading-[1.3] font-medium whitespace-pre select-none ${
            status === 'error' ? 'text-[rgb(255,34,68)]' : status === 'sent' ? 'text-[rgb(13,13,13)]' : 'text-ink'
          }`}
        >
          {status === 'error' ? t.error : status === 'sent' ? t.sent : t.submit}
        </span>
      )}
    </motion.button>
  )
}

export default function Contact() {
  const [status, setStatus] = useState<Status>('idle')
  const navigate = useNavigate()
  const localePath = useLocalePath()
  const t = useT().contact
  const reduce = useReducedMotion()

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const fields = Object.fromEntries(new FormData(form)) as Record<string, string>
    // Basic antispam: bots fill the hidden "botcheck" field, people never see it.
    if (fields.botcheck) return
    setStatus('sending')
    try {
      const answers = { ...fields }
      delete answers.botcheck
      const res = await fetch(`https://formsubmit.co/ajax/${EMAIL.to}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: EMAIL.subject,
          _template: 'table',
          _captcha: 'false',
          _replyto: answers.Email,
          'About this email': `${EMAIL.intro} (${EMAIL.from_name})`,
          ...answers,
        }),
      })
      const result = (await res.json().catch(() => null)) as { success?: boolean | string; message?: string } | null
      // e.g. "This form needs Activation…" until the recipient clicks the link FormSubmit emails them once.
      if (!res.ok || String(result?.success) !== 'true') throw new Error(result?.message ?? `HTTP ${res.status}`)
      form.reset()
      setStatus('sent')
      // Framer redirects to the home page after a successful submission.
      window.setTimeout(() => navigate(localePath('/')), 1200)
    } catch (err) {
      console.error('Contact form was not delivered:', err instanceof Error ? err.message : err)
      setStatus('error')
    }
  }

  return (
    <section className="flex w-full flex-col items-center px-6 pt-[68px] pb-[60px] md:px-8 md:pt-[112px]">
      <div className="flex w-full flex-col lg:w-[1136px]">
        {/* Hero text (the full navigation bar sits above it in the page flow). */}
        <div className="flex w-full flex-col items-center gap-6 pt-[60px] pb-10">
          <div className="flex w-full justify-center overflow-clip">
            <motion.p
              className="leading-[1.25] font-medium tracking-[0.31em] whitespace-pre text-ink uppercase"
              initial={reduce ? false : { opacity: 0.001 }}
              animate={{ opacity: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 58, mass: 1, delay: 0.4 }}
            >
              {t.eyebrow}
            </motion.p>
          </div>
          <CharReveal
            as="h1"
            key={t.title}
            text={t.title}
            className="w-full font-serif text-[40px] leading-[1.05] font-medium tracking-[-0.03em] text-center text-ink uppercase md:text-[58px]"
          />
        </div>

        <motion.div
          id="nav-slide-target"
          className="flex w-full flex-col gap-[50px] rounded-3xl bg-ink p-7 md:grid md:grid-cols-2 md:gap-x-6 md:p-10 lg:gap-x-[50px] lg:p-[50px]"
          initial={reduce ? false : { opacity: 0.001, scale: 0.9, y: 80 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'tween', duration: 2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          {/* Photo: fills the column on desktop, sticky on tablet, below the form on phone. */}
          <div className="order-1 flex h-[271px] w-full md:order-none md:h-full lg:overflow-clip lg:rounded-[20px]">
            <img
              src="/images/SoxEdt82bg6noiw3EsXtqVc48A.jpeg"
              alt="About image"
              className="sticky top-20 z-[1] h-full w-full rounded-[20px] object-cover md:h-[49%] lg:static lg:h-full lg:rounded-none"
            />
          </div>

          <div className="flex w-full flex-col items-start gap-10 overflow-clip md:h-full">
            <h2 className="w-full font-serif text-[46px] leading-[1.2] text-balance text-white">{t.heading}</h2>
            <form onSubmit={onSubmit} className="flex w-full flex-col gap-5 overflow-hidden">
              <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
              {ROWS.map((row, r) => (
                <div key={r} className="flex w-full flex-col gap-5 lg:grid lg:grid-cols-2">
                  {row.map((f) => (
                    <label key={f.name} className="flex w-full flex-col gap-2.5">
                      <span className={labelText}>{t.fields[f.i].label}</span>
                      <input
                        required
                        name={f.name}
                        type={f.type}
                        placeholder={t.fields[f.i].placeholder}
                        autoComplete={f.autoComplete}
                        className={`${inputClass} h-[50px]`}
                      />
                    </label>
                  ))}
                </div>
              ))}
              <label className="flex w-full flex-col gap-2.5">
                <span className={labelText}>{t.message.label}</span>
                <textarea name="Message" placeholder={t.message.placeholder} className={`${inputClass} min-h-[100px] resize-y`} />
              </label>
              <SubmitButton status={status} />
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
