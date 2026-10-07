# Jack — 3D Creator Portfolio — drop-in files

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
  index.css             <- merge into your existing index.css
```

## 1. Install dependencies

```bash
npm install framer-motion@^12.38.0 lucide-react@^0.344.0
```

(Tailwind + Vite + React you already have.)

## 2. index.html — add the Kanit font and page title

I don't have your current `index.html`, so add these inside `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700;800;900&display=swap"
  rel="stylesheet"
/>
<title>Jack -- 3D Creator</title>
```

## 3. tailwind.config.js — extend the font family (optional but recommended)

```js
// inside module.exports.theme.extend
fontFamily: {
  sans: ['Kanit', 'sans-serif'],
},
```

Also make sure `content` includes your `src` files, e.g.:

```js
content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
```

## 4. index.css

Copy the contents of the `index.css` file in this bundle into your project's
`src/index.css` (it includes the Tailwind directives, the dark background
reset, and the `.hero-heading` gradient-text class used by every big
headline). If your `index.css` already has `@tailwind` directives, just
add the rest below them.

## 5. App.jsx

Replace `src/App.jsx` with the one in this bundle (or just make sure it
renders `<Portfolio />` from `./pages/portfolio`).

## 6. main.jsx

No changes needed — it should already import `./index.css` and mount `<App />`.

## Notes

- All copy, image URLs, colors, spacing, and animation timings follow your
  spec exactly.
- `MarqueeSection` and `ProjectsSection` are scroll-driven (native scroll
  listener + Framer Motion `useScroll`/`useTransform`, respectively) — no
  extra scroll libraries needed.
- Anchor targets (`#about`, `#price`, `#projects`, `#contact`) are wired
  into the section `id`s so the navbar links jump to the right sections.
- Every image uses the exact URLs you provided — swap them out any time by
  editing `data/marqueeImages.js`, `data/projects.js`, or the URL constants
  at the top of `HeroSection.jsx` / `AboutSection.jsx`.
