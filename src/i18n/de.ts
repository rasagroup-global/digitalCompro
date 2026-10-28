import type { Dict } from './en'

// German copy (served under /de), taken from the German Framer site (important-terms-446111.framer.app,
// default locale). Where that site still shows English UI words (Menu, Close, Become a Partner, See about
// us, Home, Contact), the wording comes from its /de locale instead. Team bios stay English, as on Framer.

const de: Dict = {
  titles: {
    home: 'Rasa Gruppe Global - Die Zukunft der Gastronomie',
    about: 'Über uns - Rasa Group Global',
    contact: 'Kontakt - Rasa Group Global',
    imprint: 'Impressum - Rasa Group Global',
    fallback: 'Rasa Group Global',
  },
  descriptions: {
    home: 'Wir bauen keine Cafés. Wir bauen die Zukunft der Gastronomie – mit indonesischer Exklusivität, deutscher Ingenieurskunst und einem skalierbaren Tech-Ökosystem.',
    about: 'Erfahren Sie mehr über die Rasa Group Global, eine Hauptmarke der Rasa Global Investment L.L.C., unsere EUIPO-geschützten Markenrechte und unser Kernteam.',
    contact: 'Nehmen Sie Kontakt mit der Rasa Group Global auf – für Franchise-Partnerschaften, Standorte und Fragen zu unserem Gastronomie-Ökosystem.',
    imprint: 'Impressum der Rasa Group Global.',
    fallback: 'Wir bauen keine Cafés. Wir bauen die Zukunft der Gastronomie.',
  },
  nav: {
    pages: ['Startseite', 'Über', 'Kontakt'],
    menu: 'Menü',
    close: 'Schließen',
    homeAria: 'Rasa Group Global Startseite',
  },
  hero: {
    headline: ['Wir bauen keine Cafés.', 'Wir bauen die Zukunft', 'der Gastronomie.'],
  },
  intro: {
    text: {
      pre: 'Die ',
      brand: 'Rasa Group Global',
      post: ' bricht den Status quo: Wir kombinieren die unerschlossene Exklusivität Indonesiens mit deutscher Ingenieurskunst und einem skalierbaren Tech-Ökosystem, um ein strikt profitables Gastronomie-Geschäftsmodell zu schaffen.',
    },
    cta: 'Werden Sie Partner',
  },
  brands: {
    heading: 'Unsere Marken',
    moreInfo: 'Mehr Infos',
    showFront: 'Vorderseite zeigen',
    items: [
      {
        tagline: 'Signature Crafted',
        text: 'Unser Matcha wird extrem fein gemahlen, um seine natürliche grüne Farbe, sein weiches Aroma und sein klares Umami-Profil zu bewahren. Entwickelt für alle, die Fokus, Balance und reproduzierbare Qualität schätzen.',
      },
      {
        tagline: 'Addicted to Quality',
        text: 'Rasa Kopi baut auf kompromissloser Bohnenqualität, präziser Extraktion und einem ehrlichen Geschmacksprofil auf. Jede Herkunft wird sorgfältig ausgewählt, nach höchsten Standards aufbereitet und so geröstet, dass ihr natürlicher Charakter perfekt hervorgehoben wird.',
      },
      {
        tagline: 'Taste of Authenticity',
        text: 'Rasa Indonesia bringt authentische, indonesische Hausmannskost zu einem globalen Publikum. Jedes Rezept nutzt Originalgewürze, traditionelle Techniken und sorgfältig ausgewählte Zutaten, um den echten Geschmack zu bewahren.',
      },
    ],
  },
  story: {
    heading: ['Nicht einfach nur ein Franchise. Eine skalierbare Infrastruktur.'],
    text: [
      'Wir limitieren unsere jährlichen Neueröffnungen, um Exzellenz zu garantieren.',
      'Wir profitieren nicht von Eintrittsgebühren – wir reinvestieren massiv in deinen Start.',
      'Wir gewinnen nur, wenn du profitabel bist.',
    ],
  },
  heritage: {
    heading: 'Indonesisches Erbe. Das globale Monopol.',
    text: 'Während der Markt mit Konzepten aus Vietnam oder Thailand überflutet ist, hält Rasa die Schlüssel zum "verborgenen Juwel": Indonesien.',
    features: [
      {
        title: 'Exklusiver Zugang',
        text: 'Wir halten die exklusiven Vertriebsrechte für Europa, die Türkei & GCC für Premium-Rohstoffe (z.B. Matcha, Kaffee, Kakao, Artisan-Tees, Sirup).',
      },
      { title: 'Der Burggraben', text: 'Kein Konkurrent kann unsere Lieferkette kopieren. Du verkaufst ein Produkt, das es sonst nirgendwo gibt.' },
    ],
  },
  ecosystem: {
    heading: ['Das digitale Ökosystem.', 'Deine Profit-Maschine.'],
    text: [
      'Wir sind ein Tech-Unternehmen, getarnt als Kaffeemarke. Unser proprietäres Ökosystem',
      ' verbindet Finanzen, Operations und Kundenbindung zu einer unschlagbaren Einheit.',
    ],
    cards: [
      {
        title: 'Die "Rasa Bank" (0% Gebühren)',
        text: 'Während andere 2,5 % an Kreditkartengebühren verlieren, zahlst du 0,00 % auf Wallet-Transaktionen. Wir lassen den Profit in deiner Tasche.',
      },
      {
        title: 'Meteo-Marketing KI',
        text: 'Es regnet? Die App bewirbt "Warmes Gebäck". Hitzewelle? Sie bewirbt "Iced Matcha". Wir automatisieren die Nachfrage basierend auf Wetter und Events.',
      },
      {
        title: 'Das Abo-Modell',
        text: 'Mit dem "Rasa Ritual" und Jahreskarten verwandeln wir volatile Laufkundschaft in garantierte, wiederkehrende Umsätze (MRR). Du startest den Monat mit bereits gesichertem Cashflow.',
      },
      {
        title: 'Hardware-Free Strategie',
        text: 'Keine teuren Kartenterminals. Das Smartphone des Kunden ist die Kasse (POS). Das reduziert dein Investitionsrisiko (CAPEX) drastisch.',
      },
    ],
  },
  retail: {
    heading: ['Innovationen im Einzelhandel', 'Umsatzsteigerung jenseits des Ladengeschäfts'],
    text: 'Wir akzeptieren nicht, dass die Einnahmen am Ausgang aufhören.',
    boxes: [
      {
        title: 'Heimökosystem',
        text: 'Mithilfe von firmeneigenen Kapseln (mit kontrollierten Druckprofilen) und Tropfbeuteln monetarisieren Sie den Heimkonsum Ihrer Kunden.',
      },
      { title: 'Upselling', text: 'Jeder Kunde ist ein potenzieller Einzelhandelskäufer, was Ihren Umsatz pro Quadratmeter erhöht.' },
    ],
  },
  process: {
    heading: ['Engineering Perfektion. Expertenwissen systematisiert.'],
    text: 'Das größte Risiko in der Gastronomie? Gutes Fachpersonal zu finden. Wir haben dieses Risiko eliminiert.',
    steps: [
      { title: 'DIE UNICA PRO', text: 'Wir nutzen Technologie auf medizinischem Niveau, die reproduzierbare Qualität garantiert.' },
      { title: 'AUTOMATISIERTE KONSISTENZ', text: 'Druckprofile und Temperaturen werden von der Cloud gesteuert, nicht vom Barista.' },
      {
        title: 'DAS ERGEBNIS',
        text: 'Dein Kaffee in Berlin schmeckt exakt wie unserer in München – selbst wenn ein Anfänger hinter der Bar steht.',
      },
    ],
    cta: 'Werden Sie Partner',
    showPhoto: 'Foto zeigen',
  },
  school: {
    heading: ['Gastro Business School. ', 'Wir bauen Unternehmer auf.'],
    text: ['Du kaufst ein Business, nicht nur eine Marke. Wir bieten Zugang zu Wissen, ', 'das normalerweise Tausende von Euro kostet.'],
    cards: [
      { title: 'Tägliches Live-Coaching', text: 'Zweimal täglich Zugang zu Experten-Calls (Führung, Steuern, Marketing).' },
      { title: 'Community', text: 'Du bist nie allein. Der Austausch mit erfahrenen Partnern verhindert Anfängerfehler.' },
      { title: 'Der Effekt', text: 'Wir machen aus Quereinsteigern High-Performance CEOs.' },
    ],
  },
  strategic: {
    heading: ['Strategische', 'Kapital-Reinvestition'],
    text: [
      'Ein signifikanter Teil deiner Eintrittsgebühr wird sofort in deinen Standort reinvestiert, ',
      'um einen reibungslosen Start zu gewährleisten. Das beinhaltet:',
    ],
  },
  receive: {
    items: [
      { title: 'Maßgeschneidertes Interior Design', text: 'Individuelle Planung für deine Räumlichkeiten (Wert ca. 6.000 €).' },
      { title: 'Premium Launch Kit', text: 'Erstausstattung an Kaffee, Matcha, Kakao und Tee, plus gebrandete Mitarbeiterkleidung.' },
      { title: 'Operativer Support', text: 'Onboarding vor Ort und eine vollständig finanzierte erste Marketingwoche.' },
    ],
    words: [
      { phone: ['Maßgeschneidertes', 'Interior', 'Design.'], other: ['Maßgeschneidertes', 'Interior', 'Design.'] },
      { phone: ['Premium', 'Launch Kit'], other: ['Premium', 'Launch Kit.'] },
      { phone: ['Operativer', 'Support.'], other: ['Operativer', 'Support.'] },
    ],
  },
  unica: {
    heading: 'Präzision erfordert das richtige Equipment',
    text: 'Angetrieben von der Unica Pro, einer professionellen Espressomaschine, die für höchste Präzision und Konsistenz im Gastronomiebetrieb gebaut wurde. Die Maschine garantiert absolut stabile Extraktionsparameter, sodass jede Tasse ein verlässliches und raffiniertes Geschmacksprofil liefert.',
    tiles: [
      'Thermische Stabilität für konstante Extraktion',
      'Ausbalancierte Druckverteilung',
      'Langlebigkeit auf Industrie-Niveau',
      'Optimierter Workflow für professionelle Teams',
      'Präzise Extraktionskontrolle',
    ],
    cta: 'Sichtmaschine',
  },
  pourOver: {
    badge: ['100 % Konsistenz.', '0 % menschlicher Fehler.'],
    heading: 'Präzisions-Pour-Over. Perfekt reproduziert.',
    text: 'Wir verlassen uns nicht auf Bauchgefühl. Wir verlassen uns auf wiederholbare Profile. Indem wir Temperatur, Durchflussrate und Blooming (das Aufblühen des Kaffees) auf das Grad genau kontrollieren, garantieren wir, dass jede Tasse exakt so schmeckt, wie vom Master Roaster vorgesehen – in jedem einzelnen Store.',
    cta: 'Werden Sie Partner',
  },
  team: {
    heading: ['Das Kernteam', 'Fachkompetenz & Verantwortung'],
    text: 'Hinter Rasa gibt es keinen anonymen Vorstand.',
    cta: 'Über uns ansehen',
    readMore: 'Mehr erfahren über',
    close: 'Schließen',
  },
  cta: {
    chip: 'Legen Sie noch heute los!',
    title: 'Entdecken Sie das Rasa Group Erlebnis',
    button: 'Werden Sie Franchisepartner',
  },
  footer: {
    columns: ['Hauptseiten', 'Social media', 'Kontakt & Sonstiges'],
    pages: ['Startseite', 'Unsere Marke', 'Geschichte', 'Starterset', 'Team'],
    contact: 'Kontakt',
    imprint: 'Impressum',
    privacy: 'Datenschutz',
    copyright: '© 2026 Rasa Group Global. Alle Rechte vorbehalten. Rasa Group Global ist eine Marke der Rasa Global Investment L.L.C.',
  },
  about: {
    eyebrow: 'Über uns',
    title: 'Eigentumsrechte & geistiges Eigentum',
    company: 'Rasa Global Investition',
    ownership: {
      pre: 'Die Rasa Group Global ist die Hauptmarke der ',
      company: 'Rasa Global Investment L.L.C.',
      mid: ', eines Unternehmens, das sich vollständig im Besitz von ',
      owner: 'Osman Gedik',
      post: ' befindet und von ihm geführt wird.',
    },
    ip: 'Unsere globale Markenidentität und unsere Markenzeichen sind offiziell beim Amt der Europäischen Union für geistiges Eigentum (EUIPO) registriert. Dies stellt sicher, dass unsere Dienstleistungen, Innovationen und geistigen Vermögenswerte nach internationalem Recht geschützt sind, und bietet unseren Partnern und Kunden die Sicherheit und Transparenz, die sie verdienen.',
    cta: 'Werden Sie Partner',
    firstYear: ['Was ist im ersten ', 'Jahr möglich?'],
    firstYearNote: '*abhängig von Ort, Situation und Verfügbarkeit',
    stats: ['Umsatz', 'Profitieren', 'Zufriedener Kunde', 'Authentische Rezepte'],
    ownCreations: '∞ Eigene Kreationen',
    teamHeading: ['Das Kernteam', 'Fachkompetenz & Verantwortung'],
    teamText: 'Hinter Rasa gibt es keinen anonymen Vorstand.',
  },
  contact: {
    eyebrow: 'Kontaktieren Sie uns',
    title: 'Nehmen Sie Kontakt auf',
    heading: 'Wir sind hier, um Ihnen zu helfen.',
    fields: [
      { label: 'Name*', placeholder: 'Ihr Name' },
      { label: 'E-Mail*', placeholder: 'E-Mail-Adresse' },
      { label: 'Telefon*', placeholder: 'Telefonnummer' },
      { label: 'Thema*', placeholder: 'Thema' },
    ],
    message: { label: 'Wie können wir Ihnen helfen?', placeholder: 'Geben Sie hier Ihre Nachricht ein...' },
    submit: 'Einreichen',
    // Framer shows these two button states in English on the German site as well.
    sent: 'Thank you',
    error: 'Something went wrong',
  },
  imprint: {
    title: 'Impressum',
    phone: 'Telefon',
    email: 'E-Mail',
    vatId: 'USt-IdNr.',
    authority: 'Zuständige Aufsichtsbehörde für audiovisuelle Mediendienste',
    dispute: 'Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.',
  },
  notFound: {
    title: 'Seite nicht gefunden',
    back: 'Zurück zur Startseite',
  },
}

export default de
