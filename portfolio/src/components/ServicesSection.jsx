import { useEffect, useRef, useState } from 'react';
import FadeIn from './FadeIn';
import { services } from '../data/services';

/* Darkens an accent so it stays readable on the light surface (works in every browser) */
const tone = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  const dark = [31, 41, 55];
  return `rgb(${c.map((v, i) => Math.round(v * 0.62 + dark[i] * 0.38)).join(',')})`;
};

const focusRing =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#e9edf3]';

/*
  Reveal state: 'in' (visible) or 'wait' (hidden until scrolled to).
  Starts visible, so if anything goes wrong the content is never stuck invisible. Only cards that are
  still below the fold are switched to 'wait' after mount, then revealed once, as they approach.
*/
const useReveal = () => {
  const ref = useRef(null);
  const [state, setState] = useState('in');

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return; // already on screen

    setState('wait');
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState('in');
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return [ref, state];
};

/* Cursor-follow light. Mouse only, so phones never run it. */
const trackPointer = (e) => {
  if (e.pointerType !== 'mouse') return;
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty('--mx', `${e.clientX - r.left}px`);
  el.style.setProperty('--my', `${e.clientY - r.top}px`);
};

const Check = ({ color }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-2.5 w-2.5" aria-hidden="true">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

const ServiceCard = ({ service, wide }) => {
  const learning = service.status === 'learning';
  const [ref, state] = useReveal();
  const accent = tone(service.accent);

  return (
    <article
      ref={ref}
      data-state={state}
      onPointerMove={trackPointer}
      aria-label={service.name}
      className={`sv-card ${learning ? 'sv-card-soft' : 'sv-raised'} group/glass relative flex h-full flex-col gap-6 overflow-hidden rounded-[32px] p-6 sm:rounded-[40px] sm:p-8 ${
        wide ? 'md:col-span-2' : ''
      }`}
      style={{
        '--accent': accent,
        backgroundImage: `radial-gradient(55% 45% at 100% 0%, ${service.accent}30, transparent 70%), linear-gradient(145deg, #f3f5f9, #e1e6ee)`,
      }}
    >
      {/* Cursor-follow light (desktop with a mouse) */}
      <div
        aria-hidden="true"
        className="sv-spot pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{
          background: `radial-gradient(360px circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.7), ${service.accent}1f 45%, transparent 70%)`,
        }}
      />
      {/* Accent edge that draws in on hover */}
      <span
        aria-hidden="true"
        className="sv-edge absolute left-8 right-8 top-0 h-[3px] origin-left rounded-b-full sm:left-10 sm:right-10"
        style={{ backgroundColor: accent }}
      />

      {/* Header: number + status */}
      <div className="sv-item relative flex items-start justify-between gap-4" style={{ '--i': 0 }}>
        <span
          className="sv-pressed sv-num grid place-items-center rounded-[20px] px-4 font-black leading-none tabular-nums"
          style={{ height: 'clamp(3.25rem, 6vw, 4rem)', fontSize: 'clamp(1.4rem, 3vw, 1.9rem)', color: accent }}
        >
          {service.number}
        </span>
        <span className="sv-pressed inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold text-[color:var(--sv-ink-2)]">
          <span
            className={`h-2 w-2 rounded-full ${learning ? '' : 'sv-live'}`}
            style={
              learning
                ? { boxShadow: `inset 0 0 0 2px ${accent}` }
                : { backgroundColor: accent }
            }
          />
          {learning ? 'Currently learning' : 'Shipped'}
        </span>
      </div>

      {/* Title + description */}
      <div className="sv-item relative flex flex-col gap-3" style={{ '--i': 1 }}>
        <h3 className="text-2xl font-extrabold leading-[1.1] tracking-tight text-[color:var(--sv-ink)] sm:text-[1.7rem]">
          {service.name}
        </h3>
        <p className="max-w-[60ch] text-sm font-medium leading-relaxed text-[color:var(--sv-ink-2)] sm:text-base">
          {service.description}
        </p>
      </div>

      {/* Highlights: ticks when shipped, open rings while still being learned */}
      <ul className={`relative grid gap-3 ${wide ? 'md:grid-cols-2 md:gap-x-8' : ''}`}>
        {service.highlights.map((h, i) => (
          <li
            key={h}
            className="sv-item flex items-start gap-3 text-sm font-medium leading-snug text-[color:var(--sv-ink)]"
            style={{ '--i': i + 2 }}
          >
            <span className="sv-raised-sm mt-[1px] grid h-5 w-5 shrink-0 place-items-center rounded-full">
              {learning ? (
                <span className="h-2 w-2 rounded-full" style={{ boxShadow: `inset 0 0 0 2px ${accent}` }} />
              ) : (
                <Check color={accent} />
              )}
            </span>
            {h}
          </li>
        ))}
      </ul>

      {/* Stack chips */}
      <ul className="relative mt-auto flex flex-wrap gap-2 pt-1">
        {service.stack.map((tech, i) => (
          <li
            key={tech}
            className="sv-item sv-chip sv-raised-sm rounded-full px-3 py-1.5 text-xs font-semibold text-[color:var(--sv-ink)]"
            style={{ '--i': i + service.highlights.length + 2 }}
          >
            {tech}
          </li>
        ))}
      </ul>
    </article>
  );
};

const ServicesSection = () => {
  const lastIsAlone = services.length % 2 === 1;

  return (
    <section
      id="price"
      className="sv-root relative z-10 overflow-hidden bg-[#e9edf3] px-5 py-20 sm:px-8 sm:py-24 md:px-10 md:py-32"
    >
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap");

        .sv-root {
          --sv-ink: #333b4a;
          --sv-ink-2: #5d6779;
          --sv-ink-3: #7a8497;
          --sv-lo: rgba(143,157,180,.5);
          --sv-hi: rgba(255,255,255,.95);
          --sv-ease: cubic-bezier(.22,1,.36,1);
          font-family: "Plus Jakarta Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
          color: var(--sv-ink);
        }

        /* Neumorphic surfaces (same family as Hero and Projects) */
        .sv-raised {
          border: 1px solid rgba(255,255,255,.75);
          box-shadow: 10px 12px 28px -6px var(--sv-lo), -8px -8px 20px var(--sv-hi);
        }
        /* "Still in progress" cards sit flatter, with a softer edge */
        .sv-card-soft {
          border: 1px solid rgba(255,255,255,.7);
          box-shadow: 6px 8px 18px -6px var(--sv-lo), -6px -6px 16px var(--sv-hi);
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
          background: linear-gradient(100deg, #2b3340 10%, #4f5a70 55%, #7c869b 100%);
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent; color: transparent;
        }

        /* Card: lifts on hover (devices with a real pointer only) */
        .sv-card { transition: transform .6s var(--sv-ease), box-shadow .6s var(--sv-ease); }
        .sv-spot { opacity: 0; transition: opacity .5s ease; }
        .sv-edge { transform: scaleX(.12); opacity: 0; transition: transform .7s var(--sv-ease), opacity .4s ease; }
        @media (hover: hover) {
          .sv-card:hover {
            transform: translateY(-6px);
            box-shadow: 14px 20px 36px -8px var(--sv-lo), -10px -10px 24px var(--sv-hi);
          }
          .sv-card:hover .sv-spot { opacity: 1; }
          .sv-card:hover .sv-edge { transform: scaleX(1); opacity: .9; }
          .sv-card:hover .sv-num { box-shadow: inset 4px 4px 9px rgba(143,157,180,.6), inset -4px -4px 9px var(--sv-hi); }
          .sv-chip:hover { transform: translateY(-2px); }
        }
        .sv-num { transition: box-shadow .5s var(--sv-ease); }

        /* Scroll reveal: each part rises in one after another, only while the card is 'wait'-ing */
        .sv-item {
          transition: opacity .7s ease, transform .8s var(--sv-ease);
          transition-delay: calc(var(--i, 0) * 60ms);
        }
        .sv-card[data-state="wait"] { opacity: 0; transform: translate3d(0, 28px, 0); }
        .sv-card[data-state="wait"] .sv-item { opacity: 0; transform: translate3d(0, 12px, 0); }
        .sv-card[data-state="in"] { opacity: 1; }
        /* Once revealed, hover on chips should react instantly, not wait for the stagger */
        .sv-card[data-state="in"] .sv-chip:hover { transition-delay: 0s; }

        .sv-live { animation: sv-pulse 1.8s ease-out infinite; }
        @keyframes sv-pulse { 0% { box-shadow: 0 0 0 0 rgba(13,148,136,.4); } 100% { box-shadow: 0 0 0 8px rgba(13,148,136,0); } }

        @media (prefers-reduced-motion: reduce) {
          .sv-card, .sv-item, .sv-edge, .sv-num, .sv-spot { transition: none !important; }
          .sv-live { animation: none; }
          .sv-card[data-state="wait"], .sv-card[data-state="wait"] .sv-item { opacity: 1; transform: none; }
        }
      `}</style>

      {/* Soft light pools and a faint dot grid: plain gradients, no blur filters */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="absolute -left-40 top-16 h-[520px] w-[520px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,.95), rgba(255,255,255,0) 68%)' }}
        />
        <div
          className="absolute -right-40 bottom-0 h-[560px] w-[560px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(148,163,184,.4), rgba(148,163,184,0) 68%)' }}
        />
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: 'radial-gradient(rgba(100,116,139,0.16) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 25%, transparent 72%)',
            maskImage: 'radial-gradient(ellipse at center, black 25%, transparent 72%)',
          }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col items-center text-center sm:mb-16 md:mb-20">
          <FadeIn delay={0} y={30}>
            <h2
              className="sv-title font-black tracking-tight"
              style={{ fontSize: 'clamp(3rem, 12vw, 150px)', lineHeight: 1, paddingBottom: '0.08em' }}
            >
              Services
            </h2>
          </FadeIn>
          <FadeIn delay={0.1} y={20}>
            <p className="mx-auto mt-5 max-w-[52ch] text-sm font-medium leading-relaxed text-[color:var(--sv-ink-2)] sm:text-base">
              Production-grade full-stack engineering, backed by 500+ solved DSA problems and a
              growing practice in data analysis and machine learning.
            </p>
          </FadeIn>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:gap-8">
          {services.map((service, i) => (
            <ServiceCard
              key={service.number}
              service={service}
              wide={lastIsAlone && i === services.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;