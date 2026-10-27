// English copy (default locale, served at /). Arrays are lines: components join them with <br>.

const en = {
  titles: {
    home: 'Rasa Group Global - The Future of Gastronomy',
    about: 'About - Rasa Group Global',
    contact: 'Contact - Rasa Group Global',
    fallback: 'Rasa Group Global',
  },
  nav: {
    pages: ['Home', 'About', 'Contact'],
    menu: 'Menu',
    close: 'Close',
    homeAria: 'Rasa Group Global home',
  },
  hero: {
    headline: ['We don’t build cafés.', 'We build the future', 'of gastronomy.'],
  },
  intro: {
    /** "{pre}<b>{brand}</b>{post}" */
    text: {
      pre: '',
      brand: 'Rasa Group Global',
      post: " breaks the status quo by combining Indonesia's untapped exclusivity, German engineering precision, and a scalable tech ecosystem to create a strictly profitable gastronomy business model.",
    },
    cta: 'Become a Partner',
  },
  brands: {
    heading: 'Our Brands',
    moreInfo: 'more info',
    showFront: 'show front',
    items: [
      {
        tagline: 'Signature Crafted',
        text: 'Our matcha is finely milled to preserve its natural green color, smooth aroma, and clean umami profile. Designed for those who value focus, balance, and repeatable quality.',
      },
      {
        tagline: 'Addicted to Quality',
        text: 'Rasa Kopi is built on uncompromising bean quality, precise brewing, and honest flavor expression. Every origin is carefully curated, processed to high standards, and roasted to highlight its natural character.',
      },
      {
        tagline: 'Taste of Authenticity',
        text: 'Rasa Indonesia brings home-style Indonesian dishes to a global audience. Each recipe uses original spices, traditional techniques, and carefully sourced ingredients to preserve real flavors.',
      },
    ],
  },
  story: {
    heading: ['Not just another franchise.', 'A scalable infrastructure.'],
    text: [
      'We limit our annual openings to guarantee excellence.',
      "We don't profit from entry fees - we reinvest heavily into your launch.",
      'We only win when you are profitable',
    ],
  },
  heritage: {
    heading: 'Indonesian Heritage The Global Monopoly',
    text: 'While the market is flooded with concepts from Vietnam or Thailand, Rasa holds the keys to the "Hidden Jewel" : Indonesia.',
    features: [
      {
        title: 'Exclusive Access',
        text: 'We hold exclusive distribution rights for Europe, Turkiye & GCC for premium raw materials (e.g., Matcha, Coffee, Cacao, Artisan Tea, Sirup).',
      },
      { title: 'The Moat', text: 'No competitor can copy our supply chain. You sell a product that exists nowhere else' },
    ],
  },
  ecosystem: {
    heading: ['The Digital Ecosystem', 'Your Profit Engine'],
    /** The break only shows on desktop. */
    text: [
      'We are a tech company disguised as a coffee brand. Our proprietary ecosystem',
      ' connects finance, operations, and retention into an unbeatable unit.',
    ],
    cards: [
      {
        title: 'The "Rasa Bank" (0% Fees)',
        text: 'While others lose 2.5% to credit card fees, you pay 0.00% on Wallet transactions. We keep the profit in your pocket.',
      },
      {
        title: 'Meteo-Marketing AI',
        text: 'Raining? The App pushes "Warm Pastry". Heatwave? It pushes "Iced Matcha". We automate demand based on weather and events.',
      },
      {
        title: 'The Subscription Model',
        text: 'With "Rasa Ritual" and annual passes, we turn volatile walk-in customers into guaranteed recurring revenue (MRR). You start the month with cash flow already secured',
      },
      {
        title: 'No-Hardware Strategy',
        text: "No expensive terminals. The customer's phone is the POS. Drastically reduces your investment risk (CAPEX).",
      },
    ],
  },
  retail: {
    heading: ['Retail Innovation', 'Revenue Beyond the Shop'],
    text: "We don't accept that revenue stops at the exit door.",
    boxes: [
      {
        title: 'Home Ecosystem',
        text: "Through proprietary capsules (controlled pressure profiles) and Drip Bags, you monetize the customer's home consumption",
      },
      { title: 'Upsell', text: 'Every customer is a potential retail buyer, increasing your revenue per square meter.' },
    ],
  },
  process: {
    heading: ['Engineering Perfection', 'De-Skilling the Bar'],
    text: 'The biggest risk in gastronomy? Finding skilled staff. We eliminated this risk.',
    steps: [
      { title: 'THE UNICA PRO', text: 'We use medical-grade technology that creates reproducible quality.' },
      { title: 'AUTOMATED CONSISTENCY', text: 'Pressure profiles and temperature are controlled by the cloud, not the barista.' },
      {
        title: 'RESULT',
        text: 'Your coffee in Berlin tastes exactly like ours in Munich—even if a beginner is standing behind the bar.',
      },
    ],
    cta: 'Become a Partner',
    showPhoto: 'Show photo',
  },
  school: {
    /** The break is hidden on phone. */
    heading: ['Gastro Business School ', 'We Build Entrepreneurs'],
    /** The break only shows on desktop. */
    text: ['You buy a business, not just a brand. We provide access ', 'to knowledge that usually costs thousands.'],
    cards: [
      { title: 'Daily Live Coaching', text: 'Access to expert calls (Leadership, Tax, Marketing) twice a day' },
      { title: 'Community', text: 'You are never alone. Exchange with experienced partners prevents beginner mistakes.' },
      { title: 'Effect', text: 'We turn career changers into high-performance CEOs.' },
    ],
  },
  strategic: {
    heading: ['Strategic Capital', 'Reinvestment'],
    /** The break only shows on desktop. */
    text: [
      'A significant portion of your entrance fee is immediately reinvested into your location to ensure a seamless launch. This includes:',
    ],
  },
  receive: {
    items: [
      { title: 'Bespoke Interior Design.', text: 'Individualized planning for your space (approx. €6,000 value).' },
      { title: 'Premium Launch Kit.', text: 'Initial stock of coffee, matcha, cacao, and tea, plus branded staff apparel.' },
      { title: 'Operational Support.', text: 'Onsite onboarding and a fully funded first week of marketing' },
    ],
    /** Scroll Text Distortion words on each panel image. */
    words: [
      { phone: ['Bespoke', ' Interior', 'Design.'], other: ['Bespoke', ' Interior', 'Design.'] },
      { phone: ['Premium', 'Launch Kit'], other: ['Premium', 'Launch Kit.'] },
      { phone: ['Operational', 'Support.'], other: ['Operational', 'Support.'] },
    ],
  },
  unica: {
    heading: 'Precision Requires the Right Equipment',
    text: 'Powered by the Unica Pro, a professional espresso machine built for precision and consistency in commercial environments. The machine ensures stable extraction parameters, allowing each cup to deliver a reliable and refined flavor profile.',
    tiles: [
      'Thermal stability for consistent brewing',
      'Balanced pressure delivery',
      'Commercial-grade durability',
      'Optimized workflow for professional teams',
      'Precise extraction control',
    ],
    cta: 'View Machine',
  },
  pourOver: {
    badge: ['100% Consistency.', '0% Human Error.'],
    heading: 'Precision Pour-Over. Perfectly Replicated.',
    text: 'We don’t rely on guesswork. We rely on repeatable profiles. By controlling temperature, flow rate, and bloom to the exact degree, we guarantee that every cup tastes exactly as the Master Roaster intended—in every single store.',
    cta: 'Become a Partner',
  },
  team: {
    heading: ['The Core Team', 'Expertise & Ownership'],
    text: 'Behind Rasa, there is no anonymous board.',
    cta: 'See about us',
    readMore: 'Read more about',
    close: 'Close',
  },
  cta: {
    chip: 'Get started today',
    title: 'Discover the Rasa Group Experience',
    button: 'Become a Franchise Partner',
  },
  footer: {
    columns: ['Main Pages', 'Social media', 'Contact & other'],
    pages: ['Homepage', 'Our brand', 'story', 'start kit', 'Team'],
    contact: 'Contact',
    copyright: '© 2026 Rasa Group Global. All rights reserved. Rasa Group Global is a brand of Rasa Global Investment L.L.C.',
  },
  about: {
    eyebrow: 'About us',
    title: 'Ownership & Intellectual Property',
    company: 'Rasa Global Investment',
    /** "{pre}<b>{company}</b>{mid}<b>{owner}</b>{post}" */
    ownership: {
      pre: 'Rasa Group Global is the flagship brand of ',
      company: 'Rasa Global Investment L.L.C',
      mid: '., a company solely owned and led by ',
      owner: 'Osman Gedik.',
      post: '',
    },
    ip: 'Our global brand identity and trademarks are officially registered with the European Union Intellectual Property Office (EUIPO). This ensures that our services, innovations, and intellectual assets are protected under international law, providing our clients with the security and transparency they deserve.',
    cta: 'Become a Partner',
    /** Framer keeps the trailing space of the first line, which nudges it left. */
    firstYear: ['What is possible in ', 'the first year:'],
    firstYearNote: '*depending on location, situation & commitment',
    stats: ['Turnover', 'Profit', 'Satisfied Customer', 'Authentic Recipes'],
    ownCreations: '∞ Own Creations',
    teamHeading: ['The Core Team', 'Expertise & Ownership'],
    teamText: 'Behind Rasa, there is no anonymous board.',
  },
  contact: {
    eyebrow: 'Contact us',
    title: 'Get in touch',
    heading: 'We’re here to help you',
    /** Name, Email, Phone, Subject. */
    fields: [
      { label: 'Name*', placeholder: 'Your name' },
      { label: 'Email*', placeholder: 'Email address' },
      { label: 'Phone*', placeholder: 'Phone number' },
      { label: 'Subject*', placeholder: 'Subject' },
    ],
    message: { label: 'How we can help?', placeholder: 'Type your message here...' },
    submit: 'Submit',
    sent: 'Thank you',
    error: 'Something went wrong',
  },
  notFound: {
    title: 'Page not found',
    back: 'Back to home',
  },
}

export type Dict = typeof en
export default en
