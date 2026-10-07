# Jack — 3D Creator Portfolio — drop-in files

## What was actually wrong

Your `package.json` doesn't have `tailwindcss` (or `lucide-react`) installed at
all, so none of the Tailwind utility classes were ever being generated — that's
why the button showed up as a plain blue underlined link and the layout
collapsed into default block flow. This bundle is updated for **Tailwind v4**
(the current version), which is set up differently from v3: no
`tailwind.config.js`, no `@tailwind base/components/utilities` directives.

## Where each file goes in your project

```
src/
  components/
    FadeIn.jsx
    Magnet.jsx
    AnimatedText.jsx
    ContactButton.jsx
    LiveProjectButton.jsx
    Navbar.jsx
    HeroSection.jsx
    MarqueeSection.jsx
    AboutSection.jsx
    ServicesSection.jsx
    ProjectsSection.jsx
  data/
    marqueeImages.js
    services.js
    projects.js
  pages/
    portfolio.jsx      <- replace/create
  App.jsx               <- replace with the version here (or merge)
  index.css             <- REPLACE your index.css with this one
vite.config.js           <- merge the tailwindcss() plugin into yours
```

## 1. Install the missing dependencies

```bash
npm install tailwindcss @tailwindcss/vite framer-motion lucide-react
```

(No `postcss`, no `autoprefixer`, no `tailwind.config.js` needed for v4.)

## 2. vite.config.js — add the Tailwind plugin

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

## 3. src/index.css — replace it with the one in this bundle

The key line is `@import "tailwindcss";` at the top (this replaces the old
`@tailwind base/components/utilities` v3 syntax). It also includes the dark
background reset and the `.hero-heading` gradient-text class used by every
big headline.

## 4. index.html — add the Kanit font and page title

Add these inside `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700;800;900&display=swap"
  rel="stylesheet"
/>
<title>Jack -- 3D Creator</title>
```

## 5. App.jsx

Replace `src/App.jsx` with the one in this bundle (or just make sure it
renders `<Portfolio />` from `./pages/portfolio`).

## 6. main.jsx

No changes needed — it should already import `./index.css` and mount `<App />`.

## 7. Restart the dev server

Kill and restart `npm run dev` after installing — Vite won't pick up a brand
new PostCSS/Tailwind plugin on hot-reload alone.

## Verified

I scaffolded a throwaway Vite + React app, wired it up exactly like these
steps (Tailwind v4 via `@tailwindcss/vite`, no config file), dropped these
components in, and ran `npm run build` — it compiles cleanly and the output
CSS actually contains the expected utility classes (`rounded-full`,
`font-black`, etc.), confirming Tailwind is generating correctly this time.

## Notes

- The hero portrait image now has `max-h-[75vh] object-contain` and the hero
  section has `overflow-hidden` as a safety net, so it can't spill into the
  next section even before Tailwind kicks in.
- `MarqueeSection` and `ProjectsSection` are scroll-driven (native scroll
  listener + Framer Motion `useScroll`/`useTransform`, respectively) — no
  extra scroll libraries needed.
- Anchor targets (`#about`, `#price`, `#projects`, `#contact`) are wired
  into the section `id`s so the navbar links jump to the right sections.
