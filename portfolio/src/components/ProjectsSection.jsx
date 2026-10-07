import { useCallback, useEffect, useRef, useState } from 'react';
import FadeIn from './FadeIn';
import { projects } from '../data/projects';

/*
  Design: each project is ONE complete card that always fits inside the viewport, below the navbar.
  Cards are `position: sticky`, so the next card slides up over the previous one. Each card sticks a
  few pixels lower than the one before it, so the stack reads as a deck and every card is shown whole.

  Animation is deliberately calm:
    - the incoming card does not scale or shift its contents; it simply travels up and lands fully formed
    - the card underneath only recedes slightly (small scale + light wash), because it is about to be covered
  A single rAF scroll handler writes one CSS variable per card (--out: 0 -> 1, how far the NEXT card has
  covered it). No React re-render while scrolling, so nothing can blink or remount.
*/

const COUNT = projects.length;
const IMAGES_PER_PROJECT = 3;
const getImages = (p) => [p.col2Image, p.col1Image1, p.col1Image2];
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const pad = (n) => String(n).padStart(2, '0');

/* Darkens an accent so it stays readable on the light surface */
const tone = (c) => `color-mix(in srgb, ${c} 62%, #1f2937)`;

const focusRing =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#e9edf3]';

const reducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/* Cursor-follow highlight */
const trackPointer = (e) => {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty('--mx', `${e.clientX - r.left}px`);
  el.style.setProperty('--my', `${e.clientY - r.top}px`);
};

const Specular = () => (
  <div
    className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover/glass:opacity-100"
    style={{
      background:
        'radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.65), transparent 60%)',
    }}
  />
);

const Chevron = ({ dir }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
    <path d={dir === 'left' ? 'M15 18l-6-6 6-6' : 'M9 18l6-6-6-6'} />
  </svg>
);

const IconButton = ({ label, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    className={`pj-raised-sm pj-press grid h-9 w-9 place-items-center rounded-full text-[color:var(--pj-ink-2)] hover:text-[color:var(--pj-ink)] ${focusRing}`}
  >
    {children}
  </button>
);

/* ------------------------------------------------------------------ */
/* Gallery: image well, thumbnails, controls                           */
/* ------------------------------------------------------------------ */

const Gallery = ({ project }) => {
  const [idx, setIdx] = useState(0);
  const frameRef = useRef(null);
  const swipe = useRef(null);
  const images = getImages(project);

  const step = useCallback((d) => setIdx((i) => (i + d + IMAGES_PER_PROJECT) % IMAGES_PER_PROJECT), []);

  const onMove = (e) => {
    if (e.pointerType === 'touch' || !frameRef.current) return;
    const r = frameRef.current.getBoundingClientRect();
    frameRef.current.style.setProperty('--px', ((e.clientX - r.left) / r.width - 0.5) * 2);
    frameRef.current.style.setProperty('--py', ((e.clientY - r.top) / r.height - 0.5) * 2);
  };
  const onLeave = () => {
    frameRef.current?.style.setProperty('--px', 0);
    frameRef.current?.style.setProperty('--py', 0);
  };
  const onUp = (e) => {
    const s = swipe.current;
    swipe.current = null;
    if (!s) return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.5) step(dx < 0 ? 1 : -1);
  };

  return (
    <div className="pj-pressed relative flex min-h-[170px] flex-1 flex-col rounded-[24px] p-2.5 sm:rounded-[30px] sm:p-3 lg:min-h-0">
      <div
        ref={frameRef}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        onPointerDown={(e) => (swipe.current = { x: e.clientX, y: e.clientY })}
        onPointerUp={onUp}
        onPointerCancel={() => (swipe.current = null)}
        className="relative min-h-0 flex-1 overflow-hidden rounded-[18px] bg-[#dde2ea] sm:rounded-[22px]"
        style={{ touchAction: 'pan-y' }}
      >
        {images.map((src, ii) => {
          const visible = ii === idx;
          const rel = Math.sign(ii - idx);
          return (
            <div
              key={ii}
              className="pj-layer absolute inset-0 transform-gpu"
              aria-hidden={!visible}
              style={{
                // The incoming image fades in on top; the outgoing one only drops once covered. No dip.
                zIndex: visible ? 2 : 1,
                opacity: visible ? 1 : 0,
                visibility: visible ? 'visible' : 'hidden',
                transform: visible ? 'translate3d(0,0,0) scale(1)' : `translate3d(${rel * 4}%,0,0) scale(1.01)`,
                transition: visible
                  ? 'opacity 650ms cubic-bezier(0.22,1,0.36,1), transform 850ms cubic-bezier(0.22,1,0.36,1), visibility 0s'
                  : 'opacity 0s linear 700ms, transform 850ms cubic-bezier(0.22,1,0.36,1), visibility 0s linear 700ms',
                pointerEvents: 'none',
              }}
            >
              <img
                src={src}
                alt=""
                loading="eager"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover opacity-30 blur-2xl"
                style={{ transform: 'scale(1.25) translate3d(calc(var(--px,0) * 12px), calc(var(--py,0) * 8px), 0)', transition: 'transform 500ms cubic-bezier(0.22,1,0.36,1)' }}
              />
              <img
                src={src}
                alt={`${project.name} ${ii === 0 ? 'showcase' : `detail ${ii}`}`}
                loading="eager"
                decoding="async"
                className="relative h-full w-full object-contain"
                style={{ transform: 'translate3d(calc(var(--px,0) * -6px), calc(var(--py,0) * -4px), 0)', transition: 'transform 500ms cubic-bezier(0.22,1,0.36,1)' }}
              />
            </div>
          );
        })}
        {/* Sunken edge so the image reads as set into the well */}
        <div className="pointer-events-none absolute inset-0 z-[3] rounded-[inherit] shadow-[inset_3px_3px_9px_rgba(100,116,139,0.35),inset_-3px_-3px_8px_rgba(255,255,255,0.7)]" />
      </div>

      <div className="mt-2.5 flex items-center justify-between gap-3 sm:mt-3">
        <div className="flex gap-2 p-1">
          {images.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIdx(i)}
              aria-label={`Show image ${i + 1} of ${IMAGES_PER_PROJECT}`}
              aria-pressed={idx === i}
              className={`h-8 w-11 overflow-hidden rounded-[12px] transition-[opacity,box-shadow] duration-300 hover:!opacity-100 sm:h-10 sm:w-14 ${focusRing}`}
              style={{
                boxShadow:
                  idx === i
                    ? `0 0 0 2px ${tone(project.accent)}, 3px 3px 8px rgba(143,157,180,0.5)`
                    : '3px 3px 7px rgba(143,157,180,0.45), -3px -3px 7px rgba(255,255,255,0.9)',
                opacity: idx === i ? 1 : 0.6,
              }}
            >
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="mr-1 text-xs font-bold tabular-nums tracking-wider text-[color:var(--pj-ink-3)]" aria-live="polite">
            {pad(idx + 1)} / {pad(IMAGES_PER_PROJECT)}
          </span>
          <IconButton label="Previous image" onClick={() => step(-1)}>
            <Chevron dir="left" />
          </IconButton>
          <IconButton label="Next image" onClick={() => step(1)}>
            <Chevron dir="right" />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Info column                                                         */
/* ------------------------------------------------------------------ */

const Info = ({ project }) => (
  <div className="pj-info relative flex shrink-0 flex-col justify-between gap-3 px-1 py-1 sm:px-2 lg:min-h-0 lg:shrink lg:gap-4 lg:py-2">
    <div className="relative flex items-start justify-between gap-4">
      <span
        className="pj-num hidden select-none font-black leading-none tabular-nums lg:block"
        style={{
          fontSize: 'clamp(4rem, 7vw, 6.5rem)',
          color: 'transparent',
          WebkitTextStroke: `1.5px ${tone(project.accent)}`,
          opacity: 0.8,
        }}
        aria-hidden="true"
      >
        {project.number}
      </span>
      <span className="pj-pressed inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-[color:var(--pj-ink-2)] lg:mt-2">
        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: tone(project.accent) }} />
        {project.category}
      </span>
    </div>

    <div className="relative flex flex-col gap-2 sm:gap-3">
      <h3 className="text-xl font-extrabold uppercase leading-[1.05] tracking-tight text-[color:var(--pj-ink)] sm:text-2xl lg:text-3xl xl:text-4xl">
        {project.name}
      </h3>
      <p className="pj-blurb max-w-[56ch] overflow-hidden text-sm font-medium leading-relaxed text-[color:var(--pj-ink-2)] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] [display:-webkit-box] sm:text-base">
        {project.blurb}
      </p>
    </div>

    <div className="relative flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {project.stack.map((tech) => (
          <span
            key={tech}
            className="pj-raised-sm rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-[color:var(--pj-ink)] sm:text-xs"
          >
            <span
              className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full align-middle"
              style={{ backgroundColor: tone(project.accent) }}
            />
            {tech}
          </span>
        ))}
      </div>
      <div>
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${project.name} demo`}
          className={`pj-demo group/demo inline-flex items-center gap-2.5 rounded-full px-7 py-3 text-xs font-bold uppercase tracking-[0.2em] text-white sm:text-sm ${focusRing}`}
        >
          Demo
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 transition-transform duration-300 group-hover/demo:-translate-y-0.5 group-hover/demo:translate-x-0.5" aria-hidden="true">
            <path d="M7 17L17 7M9 7h8v8" />
          </svg>
        </a>
      </div>
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/* Card: one complete sticky project                                   */
/* ------------------------------------------------------------------ */

const Card = ({ project, index, cardRef, onJump }) => {
  const next = projects[(index + 1) % COUNT];
  return (
    <article
      ref={cardRef}
      onMouseMove={trackPointer}
      aria-label={`Project ${index + 1} of ${COUNT}: ${project.name}`}
      className="pj-panel pj-raised group/glass sticky overflow-hidden rounded-[32px] sm:rounded-[44px]"
      style={{
        zIndex: index + 1,
        top: `calc(var(--pj-top) + ${index * 0.5}rem)`,
        // Faint accent light inside the card, kept soft so the surface stays calm
        backgroundImage: `radial-gradient(46% 38% at 8% 90%, ${project.accent}22, transparent 70%), radial-gradient(40% 34% at 96% 6%, ${next.accent}1a, transparent 70%), linear-gradient(145deg, #f3f5f9, #e1e6ee)`,
      }}
    >
      <Specular />

      <div className="relative mx-auto flex h-full max-w-6xl flex-col gap-3 p-4 sm:gap-4 sm:p-6 lg:p-7">
        {/* Progress rail: segments double as navigation */}
        <div className="flex items-center justify-between gap-4">
          <span className="text-[11px] font-bold uppercase tabular-nums tracking-[0.3em] text-[color:var(--pj-ink-2)]">
            {pad(index + 1)} <span className="text-[color:var(--pj-ink-3)]">/ {pad(COUNT)}</span>
          </span>
          <div className="flex items-center gap-1.5" role="group" aria-label="Jump to project">
            {projects.map((p, i) => (
              <button
                key={p.number}
                type="button"
                onClick={() => onJump(i)}
                aria-label={`Go to ${p.name}`}
                aria-current={i === index}
                className={`group/seg flex h-6 items-center rounded-full ${focusRing}`}
              >
                <span
                  className="block h-[4px] rounded-full transition-all duration-500 group-hover/seg:opacity-100"
                  style={{
                    width: i === index ? 40 : 22,
                    backgroundColor: i === index ? tone(project.accent) : '#8c96a8',
                    opacity: i === index ? 1 : i < index ? 0.55 : 0.3,
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-3 sm:gap-4 lg:grid lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:grid-rows-[minmax(0,1fr)] lg:gap-6">
          <Gallery project={project} />
          <Info project={project} />
        </div>
      </div>

      {/* Light wash as the next card covers this one */}
      <div className="pj-dim pointer-events-none absolute inset-0 z-10 bg-[#e9edf3]" aria-hidden="true" />
    </article>
  );
};

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */

const ProjectsSection = () => {
  const listRef = useRef(null);
  const cardRefs = useRef([]);
  const metrics = useRef({ h: 0, gap: 0, sticks: [] });

  // Scroll -> CSS variable. No React state, so scrolling never re-renders anything.
  useEffect(() => {
    const cards = () => cardRefs.current;

    const measure = () => {
      const first = cards()[0];
      if (!first) return;
      const cs = getComputedStyle(first);
      metrics.current = {
        h: first.offsetHeight,
        gap: parseFloat(cs.marginBottom) || 0,
        sticks: cards().map((el) => (el ? parseFloat(getComputedStyle(el).top) || 0 : 0)),
      };
    };

    if (reducedMotion()) {
      measure();
      window.addEventListener('resize', measure);
      return () => window.removeEventListener('resize', measure);
    }

    const last = new Array(COUNT).fill(null);
    let raf = 0;

    const update = () => {
      raf = 0;
      const { h, gap, sticks } = metrics.current;
      const dist = h + gap || 1;
      cards().forEach((el, i) => {
        if (!el) return;
        let out = 0;
        const nextEl = cards()[i + 1];
        if (nextEl) {
          const nextTop = nextEl.getBoundingClientRect().top;
          out = clamp(1 - (nextTop - (sticks[i + 1] || 0)) / dist, 0, 1);
        }
        const r = Math.round(out * 1000) / 1000;
        if (last[i] === r) return;
        last[i] = r;
        el.style.setProperty('--out', r);
      });
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      onScroll();
    };

    measure();
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Card i lands on its sticky position when the page has scrolled (natural top - stick).
  const jump = useCallback((i) => {
    const list = listRef.current;
    if (!list) return;
    const { h, gap, sticks } = metrics.current;
    const listTop = list.getBoundingClientRect().top + window.scrollY;
    const target = listTop + i * (h + gap) - (sticks[i] || 0);
    window.scrollTo({ top: target, behavior: reducedMotion() ? 'auto' : 'smooth' });
  }, []);

  return (
    <section
      id="projects"
      // overflow-x-clip (not hidden) so position: sticky keeps working inside
      className="pj-root relative z-10 overflow-x-clip bg-[#e9edf3]"
      style={{ '--pj-n': COUNT - 1 }}
    >
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap");

        .pj-root {
          --pj-ink: #3b4352;
          --pj-ink-2: #667085;
          --pj-ink-3: #98a1b2;
          --pj-lo: rgba(143,157,180,.5);
          --pj-hi: rgba(255,255,255,.95);
          /* Distance from the top of the viewport to the first card (clears the floating navbar) */
          --pj-top: 5rem;
          font-family: "Plus Jakarta Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
          color: var(--pj-ink);
        }
        @media (min-width: 640px) { .pj-root { --pj-top: 5.5rem; } }

        /* Neumorphic surfaces */
        .pj-raised {
          background: linear-gradient(145deg, #f3f5f9, #e1e6ee);
          border: 1px solid rgba(255,255,255,.75);
          box-shadow: 10px 12px 28px -6px var(--pj-lo), -8px -8px 20px var(--pj-hi);
        }
        .pj-raised-sm {
          background: linear-gradient(145deg, #f3f5f9, #e1e6ee);
          border: 1px solid rgba(255,255,255,.75);
          box-shadow: 3px 3px 8px var(--pj-lo), -3px -3px 8px var(--pj-hi);
        }
        .pj-pressed {
          background: linear-gradient(145deg, rgba(212,218,229,.55), rgba(241,244,248,.6));
          border: 1px solid rgba(255,255,255,.45);
          box-shadow: inset 3px 3px 7px rgba(143,157,180,.55), inset -3px -3px 7px var(--pj-hi);
        }
        .pj-press { transition: box-shadow .25s ease, color .25s ease, transform .2s ease; }
        .pj-press:active { transform: scale(.96); box-shadow: inset 3px 3px 6px var(--pj-lo), inset -3px -3px 6px var(--pj-hi); }

        /* Demo button: solid slate pill, clearly the primary action on the card */
        .pj-demo {
          background: linear-gradient(145deg, #7b8496, #4f586a);
          border: 1px solid rgba(255,255,255,.45);
          box-shadow: 6px 7px 16px -4px rgba(71,82,102,.6), -4px -4px 10px rgba(255,255,255,.9), inset 0 1px 0 rgba(255,255,255,.3);
          transition: transform .3s var(--pj-ease, ease), box-shadow .3s ease, filter .3s ease;
        }
        @media (hover: hover) { .pj-demo:hover { transform: translateY(-2px); filter: brightness(1.06); } }
        .pj-demo:active { transform: scale(.97); box-shadow: inset 3px 3px 7px rgba(30,38,54,.5), inset -2px -2px 5px rgba(255,255,255,.2); }

        .pj-title {
          background: linear-gradient(100deg, #2f3745 10%, #566176 55%, #8a94a8 100%);
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent; color: transparent;
        }

        /*
          Every card is sized to fit the viewport below the navbar, so the WHOLE card is visible while it is
          on screen. Each later card sticks 0.5rem lower, so the bottoms never run off the screen.
        */
        .pj-panel {
          --out: 0;
          margin-bottom: 1.5rem;
          min-height: 26rem;
          height: calc(100vh - var(--pj-top) - 1rem - var(--pj-n) * 0.5rem);
          height: calc(100svh - var(--pj-top) - 1rem - var(--pj-n) * 0.5rem);
          transform-origin: 50% 0%;
          /* Only the card underneath recedes, and only slightly */
          transform: scale(calc(1 - var(--out) * 0.035));
          will-change: transform;
        }
        .pj-dim { opacity: calc(var(--out) * 0.35); }

        @media (prefers-reduced-motion: reduce) {
          .pj-panel { transform: none; }
          .pj-layer, .pj-layer img { transition-duration: 1ms !important; transition-delay: 0s !important; }
        }
        /* Taller screens get a longer description; shorter ones tighten so nothing is ever cut off */
        @media (min-width: 1024px) { .pj-blurb { -webkit-line-clamp: 5; } }
        @media (min-width: 1024px) and (max-height: 900px) { .pj-blurb { -webkit-line-clamp: 3; } .pj-num { font-size: 4rem !important; } }
        @media (min-width: 1024px) and (max-height: 780px) { .pj-num { display: none !important; } .pj-blurb { -webkit-line-clamp: 2; } }
        @media (max-width: 1023px) and (max-height: 760px) { .pj-blurb { -webkit-line-clamp: 2; } }
      `}</style>

      {/* Soft light behind the heading */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[480px] overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[360px] w-[620px] -translate-x-1/2 rounded-full bg-white opacity-90 blur-[110px]" />
      </div>

      {/* Heading scrolls away normally */}
      <div className="relative px-5 pb-10 pt-20 text-center sm:px-8 sm:pb-12 sm:pt-24 md:px-10 md:pt-28">
        <FadeIn delay={0}>
          <span className="pj-pressed inline-block rounded-full px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.4em] text-[color:var(--pj-ink-2)] sm:text-xs">
            Selected Work
          </span>
          <h2
            className="pj-title mt-6 font-black uppercase"
            style={{ fontSize: 'clamp(3rem, 12vw, 160px)', lineHeight: 1, paddingBottom: '0.06em' }}
          >
            Projects
          </h2>
        </FadeIn>
      </div>

      {/* The stack: scroll normally and each card slides over the last */}
      <div ref={listRef} className="relative px-3 pb-24 sm:px-6 md:px-8">
        {projects.map((p, i) => (
          <Card
            key={p.number}
            project={p}
            index={i}
            cardRef={(el) => (cardRefs.current[i] = el)}
            onJump={jump}
          />
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;