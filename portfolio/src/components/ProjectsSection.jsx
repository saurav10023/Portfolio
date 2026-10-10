import { useCallback, useEffect, useRef, useState } from 'react';
import FadeIn from './FadeIn';
import { projects } from '../data/projects';

/*
  How this works
  --------------
  Each project gets a tall "track". Inside it, the card is `position: sticky`, so it stays on screen
  while you scroll through the track. As you scroll:
    1. the card lands on its FRONT (gallery + summary)
    2. it flips to its BACK (full overview, highlights, facts)
    3. the next card slides up over it while it recedes a little
  One rAF scroll handler writes two CSS variables per track (--flip 0..1, --out 0..1) and a data-side
  attribute. Nothing re-renders while scrolling. The buttons just scroll to the matching position, so
  scroll position is the single source of truth.
*/

const COUNT = projects.length;
const RANGE = 0.9; // flip distance, as a fraction of card height (keep in sync with the CSS)
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
/* Smootherstep: zero velocity AND zero acceleration at both ends, so the flip starts and settles gently */
const smoother = (t) => t * t * t * (t * (t * 6 - 15) + 10);
const pad = (n) => String(n).padStart(2, '0');

/* Darkens an accent so it stays readable on the light surface (works in every browser) */
const tone = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  const dark = [31, 41, 55];
  return `rgb(${c.map((v, i) => Math.round(v * 0.62 + dark[i] * 0.38)).join(',')})`;
};

const reducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const focusRing =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#e9edf3]';

/* ------------------------------------------------------------------ */
/* Small pieces                                                        */
/* ------------------------------------------------------------------ */

const Icon = ({ d, className = 'h-4 w-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d={d} />
  </svg>
);

const IconButton = ({ label, onClick, d }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    className={`pj-raised-sm pj-press grid h-9 w-9 place-items-center rounded-full text-[color:var(--pj-ink-2)] hover:text-[color:var(--pj-ink)] ${focusRing}`}
  >
    <Icon d={d} />
  </button>
);

const StatusPill = ({ status }) => (
  <span className="pj-pressed inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold text-[color:var(--pj-ink-2)]">
    <span
      className={`h-2 w-2 rounded-full ${status.state === 'live' ? 'pj-live bg-teal-600' : 'bg-amber-600'}`}
    />
    {status.label}
  </span>
);

const DemoButton = ({ project }) =>
  project.liveUrl ? (
    <a
      href={project.liveUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open ${project.name} live demo (opens in a new tab)`}
      className={`pj-demo group/demo inline-flex items-center gap-2.5 rounded-full px-6 py-3 text-sm font-bold text-white ${focusRing}`}
    >
      Live demo
      <Icon
        d="M7 17L17 7M9 7h8v8"
        className="h-4 w-4 transition-transform duration-300 group-hover/demo:-translate-y-0.5 group-hover/demo:translate-x-0.5"
      />
    </a>
  ) : (
    <span
      aria-disabled="true"
      className="pj-pressed inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-[color:var(--pj-ink-3)]"
    >
      Demo coming soon
    </span>
  );

const GhostButton = ({ onClick, children, className = '' }) => (
  <button
    type="button"
    onClick={onClick}
    className={`pj-ghost inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-[color:var(--pj-ink)] ${focusRing} ${className}`}
  >
    {children}
  </button>
);

/* ------------------------------------------------------------------ */
/* Gallery                                                             */
/* ------------------------------------------------------------------ */

const Gallery = ({ project }) => {
  const images = project.images;
  const total = images.length;
  const [idx, setIdx] = useState(0);
  const swipe = useRef(null);

  const step = useCallback((d) => setIdx((i) => (i + d + total) % total), [total]);

  const onUp = (e) => {
    const s = swipe.current;
    swipe.current = null;
    if (!s) return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.5) step(dx < 0 ? 1 : -1);
  };

  return (
    <div className="pj-pressed relative flex min-h-[150px] flex-1 flex-col rounded-[24px] p-2 sm:rounded-[30px] sm:p-3 lg:min-h-0">
      <div
        onPointerDown={(e) => (swipe.current = { x: e.clientX, y: e.clientY })}
        onPointerUp={onUp}
        onPointerCancel={() => (swipe.current = null)}
        className="relative min-h-0 flex-1 overflow-hidden rounded-[18px] bg-[#dfe4ec] sm:rounded-[22px]"
        style={{ touchAction: 'pan-y' }}
      >
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`${project.name}, screenshot ${i + 1} of ${total}`}
            aria-hidden={i !== idx}
            loading={i === 0 ? 'eager' : 'lazy'}
            decoding="async"
            draggable={false}
            className="absolute inset-0 h-full w-full select-none object-contain"
            style={{
              opacity: i === idx ? 1 : 0,
              transform: i === idx ? 'scale(1)' : 'scale(1.035)',
              transition: 'opacity 600ms cubic-bezier(0.22,1,0.36,1), transform 900ms cubic-bezier(0.22,1,0.36,1)',
            }}
          />
        ))}
        <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_3px_3px_9px_rgba(100,116,139,0.3),inset_-3px_-3px_8px_rgba(255,255,255,0.65)]" />
      </div>

      {total > 1 && (
        <div className="mt-2.5 flex items-center justify-between gap-3 sm:mt-3">
          <div className="flex gap-2 p-1">
            {images.map((src, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIdx(i)}
                aria-label={`Show screenshot ${i + 1} of ${total}`}
                aria-pressed={i === idx}
                className={`h-8 w-11 overflow-hidden rounded-[10px] transition-[opacity,box-shadow] duration-300 sm:h-9 sm:w-14 ${focusRing}`}
                style={{
                  boxShadow:
                    i === idx
                      ? `0 0 0 2px ${tone(project.accent)}, 3px 3px 8px rgba(143,157,180,0.5)`
                      : '3px 3px 7px rgba(143,157,180,0.4), -3px -3px 7px rgba(255,255,255,0.9)',
                  opacity: i === idx ? 1 : 0.6,
                }}
              >
                <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="mr-1 text-xs font-bold tabular-nums text-[color:var(--pj-ink-3)]" aria-live="polite">
              {idx + 1} / {total}
            </span>
            <IconButton label="Previous screenshot" onClick={() => step(-1)} d="M15 18l-6-6 6-6" />
            <IconButton label="Next screenshot" onClick={() => step(1)} d="M9 18l6-6-6-6" />
          </div>
        </div>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Front face                                                          */
/* ------------------------------------------------------------------ */

const Front = ({ project, index, onJump, onFlip }) => {
  const accent = tone(project.accent);
  return (
    <div
      className="pj-face pj-front pj-raised"
      style={{
        backgroundImage: `radial-gradient(46% 38% at 6% 94%, ${project.accent}26, transparent 70%), linear-gradient(145deg, #f3f5f9, #e1e6ee)`,
      }}
    >
      <div className="relative mx-auto flex h-full max-w-6xl flex-col gap-3 p-4 sm:gap-4 sm:p-6 lg:p-7">
        {/* Progress rail: segments double as navigation */}
        <div className="flex items-center justify-between gap-4">
          <span className="text-xs font-bold tabular-nums text-[color:var(--pj-ink-2)]">
            {pad(index + 1)} <span className="text-[color:var(--pj-ink-3)]">of {pad(COUNT)}</span>
          </span>
          <div className="flex items-center gap-1.5" role="group" aria-label="Jump to project">
            {projects.map((p, i) => (
              <button
                key={p.number}
                type="button"
                onClick={() => onJump(i)}
                aria-label={`Go to ${p.name}`}
                aria-current={i === index}
                className={`flex h-6 items-center rounded-full ${focusRing}`}
              >
                <span
                  className="block h-[4px] rounded-full transition-all duration-500"
                  style={{
                    width: i === index ? 40 : 22,
                    backgroundColor: i === index ? accent : '#8c96a8',
                    opacity: i === index ? 1 : 0.35,
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-3 sm:gap-4 lg:grid lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:grid-rows-[minmax(0,1fr)] lg:gap-6">
          <Gallery project={project} />

          <div className="flex shrink-0 flex-col justify-between gap-3 px-1 lg:min-h-0 lg:shrink lg:gap-4 lg:py-2">
            <div className="flex items-start justify-between gap-4">
              <span
                className="pj-num hidden select-none font-black leading-none tabular-nums lg:block"
                style={{
                  fontSize: 'clamp(4rem, 7vw, 6.5rem)',
                  color: 'transparent',
                  WebkitTextStroke: `1.5px ${accent}`,
                  opacity: 0.8,
                }}
                aria-hidden="true"
              >
                {project.number}
              </span>
              <div className="flex flex-wrap items-center gap-2 lg:mt-2 lg:justify-end">
                <span className="text-xs font-semibold text-[color:var(--pj-ink-2)]">{project.kind}</span>
                <StatusPill status={project.status} />
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:gap-3">
              <h3 className="text-2xl font-extrabold leading-[1.05] tracking-tight text-[color:var(--pj-ink)] sm:text-3xl xl:text-4xl">
                {project.name}
              </h3>
              <p className="pj-clamp pj-summary max-w-[52ch] text-sm font-medium leading-relaxed text-[color:var(--pj-ink-2)] sm:text-base">
                {project.summary}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:gap-4">
              <ul className="pj-stack-front flex flex-wrap gap-2">
                {project.stack.map((t) => (
                  <li key={t} className="pj-raised-sm rounded-full px-3 py-1.5 text-xs font-semibold text-[color:var(--pj-ink)]">
                    {t}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap items-center gap-3">
                <DemoButton project={project} />
                <GhostButton onClick={() => onFlip(index, 'back')}>
                  How it&rsquo;s built
                  <Icon d="M9 18l6-6-6-6" />
                </GhostButton>
              </div>
              <p
                className="pj-hint flex items-center gap-2 text-xs font-medium text-[color:var(--pj-ink-3)]"
                style={{ opacity: 'calc(1 - var(--flip, 0) * 4)' }}
              >
                <Icon d="M12 5v14M6 13l6 6 6-6" className="pj-bob h-3.5 w-3.5" />
                Keep scrolling and this card flips to show the details
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Back face                                                           */
/* ------------------------------------------------------------------ */

const Back = ({ project, index, onFlip }) => {
  const accent = tone(project.accent);
  return (
    <div
      className="pj-face pj-back pj-raised"
      style={{
        backgroundImage: `radial-gradient(46% 38% at 94% 8%, ${project.accent}2a, transparent 70%), linear-gradient(145deg, #f3f5f9, #e1e6ee)`,
      }}
    >
      <div className="relative mx-auto flex h-full max-w-6xl flex-col gap-3 p-4 sm:gap-4 sm:p-6 lg:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-[color:var(--pj-ink-2)]">{project.kind}</span>
              <StatusPill status={project.status} />
            </div>
            <h3 className="text-2xl font-extrabold leading-[1.05] tracking-tight text-[color:var(--pj-ink)] sm:text-3xl xl:text-4xl">
              {project.name}
            </h3>
          </div>
          <GhostButton onClick={() => onFlip(index, 'front')} className="shrink-0 !px-4 !py-2.5">
            <Icon d="M15 18l-6-6 6-6" />
            <span className="hidden sm:inline">Overview</span>
            <span className="sm:hidden">Back</span>
          </GhostButton>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-4 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-8">
          {/* Story, facts, stack */}
          <div className="flex min-h-0 flex-col gap-3 sm:gap-4">
            <p style={{ '--i': 0 }} className="pj-reveal pj-clamp pj-overview text-sm font-medium leading-relaxed text-[color:var(--pj-ink-2)] sm:text-base">
              {project.overview}
            </p>
            <dl style={{ '--i': 1 }} className="pj-reveal grid grid-cols-3 gap-2 sm:gap-3">
              {project.facts.map((f) => (
                <div key={f.label} className="pj-pressed rounded-2xl px-3 py-2.5">
                  <dt className="text-[11px] font-semibold text-[color:var(--pj-ink-3)]">{f.label}</dt>
                  <dd className="mt-0.5 text-xs font-bold leading-snug text-[color:var(--pj-ink)] sm:text-sm">{f.value}</dd>
                </div>
              ))}
            </dl>
            <ul style={{ '--i': 2 }} className="pj-reveal pj-stack-back flex flex-wrap gap-2">
              {project.stack.map((t) => (
                <li key={t} className="pj-raised-sm rounded-full px-3 py-1.5 text-xs font-semibold text-[color:var(--pj-ink)]">
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Highlights */}
          <ul className="grid min-h-0 flex-1 grid-cols-1 content-start gap-2.5 sm:grid-cols-2 sm:gap-3">
            {project.highlights.map((h, hi) => (
              <li
                key={h.title}
                style={{ '--i': hi + 1 }}
                className="pj-reveal pj-raised-sm flex gap-3 rounded-2xl p-3 sm:p-4"
              >
                <span
                  className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: accent }}
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-[color:var(--pj-ink)]">{h.title}</h4>
                  <p className="pj-clamp pj-hl mt-1 text-xs font-medium leading-relaxed text-[color:var(--pj-ink-2)] sm:text-[13px]">
                    {h.text}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <DemoButton project={project} />
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */

const ProjectsSection = () => {
  const trackRefs = useRef([]);
  const metrics = useRef({ h: 0, stick: 0 });

  useEffect(() => {
    const tracks = () => trackRefs.current;
    const state = tracks().map(() => ({ flip: 0, out: 0, tf: 0, to: 0, w: {} }));

    const measure = () => {
      const card = tracks()[0]?.querySelector('.pj-card');
      if (!card) return;
      metrics.current = {
        h: card.offsetHeight,
        stick: parseFloat(getComputedStyle(card).top) || 0,
      };
    };

    /* Where each card SHOULD be for the current scroll position */
    const readTargets = () => {
      const { h, stick } = metrics.current;
      if (!h) return;
      const range = h * RANGE;
      tracks().forEach((t, i) => {
        if (!t) return;
        const scrolled = stick - t.getBoundingClientRect().top;
        const p = clamp(scrolled / range, 0, 1);
        state[i].tf = smoother(clamp((p - 0.08) / 0.6, 0, 1));
        state[i].to = i < COUNT - 1 ? smoother(clamp((scrolled - range) / h, 0, 1)) : 0;
      });
    };

    /* Write only what changed, so the browser does the minimum work */
    const write = () => {
      tracks().forEach((t, i) => {
        if (!t) return;
        const s = state[i];
        const flip = Math.round(s.flip * 10000) / 10000;
        const out = Math.round(s.out * 10000) / 10000;
        if (s.w.flip !== flip) {
          s.w.flip = flip;
          t.style.setProperty('--flip', flip);
          t.style.setProperty('--lift', Math.round(Math.sin(Math.PI * flip) * 10000) / 10000);
          const side = flip > 0.5 ? 'back' : 'front';
          if (t.dataset.side !== side) t.dataset.side = side;
        }
        if (s.w.out !== out) {
          s.w.out = out;
          t.style.setProperty('--out', out);
        }
      });
    };

    /*
      Damping: the displayed value eases toward the target every frame. Mouse-wheel notches and fast
      flicks become one continuous glide instead of stepping, on every refresh rate.
    */
    let raf = 0;
    let prev = 0;
    const frame = (now) => {
      const dt = Math.min(0.05, (now - prev) / 1000 || 0.016);
      prev = now;
      readTargets();
      const a = reducedMotion() ? 1 : 1 - Math.exp(-dt * 9);
      let moving = false;
      state.forEach((s) => {
        s.flip += (s.tf - s.flip) * a;
        s.out += (s.to - s.out) * a;
        if (Math.abs(s.tf - s.flip) < 0.0006) s.flip = s.tf;
        else moving = true;
        if (Math.abs(s.to - s.out) < 0.0006) s.out = s.to;
        else moving = true;
      });
      write();
      raf = moving ? requestAnimationFrame(frame) : 0;
    };

    const kick = () => {
      if (raf) return;
      prev = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const onResize = () => {
      measure();
      kick();
    };

    measure();
    readTargets();
    state.forEach((s) => {
      s.flip = s.tf; // start exactly in place: no animation on load
      s.out = s.to;
    });
    write();
    window.addEventListener('scroll', kick, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', kick);
      window.removeEventListener('resize', onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  /* Scroll so project i is landed on its front ('front') or fully flipped to its back ('back') */
  const goTo = useCallback((i, side = 'front') => {
    const t = trackRefs.current[i];
    if (!t) return;
    const { h, stick } = metrics.current;
    const base = t.getBoundingClientRect().top + window.scrollY - stick;
    const target = side === 'back' ? base + h * RANGE * 0.72 : base + 1;
    window.scrollTo({ top: target, behavior: reducedMotion() ? 'auto' : 'smooth' });
  }, []);

  return (
    <section id="projects" className="pj-root relative z-10 bg-[#e9edf3]">
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap");

        .pj-root {
          --pj-ink: #333b4a;
          --pj-ink-2: #5d6779;
          --pj-ink-3: #7a8497;
          --pj-lo: rgba(143,157,180,.5);
          --pj-hi: rgba(255,255,255,.95);
          --pj-top: 5rem;                       /* clears the floating navbar */
          --card-h: max(30rem, calc(100vh - var(--pj-top) - 1rem));
          --card-h: max(30rem, calc(100svh - var(--pj-top) - 1rem));
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

        .pj-ghost {
          background: linear-gradient(145deg, rgba(244,246,250,.85), rgba(228,232,240,.6));
          border: 1px solid rgba(255,255,255,.9);
          box-shadow: 4px 4px 10px rgba(143,157,180,.45), -4px -4px 10px rgba(255,255,255,.95);
          transition: transform .25s ease, box-shadow .25s ease;
        }
        @media (hover: hover) { .pj-ghost:hover { transform: translateY(-2px); } }
        .pj-ghost:active { transform: scale(.97); box-shadow: inset 3px 3px 7px var(--pj-lo), inset -3px -3px 7px var(--pj-hi); }

        .pj-demo {
          background: linear-gradient(145deg, #7b8496, #4f586a);
          border: 1px solid rgba(255,255,255,.45);
          box-shadow: 6px 7px 16px -4px rgba(71,82,102,.6), -4px -4px 10px rgba(255,255,255,.9), inset 0 1px 0 rgba(255,255,255,.3);
          transition: transform .3s ease, box-shadow .3s ease, filter .3s ease;
        }
        @media (hover: hover) { .pj-demo:hover { transform: translateY(-2px); filter: brightness(1.06); } }
        .pj-demo:active { transform: scale(.97); box-shadow: inset 3px 3px 7px rgba(30,38,54,.5), inset -2px -2px 5px rgba(255,255,255,.2); }

        .pj-title {
          background: linear-gradient(100deg, #2b3340 10%, #4f5a70 55%, #7c869b 100%);
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent; color: transparent;
        }

        /* ---------- Scroll track, sticky card, flip ---------- */
        .pj-track { position: relative; height: calc(var(--card-h) * 2.9); }
        .pj-track + .pj-track { margin-top: calc(var(--card-h) * -1); }
        .pj-track:last-child { height: calc(var(--card-h) * 2.2); }

        .pj-card {
          position: sticky;
          top: var(--pj-top);
          height: var(--card-h);
          transform-origin: 50% 0;
          transform: translate3d(0, 0, 0) scale(calc(1 - var(--out, 0) * 0.04));
          will-change: transform;
        }
        .pj-stage { position: absolute; inset: 0; perspective: 2200px; }
        .pj-inner {
          position: absolute; inset: 0;
          transform-style: preserve-3d;
          /* lifts away from the screen mid-flip (--lift peaks at 1 halfway) so it reads as a real card */
          transform: translateZ(calc(var(--lift, 0) * -110px)) rotateY(calc(var(--flip, 0) * 180deg));
          will-change: transform;
        }
        .pj-face {
          position: absolute; inset: 0; overflow: hidden;
          border-radius: 32px;
          -webkit-backface-visibility: hidden; backface-visibility: hidden;
        }
        @media (min-width: 640px) { .pj-face { border-radius: 44px; } }
        .pj-back { transform: rotateY(180deg); }
        /* Only the visible side is interactive and readable by assistive tech */
        .pj-track[data-side="front"] .pj-back,
        .pj-track[data-side="back"] .pj-front { visibility: hidden; }

        .pj-dim {
          position: absolute; inset: 0; z-index: 5; pointer-events: none;
          border-radius: 32px; background: #e9edf3;
          opacity: calc(var(--out, 0) * 0.4 + var(--lift, 0) * 0.12);
        }
        @media (min-width: 640px) { .pj-dim { border-radius: 44px; } }

        /* Back-of-card content settles in one item at a time as the flip completes */
        .pj-reveal {
          --k: clamp(0, calc((var(--flip, 0) - 0.5) * 6 - var(--i, 0) * 0.55), 1);
          opacity: var(--k);
          transform: translate3d(0, calc((1 - var(--k)) * 14px), 0);
        }

        /* ---------- Text clamps so nothing is ever cut mid-card ---------- */
        .pj-clamp { display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden; }
        .pj-summary { -webkit-line-clamp: 3; }
        .pj-overview { -webkit-line-clamp: 6; }
        .pj-hl { -webkit-line-clamp: 2; }
        @media (min-width: 1024px) {
          .pj-summary { -webkit-line-clamp: 4; }
          .pj-overview { -webkit-line-clamp: 9; }
          .pj-hl { -webkit-line-clamp: 3; }
        }
        @media (min-width: 1024px) and (max-height: 860px) {
          .pj-summary { -webkit-line-clamp: 3; }
          .pj-overview { -webkit-line-clamp: 6; }
          .pj-hl { -webkit-line-clamp: 2; }
          .pj-num { font-size: 3.5rem !important; }
        }
        @media (min-width: 1024px) and (max-height: 720px) { .pj-num { display: none !important; } }
        @media (max-width: 1023px) and (max-height: 780px) {
          .pj-summary { -webkit-line-clamp: 2; }
          .pj-overview { -webkit-line-clamp: 4; }
          .pj-hl { -webkit-line-clamp: 1; }
          .pj-stack-back, .pj-hint { display: none; }
        }
        @media (max-width: 1023px) and (max-height: 700px) { .pj-stack-front { display: none; } }

        /* ---------- Small motion ---------- */
        .pj-live { animation: pj-pulse 1.8s ease-out infinite; }
        .pj-bob { animation: pj-bob 1.8s ease-in-out infinite; }
        @keyframes pj-pulse { 0% { box-shadow: 0 0 0 0 rgba(13,148,136,.45); } 100% { box-shadow: 0 0 0 8px rgba(13,148,136,0); } }
        @keyframes pj-bob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(3px); } }

        /* Reduced motion: no 3D, no scaling. The sides swap instantly instead of flipping. */
        @media (prefers-reduced-motion: reduce) {
          .pj-inner { transform: none !important; }
          .pj-back { transform: none; }
          .pj-card { transform: none !important; }
          .pj-dim { display: none; }
          .pj-live, .pj-bob { animation: none; }
          .pj-reveal { opacity: 1; transform: none; }
        }
      `}</style>

      {/* Heading (scrolls away normally) */}
      <div className="relative overflow-hidden px-5 pb-10 pt-20 text-center sm:px-8 sm:pb-12 sm:pt-24 md:px-10 md:pt-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] max-w-none -translate-x-1/2"
          style={{ background: 'radial-gradient(closest-side, rgba(255,255,255,.95), rgba(255,255,255,0))' }}
        />
        <FadeIn delay={0}>
          <h2
            className="pj-title relative font-black tracking-tight"
            style={{ fontSize: 'clamp(3rem, 12vw, 150px)', lineHeight: 1, paddingBottom: '0.08em' }}
          >
            Projects
          </h2>
          <p className="relative mx-auto mt-4 max-w-[46ch] text-sm font-medium leading-relaxed text-[color:var(--pj-ink-2)] sm:text-base">
            Three products I&rsquo;ve built and shipped. Scroll slowly: each card flips over to show how it
            was made.
          </p>
        </FadeIn>
      </div>

      {/* The stack */}
      <div className="relative px-3 pb-24 sm:px-6 md:px-8">
        {projects.map((p, i) => (
          <div
            key={p.number}
            ref={(el) => (trackRefs.current[i] = el)}
            className="pj-track"
            data-side="front"
            style={{ zIndex: i + 1 }}
          >
            <article className="pj-card" aria-label={`Project ${i + 1} of ${COUNT}: ${p.name}`}>
              <div className="pj-stage">
                <div className="pj-inner">
                  <Front project={p} index={i} onJump={goTo} onFlip={goTo} />
                  <Back project={p} index={i} onFlip={goTo} />
                </div>
              </div>
              <div className="pj-dim" aria-hidden="true" />
            </article>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;