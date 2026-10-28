# Rasa Group Global — website

React rebuild of the Framer site (`nuanced-design-872687.framer.app`).
Vite + React 19 + TypeScript + Tailwind CSS v4, with `motion` for animations and `cobe` for the globe.

```bash
npm install
npm run dev       # local dev server
npm run build     # production build in dist/
npm run preview   # serve the build
```

## Structure

- `src/pages/` — `Home`, `About`, `Contact`, `NotFound`
- `src/components/` — `Navigation` (menu overlay), `Footer`, `CtaSection` (video CTA on every page), `Team` (ticker/grid + bio pop-up), `Globe`, `Button`, `Reveal` (scroll-in animation)
- `src/data/team.json` — exported from the Framer CMS "Team" collection
- `public/` — images, fonts (Editor, Satoshi), CTA video and logos, all downloaded from the Framer project

## Languages

English is served at `/` and German under `/de` (`/de`, `/de/about`, `/de/contact`). All copy lives in
`src/i18n/en.ts` and `src/i18n/de.ts`; TypeScript fails the build if a German key is missing. Internal links
stay in the current language automatically, and the EN / DE switch in the navigation opens the same page in
the other language. Team bios (`src/data/team.json`) are English on both, as on the Framer site.

## Contact form

Like the Framer form, submissions are sent by email (subject "New Submission", basic spam protection,
then a redirect to the home page). Sending goes through [FormSubmit](https://formsubmit.co), no account
or key needed.

- The recipient is `EMAIL.to` in `src/pages/Contact.tsx` (currently `access@rasagroup.global`).
- The first submission sends an activation email to that address; click the link in it once, and from
  then on every submission is delivered.

## Deploying

Hosted on Vercel (project `rasa-group-global`). Deploy from this folder with `vercel --prod`.
Routes are client-side, so `vercel.json` rewrites every path that isn't a file to `index.html`.
