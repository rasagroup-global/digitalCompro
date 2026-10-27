import Appear from './Appear'
import { useBreakpoint } from '../hooks/useBreakpoint'
import { useT } from '../i18n'
import Lines from './Lines'

// Motion values below are taken 1:1 from the published Framer page (node DsCT6SdOh "Gastro Business
// School", card row JmnC8eun7, component "Card Business School"). Heading and paragraph fade in at 50%
// in view; on tablet/desktop the whole card row fades in, on phone every card fades in on its own.

/** Card photos; title and text come from the dictionary (same order). */
const CARD_IMAGES: { image: string; position?: string }[] = [
  { image: 'Qujc0D3OqxhRD7BoiXzVLiazY8.jpg' },
  { image: 'gYoIwnHFKE2g43jD27LkBWw94.jpg', position: '51.4% 69.7%' },
  { image: '8Be9PXjFLf0a5XqBEgvtai3bigE.jpg' },
]

type CardCopy = { title: string; text: string; image: string; position?: string }

/** Handshake icon from the component (24 × 22). */
function HandshakeIcon() {
  const stroke = { fill: 'none', stroke: 'rgb(0,0,0)', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const
  return (
    <svg viewBox="0 0 24 21.746" width={24} height={22} overflow="visible" aria-hidden>
      <path d="M 10.8 16.8 L 13.2 19.2 C 14.194 20.194 15.806 20.194 16.8 19.2 C 17.794 18.206 17.794 16.594 16.8 15.6" {...stroke} />
      <path
        d="M 14.546 13.201 L 17.546 16.201 C 18.54 17.195 20.151 17.195 21.146 16.201 C 22.14 15.207 22.14 13.595 21.146 12.601 L 16.49 7.945 C 15.084 6.541 12.807 6.541 11.402 7.945 L 10.346 9.001 C 9.351 9.995 7.74 9.995 6.746 9.001 C 5.751 8.007 5.751 6.395 6.746 5.401 L 10.118 2.029 C 12.37 -0.217 15.86 -0.648 18.59 0.985 L 19.154 1.321 C 19.665 1.629 20.272 1.736 20.858 1.621 L 22.946 1.201"
        {...stroke}
      />
      <path
        d="M 22.8 0 L 24 13.2 L 21.6 13.2 M 1.2 0 L 0 13.2 L 7.8 21 C 8.794 21.994 10.406 21.994 11.4 21 C 12.394 20.006 12.394 18.394 11.4 17.4 M 1.2 1.2 L 10.8 1.2"
        {...stroke}
      />
    </svg>
  )
}

/** The "Card Business School" component: photo, floating icon tile, title and text. */
function Card({ card }: { card: CardCopy }) {
  return (
    <div className="flex h-full w-full flex-col items-center overflow-clip rounded-[10px] bg-white shadow-[0_0_16px_0_rgba(0,0,0,0.14)]">
      <div className="relative z-[1] h-[224px] w-full flex-none">
        <img
          src={`/images/${card.image}`}
          alt=""
          loading="lazy"
          draggable={false}
          className="h-full w-full object-cover"
          style={{ objectPosition: card.position }}
        />
        <div className="absolute -bottom-[29px] left-6 z-10 flex rounded-lg bg-white p-[18px]">
          <HandshakeIcon />
        </div>
      </div>
      <div className="flex w-full flex-col justify-center gap-3.5 overflow-clip px-6 pt-[50px] pb-6">
        <h3 className="font-serif text-xl leading-[1.2] font-medium uppercase">{card.title}</h3>
        <p className="leading-[1.35] tracking-[-0.03em] text-ink">{card.text}</p>
      </div>
    </div>
  )
}

export default function BusinessSchool() {
  const phone = useBreakpoint() === 'phone'
  const t = useT().school
  const cards = t.cards.map((card, i) => ({ ...card, ...CARD_IMAGES[i] }))
  return (
    <section className="flex w-full flex-col items-center">
      <div className="flex w-full flex-col items-center gap-[60px] px-6 py-[60px] md:px-8 md:py-20 lg:w-[1200px] lg:pt-[120px]">
        <div className="flex w-full flex-col items-center gap-6 text-center">
          <Appear className="w-full">
            <h2 className="h-section">
              <Lines lines={t.heading} breakClass="max-md:hidden" />
            </h2>
          </Appear>
          <Appear className="w-full">
            <p className="leading-[1.35] tracking-[-0.03em] text-ink md:text-lg lg:text-2xl">
              <Lines lines={t.text} breakClass="max-lg:hidden" />
            </p>
          </Appear>
        </div>

        {/* Tablet/desktop: the row fades in as one; phone: one fade per card. */}
        {phone ? (
          <div className="flex w-full flex-col items-center gap-10">
            {cards.map((card) => (
              <Appear key={card.image} className="w-full">
                <Card card={card} />
              </Appear>
            ))}
          </div>
        ) : (
          <Appear className="flex h-[441px] w-full items-center justify-center gap-6 lg:h-[417px] lg:gap-10">
            {cards.map((card) => (
              <div key={card.image} className="h-full w-px flex-1">
                <Card card={card} />
              </div>
            ))}
          </Appear>
        )}
      </div>
    </section>
  )
}
