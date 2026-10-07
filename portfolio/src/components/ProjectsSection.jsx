import { useCallback, useEffect, useRef, useState } from 'react';
import FadeIn from './FadeIn';
import LiveProjectButton from './LiveProjectButton';
import { projects } from '../data/projects';

/*
  Design: each project is its own full-screen panel. Panels are `position: sticky`, so as you
  scroll, the next project slides up and covers the previous one like a deck of cards.
  A single rAF scroll handler writes two CSS variables per panel:
    --in   0 -> 1  how far this panel has travelled into view
    --out  0 -> 1  how far the NEXT panel has covered this one
  Everything (depth, parallax, dimming) is pure CSS reading those variables, so there is no
  React re-render while scrolling and no content ever swaps or remounts. That is why it can't blink.
*/

const COUNT = projects.length;
const IMAGES_PER_PROJECT = 3;
const getImages = (p) => [p.col2Image, p.col1Image1, p.col1Image2];
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const pad = (n) => String(n).padStart(2, '0');

const glass =
  'bg-white/[0.05] backdrop-blur-xl backdrop-saturate-150 border border-white/[0.14] ' +
  'shadow-[inset_0_1px_0_rgba(255,255,255,0.26),inset_0_-1px_0_rgba(255,255,255,0.05),0_24px_70px_-28px_rgba(0,0,0,0.9)]';

const focusRing = 'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50';

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
        'radial-gradient(360px circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.12), transparent 60%)',
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
    className={`grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-white/[0.07] text-[#F4F1EA]/80 transition-all duration-300 hover:bg-white/[0.16] hover:text-white active:scale-90 ${focusRing}`}
  >
    {children}
  </button>
);

/* ------------------------------------------------------------------ */
/* Gallery: big image, thumbnails, controls                            */
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
    <div
      onMouseMove={trackPointer}
      className={`pj-gallery group/glass relative flex min-h-[190px] flex-1 flex-col rounded-[28px] p-2.5 sm:rounded-[36px] sm:p-3.5 lg:min-h-0 ${glass}`}
    >
      <Specular />

      <div
        ref={frameRef}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        onPointerDown={(e) => (swipe.current = { x: e.clientX, y: e.clientY })}
        onPointerUp={onUp}
        onPointerCancel={() => (swipe.current = null)}
        className="relative min-h-0 flex-1 overflow-hidden rounded-[20px] border border-white/10 bg-[#0C0C0C] sm:rounded-[26px]"
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
                // The incoming image fades in on top; the outgoing one only drops once covered. No dark dip.
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
                className="absolute inset-0 h-full w-full object-cover opacity-50 blur-2xl"
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
        <div className="pointer-events-none absolute inset-0 z-[3] rounded-[inherit] shadow-[inset_0_0_40px_rgba(0,0,0,0.3)]" />
      </div>

      <div className="mt-2.5 flex items-center justify-between gap-3 sm:mt-3.5">
        <div className="flex gap-1.5 rounded-[18px] border border-white/15 bg-white/[0.07] p-1">
          {images.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIdx(i)}
              aria-label={`Show image ${i + 1} of ${IMAGES_PER_PROJECT}`}
              aria-pressed={idx === i}
              className={`h-8 w-11 overflow-hidden rounded-[12px] transition-all duration-300 hover:scale-105 hover:!opacity-100 active:scale-95 sm:h-10 sm:w-14 ${focusRing}`}
              style={{
                boxShadow: idx === i ? `0 0 0 2px ${project.accent}` : '0 0 0 1px rgba(255,255,255,0.1)',
                opacity: idx === i ? 1 : 0.5,
              }}
            >
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="mr-1 text-xs font-semibold tabular-nums tracking-wider text-[#D7E2EA]/50" aria-live="polite">
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
/* Info card                                                           */
/* ------------------------------------------------------------------ */

const Info = ({ project }) => (
  <div
    onMouseMove={trackPointer}
    className={`pj-info group/glass relative flex shrink-0 flex-col justify-between gap-3 rounded-[28px] p-4 sm:rounded-[36px] sm:p-6 lg:min-h-0 lg:shrink lg:gap-4 lg:p-7 ${glass}`}
  >
    <Specular />
    {/* Accent glow pinned to the card corner (clipped on its own so card content never is) */}
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]" aria-hidden="true">
      <div
        className="absolute -right-24 -top-24 h-64 w-64 rounded-full opacity-30 blur-3xl"
        style={{ backgroundColor: project.accent }}
      />
    </div>

    <div className="relative flex items-start justify-between gap-4">
      <span
        className="pj-num hidden select-none font-black leading-none tabular-nums lg:block"
        style={{
          fontSize: 'clamp(4rem, 7vw, 6.5rem)',
          color: 'transparent',
          WebkitTextStroke: `1.5px ${project.accent}`,
        }}
        aria-hidden="true"
      >
        {project.number}
      </span>
      <span
        className="rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] lg:mt-2"
        style={{ color: project.accent, borderColor: `${project.accent}66`, backgroundColor: `${project.accent}14` }}
      >
        {project.category}
      </span>
    </div>

    <div className="relative flex flex-col gap-2 sm:gap-3">
      <h3 className="text-xl font-semibold uppercase leading-[1.05] tracking-tight text-[#F4F1EA] sm:text-2xl lg:text-3xl xl:text-4xl">
        {project.name}
      </h3>
      <p className="pj-blurb max-w-[56ch] overflow-hidden text-sm leading-relaxed text-[#D7E2EA]/75 [-webkit-box-orient:vertical] [-webkit-line-clamp:3] [display:-webkit-box] sm:text-base">
        {project.blurb}
      </p>
    </div>

    <div className="relative flex flex-col gap-4">
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {project.stack.map((tech) => (
          <span
            key={tech}
            className="rounded-full border border-white/15 bg-white/[0.06] px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-[#F4F1EA]/85 sm:px-3 sm:text-xs"
          >
            <span
              className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full align-middle"
              style={{ backgroundColor: project.accent, boxShadow: `0 0 8px ${project.accent}` }}
            />
            {tech}
          </span>
        ))}
      </div>
      <div>
        <LiveProjectButton href={project.liveUrl} />
      </div>
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/* Panel: one full-screen sticky project                               */
/* ------------------------------------------------------------------ */

const Panel = ({ project, index, panelRef, onJump }) => {
  const next = projects[(index + 1) % COUNT];
  return (
    <article
      ref={panelRef}
      aria-label={`Project ${index + 1} of ${COUNT}: ${project.name}`}
      className="pj-panel sticky top-0 overflow-hidden rounded-t-[32px] border-t border-white/10 shadow-[0_-30px_80px_-10px_rgba(0,0,0,0.7)] sm:rounded-t-[44px]"
      style={{
        zIndex: index + 1,
        backgroundColor: '#0C0C0C',
        // Soft accent light kept away from the top edge so panels never show a seam
        backgroundImage: `radial-gradient(46% 38% at 10% 62%, ${project.accent}2e, transparent 70%), radial-gradient(40% 34% at 92% 40%, ${next.accent}1f, transparent 70%)`,
      }}
    >
      <div className="pj-body mx-auto flex h-full max-w-6xl flex-col gap-3 px-5 pb-6 pt-[4.5rem] sm:px-8 sm:pb-8 sm:pt-20 md:px-10">
        {/* Progress rail: segments double as navigation */}
        <div className="flex items-center justify-between gap-4">
          <span className="text-[11px] font-semibold uppercase tabular-nums tracking-[0.3em] text-[#D7E2EA]/55">
            {pad(index + 1)} <span className="text-[#D7E2EA]/25">/ {pad(COUNT)}</span>
          </span>
          <div className="flex items-center gap-1.5" role="group" aria-label="Jump to project">
            {projects.map((p, i) => (
              <button
                key={p.number}
                type="button"
                onClick={() => onJump(i)}
                aria-label={`Go to ${p.name}`}
                aria-current={i === index}
                className={`group/seg flex h-6 items-center ${focusRing} rounded-full`}
              >
                <span
                  className="block h-[3px] rounded-full transition-all duration-500 group-hover/seg:opacity-100"
                  style={{
                    width: i === index ? 40 : 22,
                    backgroundColor: i === index ? project.accent : 'rgba(215,226,234,0.9)',
                    opacity: i === index ? 1 : i < index ? 0.45 : 0.18,
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

      {/* Darkens as the next project slides over this one */}
      <div className="pj-dim pointer-events-none absolute inset-0 z-10 bg-black" aria-hidden="true" />
    </article>
  );
};

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */

const ProjectsSection = () => {
  const listRef = useRef(null);
  const panelRefs = useRef([]);

  // Scroll -> CSS variables. No React state, so scrolling never re-renders anything.
  useEffect(() => {
    if (reducedMotion()) return;
    const last = new Array(COUNT).fill(null);
    let raf = 0;

    const set = (el, name, v, k) => {
      const r = Math.round(v * 1000) / 1000;
      if (last[k.i][k.n] === r) return;
      last[k.i][k.n] = r;
      el.style.setProperty(name, r);
    };

    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const tops = panelRefs.current.map((el) => (el ? el.getBoundingClientRect().top : vh));
      panelRefs.current.forEach((el, i) => {
        if (!el) return;
        if (!last[i]) last[i] = {};
        const into = clamp(1 - tops[i] / vh, 0, 1);
        const out = i < COUNT - 1 ? clamp(1 - tops[i + 1] / vh, 0, 1) : 0;
        set(el, '--in', into, { i, n: 'in' });
        set(el, '--out', out, { i, n: 'out' });
      });
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Panels are exactly one viewport tall, so project i sits at list top + i * panel height.
  const jump = useCallback((i) => {
    const list = listRef.current;
    if (!list) return;
    const top = list.getBoundingClientRect().top + window.scrollY;
    const h = list.offsetHeight / COUNT;
    window.scrollTo({ top: top + i * h, behavior: reducedMotion() ? 'auto' : 'smooth' });
  }, []);

  return (
    <section
      id="projects"
      // overflow-x-clip (not hidden) so position: sticky keeps working inside
      className="relative z-10 -mt-10 overflow-x-clip rounded-t-[40px] bg-[#0C0C0C] sm:-mt-12 sm:rounded-t-[50px] md:-mt-14 md:rounded-t-[60px]"
    >
      <style>{`
        .pj-panel { --in: 1; --out: 0; height: 100vh; height: 100svh; }
        /* Previous project recedes: scales back, lifts slightly, and dims as the next one covers it */
        .pj-body {
          transform-origin: 50% 0%;
          transform: translate3d(0, calc(var(--out) * -26px), 0) scale(calc(1 - var(--out) * 0.06));
          will-change: transform;
        }
        .pj-dim { opacity: calc(var(--out) * 0.65); }
        /* Entering project: content settles into place a little behind the panel itself, for depth */
        .pj-gallery { transform: translate3d(0, calc((1 - var(--in)) * 46px), 0) scale(calc(0.95 + var(--in) * 0.05)); transform-origin: 50% 100%; }
        .pj-info { transform: translate3d(0, calc((1 - var(--in)) * 80px), 0); }
        @media (max-width: 1023px) { .pj-info { transform: translate3d(0, calc((1 - var(--in)) * 40px), 0); } }
        @media (prefers-reduced-motion: reduce) {
          .pj-layer, .pj-layer img { transition-duration: 1ms !important; transition-delay: 0s !important; }
        }
        /* Taller screens get a longer description; shorter ones shrink things so nothing is ever cut off */
        @media (min-width: 1024px) { .pj-blurb { -webkit-line-clamp: 5; } }
        @media (min-width: 1024px) and (max-height: 860px) { .pj-blurb { -webkit-line-clamp: 3; } .pj-num { font-size: 4rem !important; } }
        @media (min-width: 1024px) and (max-height: 720px) { .pj-num { display: none !important; } .pj-blurb { -webkit-line-clamp: 2; } }
        @media (max-width: 1023px) and (max-height: 700px) { .pj-blurb { -webkit-line-clamp: 2; } }
      `}</style>

      {/* Heading scrolls away normally */}
      <div className="relative px-5 pb-10 pt-20 text-center sm:px-8 sm:pb-14 sm:pt-24 md:px-10 md:pt-32">
        <FadeIn delay={0}>
          <span className="inline-block rounded-full border border-white/15 bg-white/[0.06] px-4 py-1.5 text-[10px] uppercase tracking-[0.4em] text-[#D7E2EA]/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] backdrop-blur-xl sm:text-xs">
            Selected Work
          </span>
          <h2 className="hero-heading mt-6 font-black uppercase" style={{ fontSize: 'clamp(3rem, 12vw, 160px)', lineHeight: 1 }}>
            Projects
          </h2>
        </FadeIn>
      </div>

      {/* The stack: scroll normally and each project slides over the last */}
      <div ref={listRef}>
        {projects.map((p, i) => (
          <Panel
            key={p.number}
            project={p}
            index={i}
            panelRef={(el) => (panelRefs.current[i] = el)}
            onJump={jump}
          />
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;