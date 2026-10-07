import { useEffect, useRef, useState } from 'react';
import FadeIn from './FadeIn';
import { services } from '../data/services';

/* Darkens an accent so it stays readable on the light surface */
const tone = (c) => `color-mix(in srgb, ${c} 62%, #1f2937)`;

/* Tracks the cursor and exposes --mx / --my for the specular highlight. */
const trackPointer = (e) => {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty('--mx', `${e.clientX - r.left}px`);
  el.style.setProperty('--my', `${e.clientY - r.top}px`);
};

/* Flips to true once, the first time the element scrolls into view. Drives the staggered reveals. */
const useSeen = (threshold = 0.25) => {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced || typeof IntersectionObserver === 'undefined') {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, seen];
};

const Check = ({ color }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-2.5 w-2.5" aria-hidden="true">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

const ServiceCard = ({ service }) => {
  const learning = service.status === 'learning';
  const [ref, seen] = useSeen();
  const accent = tone(service.accent);

  return (
    <div
      ref={ref}
      data-in={seen}
      onMouseMove={trackPointer}
      className="sv-card sv-raised group/glass relative flex h-full flex-col gap-5 overflow-hidden rounded-[32px] p-6 sm:rounded-[40px] sm:p-8"
      style={{ '--accent': accent }}
    >
      {/* Cursor-follow light, tinted with the card's accent */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover/glass:opacity-100"
        style={{
          background: `radial-gradient(380px circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.75), ${service.accent}1f 45%, transparent 70%)`,
        }}
      />
      {/* Accent edge that draws in on hover */}
      <span
        aria-hidden="true"
        className="sv-edge absolute left-8 right-8 top-0 h-[3px] origin-left rounded-b-full sm:left-10 sm:right-10"
        style={{ backgroundColor: accent }}
      />

      {/* Header: number well + status */}
      <div className="relative flex items-start justify-between gap-4">
        <span
          className="sv-pressed sv-num grid place-items-center rounded-[22px] px-4 font-black leading-none tabular-nums"
          style={{ height: 'clamp(3.25rem, 6vw, 4.25rem)', fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: accent }}
        >
          {service.number}
        </span>
        <span className="sv-pressed inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-[color:var(--sv-ink-2)]">
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: learning ? '#98a1b2' : accent }} />
          {learning ? 'Currently Learning' : 'Shipped'}
        </span>
      </div>

      {/* Title + description */}
      <div className="relative flex flex-col gap-3">
        <h3 className="text-xl font-extrabold uppercase leading-[1.1] tracking-tight text-[color:var(--sv-ink)] sm:text-2xl">
          {service.name}
        </h3>
        <p className="text-sm font-medium leading-relaxed text-[color:var(--sv-ink-2)] sm:text-base">
          {service.description}
        </p>
      </div>

      {/* Highlights drawn from the resume: slide in one after another */}
      <ul className="relative flex flex-col gap-3">
        {service.highlights.map((h, i) => (
          <li
            key={h}
            className="sv-li flex items-start gap-3 text-sm font-medium leading-snug text-[color:var(--sv-ink)]"
            style={{ '--i': i }}
          >
            <span className="sv-raised-sm mt-[1px] grid h-5 w-5 flex-shrink-0 place-items-center rounded-full">
              <Check color={accent} />
            </span>
            {h}
          </li>
        ))}
      </ul>

      {/* Stack chips */}
      <div className="relative mt-auto flex flex-wrap gap-2 pt-2">
        {service.stack.map((tech, i) => (
          <span
            key={tech}
            className="sv-chip sv-raised-sm rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-[color:var(--sv-ink)] sm:text-xs"
            style={{ '--i': i + service.highlights.length }}
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
};

const ServicesSection = () => {
  return (
    <section
      id="price"
      className="sv-root relative z-10 overflow-hidden bg-[#e9edf3] px-5 py-20 sm:px-8 sm:py-24 md:px-10 md:py-32"
    >
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap");

        .sv-root {
          --sv-ink: #3b4352;
          --sv-ink-2: #667085;
          --sv-ink-3: #98a1b2;
          --sv-lo: rgba(143,157,180,.5);
          --sv-hi: rgba(255,255,255,.95);
          --sv-ease: cubic-bezier(.22,1,.36,1);
          font-family: "Plus Jakarta Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
          color: var(--sv-ink);
        }

        /* Neumorphic surfaces */
        .sv-raised {
          background: linear-gradient(145deg, #f3f5f9, #e1e6ee);
          border: 1px solid rgba(255,255,255,.75);
          box-shadow: 8px 8px 20px var(--sv-lo), -8px -8px 20px var(--sv-hi);
        }
        .sv-raised-sm {
          background: linear-gradient(145deg, #f3f5f9, #e1e6ee);
          border: 1px solid rgba(255,255,255,.75);
          box-shadow: 3px 3px 7px var(--sv-lo), -3px -3px 7px var(--sv-hi);
        }
        .sv-pressed {
          background: linear-gradient(145deg, rgba(212,218,229,.55), rgba(241,244,248,.6));
          border: 1px solid rgba(255,255,255,.45);
          box-shadow: inset 3px 3px 7px rgba(143,157,180,.55), inset -3px -3px 7px var(--sv-hi);
        }

        .sv-title {
          background: linear-gradient(100deg, #2f3745 10%, #566176 55%, #8a94a8 100%);
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent; color: transparent;
        }

        /* Card: lifts on hover, shadow deepens */
        .sv-card { transition: transform .6s var(--sv-ease), box-shadow .6s var(--sv-ease); }
        @media (hover: hover) {
          .sv-card:hover {
            transform: translateY(-6px);
            box-shadow: 14px 20px 36px -8px var(--sv-lo), -10px -10px 24px var(--sv-hi);
          }
        }
        .sv-edge { transform: scaleX(.12); opacity: .0; transition: transform .7s var(--sv-ease), opacity .4s ease; }
        .sv-card:hover .sv-edge { transform: scaleX(1); opacity: .9; }

        /* The number well "presses" a little further when the card is hovered */
        .sv-num { transition: box-shadow .5s var(--sv-ease); }
        .sv-card:hover .sv-num { box-shadow: inset 4px 4px 9px rgba(143,157,180,.6), inset -4px -4px 9px var(--sv-hi); }

        /* Staggered reveal of highlights and chips once the card scrolls into view */
        .sv-li, .sv-chip {
          opacity: 0;
          transition: opacity .6s ease, transform .7s var(--sv-ease);
          transition-delay: calc(var(--i) * 70ms + 250ms);
        }
        .sv-li { transform: translateX(-10px); }
        .sv-chip { transform: translateY(8px) scale(.94); }
        .sv-card[data-in="true"] .sv-li,
        .sv-card[data-in="true"] .sv-chip { opacity: 1; transform: none; }
        /* Chips keep their reveal delay only on first show, so hover stays snappy afterwards */
        .sv-card[data-in="true"] .sv-chip:hover { transform: translateY(-2px); transition-delay: 0s; }

        @keyframes sv-float-a { 0%,100% { transform: translate3d(0,0,0); } 50% { transform: translate3d(60px,40px,0); } }
        @keyframes sv-float-b { 0%,100% { transform: translate3d(0,0,0); } 50% { transform: translate3d(-70px,-30px,0); } }
        @media (prefers-reduced-motion: reduce) {
          [style*="sv-float"] { animation: none !important; }
          .sv-card, .sv-edge, .sv-num { transition: none !important; }
          .sv-li, .sv-chip { opacity: 1 !important; transform: none !important; transition: none !important; }
        }
      `}</style>

      {/* Soft light pools and a faint dot grid */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="absolute -left-24 top-24 h-[440px] w-[440px] rounded-full bg-white opacity-90 blur-[120px]"
          style={{ animation: 'sv-float-a 18s ease-in-out infinite' }}
        />
        <div
          className="absolute -right-20 bottom-10 h-[480px] w-[480px] rounded-full bg-slate-300 opacity-40 blur-[130px]"
          style={{ animation: 'sv-float-b 22s ease-in-out infinite' }}
        />
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: 'radial-gradient(rgba(100,116,139,0.16) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            maskImage: 'radial-gradient(ellipse at center, black 25%, transparent 72%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 25%, transparent 72%)',
          }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-14 flex flex-col items-center text-center sm:mb-20 md:mb-24">
          <FadeIn delay={0}>
            <span className="sv-pressed inline-block rounded-full px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.4em] text-[color:var(--sv-ink-2)] sm:text-xs">
              What I Do
            </span>
          </FadeIn>
          <FadeIn delay={0.08} y={40}>
            <h2
              className="sv-title mt-6 font-black uppercase"
              style={{ fontSize: 'clamp(3rem, 12vw, 160px)', lineHeight: 1, paddingBottom: '0.06em' }}
            >
              Services
            </h2>
          </FadeIn>
          <FadeIn delay={0.16} y={20}>
            <p className="mx-auto mt-6 max-w-2xl text-sm font-medium leading-relaxed text-[color:var(--sv-ink-2)] sm:text-base">
              Production-grade full-stack engineering, backed by 500+ solved DSA problems and
              a growing practice in data analysis and machine learning.
            </p>
          </FadeIn>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:gap-8">
          {services.map((service, i) => (
            <FadeIn key={service.number} delay={(i % 2) * 0.12} y={40} className="h-full">
              <ServiceCard service={service} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;