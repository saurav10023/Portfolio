import { useEffect, useRef, useState } from 'react';
import Reveal from './Reveal';
import ContactButton from './ContactButton';
import Navbar from './Navbar';
import useParallax from '../../hooks/useParallax';
import myimage from '../assets/myimage.png';

/* Ratings come from the resume. */
const RATINGS = [
  { label: 'LeetCode', value: '1635' },
  { label: 'CodeChef', value: '1451' },
  { label: 'Codeforces', value: '1126' },
];

const ROLES = ['Full-Stack Engineer', 'Backend Developer', 'Data & ML Learner'];

/* Vertical tagline beside the portrait, and the text in the badge under it. */
const TAGLINE = 'Build · Ship · Scale';
const BADGE_TEXT = 'Clean code. Real products.';

/* Icon-only floating badges. `depth` is the pointer-shift amount. */
const ICONS = [
  {
    label: 'Full-stack development',
    pos: 'top-[7%] -left-[8%]',
    depth: 14,
    path: (
      <>
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </>
    ),
  },
  {
    label: 'Databases',
    pos: 'bottom-[20%] -left-[9%]',
    depth: 18,
    path: (
      <>
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </>
    ),
  },
  {
    label: 'Data and machine learning',
    pos: 'top-[12%] -right-[7%]',
    depth: 20,
    path: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />,
  },
];

const focusRing =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#e9edf3]';

const reducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/* Cycles through roles with a soft rise-and-fade swap. */
const RotatingRole = () => {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reducedMotion()) return;
    const t = setInterval(() => setI((p) => (p + 1) % ROLES.length), 2600);
    return () => clearInterval(t);
  }, []);
  return (
    <span
      key={i}
      className="inline-block text-[color:var(--hr-ink)]"
      style={{ animation: 'hr-word 600ms cubic-bezier(0.22,1,0.36,1) both' }}
    >
      {ROLES[i]}
    </span>
  );
};

const HeroSection = () => {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const frame = useRef(0);

  /* Scroll parallax layers */
  const bgRef = useParallax(0.25); // light pools drift slowest
  const copyRef = useParallax(0.12); // text drifts a little
  const portraitRef = useParallax(0.07); // portrait lags the page

  /* Scroll progress through the hero (0 -> 1) as a CSS variable, no re-renders. */
  useEffect(() => {
    if (reducedMotion()) return;
    const el = sectionRef.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      const p = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.9)));
      el.style.setProperty('--sp', p.toFixed(3));
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  /* Pointer-driven subtle tilt: writes CSS variables, no re-renders. */
  const onMove = (e) => {
    if (reducedMotion()) return;
    const el = stageRef.current;
    if (!el) return;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty('--rx', `${(-py * 4).toFixed(2)}deg`);
      el.style.setProperty('--ry', `${(px * 5).toFixed(2)}deg`);
      el.style.setProperty('--px', px.toFixed(3));
      el.style.setProperty('--py', py.toFixed(3));
    });
  };
  const onLeave = () => {
    const el = stageRef.current;
    if (!el) return;
    cancelAnimationFrame(frame.current);
    ['--rx', '--ry', '--px', '--py'].forEach((k) => el.style.setProperty(k, '0'));
  };

  return (
    <section
      ref={sectionRef}
      className="hr-root relative flex min-h-[100svh] flex-col overflow-hidden bg-[#e9edf3] md:h-[100svh]"
      style={{ overflowX: 'clip', '--sp': 0 }}
    >
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap");

        .hr-root {
          --hr-ink: #3b4352;
          --hr-ink-2: #667085;
          --hr-ink-3: #98a1b2;
          --hr-lo: rgba(143,157,180,.5);
          --hr-hi: rgba(255,255,255,.95);
          font-family: "Plus Jakarta Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
          color: var(--hr-ink);
        }

        /* Neumorphic surfaces */
        .hr-raised {
          background: linear-gradient(145deg, #f7f8fb, #e4e8ef);
          border: 1px solid rgba(255,255,255,.85);
          box-shadow: 10px 12px 28px rgba(143,157,180,.45), -8px -8px 22px var(--hr-hi);
        }
        .hr-raised-sm {
          background: linear-gradient(145deg, #f3f5f9, #e1e6ee);
          border: 1px solid rgba(255,255,255,.75);
          box-shadow: 4px 4px 10px var(--hr-lo), -4px -4px 10px var(--hr-hi);
        }
        .hr-pressed {
          background: linear-gradient(145deg, rgba(212,218,229,.55), rgba(241,244,248,.6));
          border: 1px solid rgba(255,255,255,.45);
          box-shadow: inset 3px 3px 7px rgba(143,157,180,.55), inset -3px -3px 7px var(--hr-hi);
        }

        .hr-btn-ghost {
          background: linear-gradient(145deg, rgba(244,246,250,.8), rgba(228,232,240,.55));
          border: 1px solid rgba(255,255,255,.9);
          box-shadow: 5px 5px 12px rgba(143,157,180,.45), -5px -5px 12px rgba(255,255,255,.95);
          transition: box-shadow .3s ease, transform .25s ease, color .3s ease;
        }
        .hr-btn-ghost:hover { transform: translateY(-2px); }
        .hr-btn-ghost:active {
          transform: scale(.98);
          box-shadow: inset 3px 3px 7px var(--hr-lo), inset -3px -3px 7px var(--hr-hi);
        }

        .hr-name {
          background: linear-gradient(100deg, #2f3745 10%, #566176 45%, #8a94a8 70%, #4a5568 95%);
          background-size: 220% 100%;
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent; color: transparent;
          animation: hr-grad 9s ease-in-out infinite alternate;
        }

        @keyframes hr-word { from { opacity: 0; transform: translateY(10px); filter: blur(6px); } to { opacity: 1; transform: none; filter: blur(0); } }
        @keyframes hr-orb-a { 0%,100% { transform: translate3d(0,0,0); } 50% { transform: translate3d(70px,50px,0); } }
        @keyframes hr-orb-b { 0%,100% { transform: translate3d(0,0,0); } 50% { transform: translate3d(-80px,-40px,0); } }
        @keyframes hr-pulse { 0% { box-shadow: 0 0 0 0 rgba(13,148,136,0.45); } 100% { box-shadow: 0 0 0 10px rgba(13,148,136,0); } }
        @keyframes hr-shine { from { transform: translateX(-120%) skewX(-18deg); } to { transform: translateX(260%) skewX(-18deg); } }
        @keyframes hr-grad { from { background-position: 0% 50%; } to { background-position: 100% 50%; } }
        @keyframes hr-cue { 0% { transform: translateY(0); opacity: 0; } 30% { opacity: 1; } 100% { transform: translateY(12px); opacity: 0; } }
        @media (prefers-reduced-motion: reduce) {
          [style*="hr-"], .hr-name { animation: none !important; }
        }
      `}</style>

      {/* Soft light pools and dot grid. Parallax layer: drifts slower than the page. */}
      <div
        ref={bgRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-[30%] h-[130%]"
      >
        <div
          className="absolute -left-32 top-[22%] h-[520px] w-[520px] rounded-full bg-white opacity-90 blur-[130px]"
          style={{ animation: 'hr-orb-a 20s ease-in-out infinite' }}
        />
        <div
          className="absolute -right-32 bottom-[10%] h-[560px] w-[560px] rounded-full bg-slate-300 opacity-40 blur-[150px]"
          style={{ animation: 'hr-orb-b 24s ease-in-out infinite' }}
        />
        <div
          className="absolute left-1/2 top-[40%] h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-white opacity-70 blur-[130px]"
          style={{ animation: 'hr-orb-a 28s ease-in-out infinite reverse' }}
        />
        <div
          className="absolute inset-0 opacity-[0.5]"
          style={{
            backgroundImage: 'radial-gradient(rgba(100,116,139,0.16) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
          }}
        />
      </div>

      {/* Keep Navbar outside every transformed layer so `fixed` keeps working */}
      <Navbar />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 items-center gap-10 px-6 pb-10 pt-24 sm:pt-28 md:grid-cols-[1fr_1fr] md:gap-6 md:px-10 md:pb-8 md:pt-24">
        {/* ---------------- Left: copy ---------------- */}
        <div
          ref={copyRef}
          className="order-2 flex flex-col items-start gap-5 md:order-1 md:gap-[clamp(0.75rem,2.2svh,1.5rem)]"
          style={{ opacity: 'calc(1 - var(--sp, 0) * 1.3)' }}
        >
          <Reveal delay={50} y={20}>
            <span className="hr-pressed inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[color:var(--hr-ink-2)] sm:text-xs">
              <span
                className="h-2 w-2 rounded-full bg-teal-600"
                style={{ animation: 'hr-pulse 1.8s ease-out infinite' }}
              />
              Ranchi, India · CS&apos;28 · BIT Mesra
            </span>
          </Reveal>

          <Reveal delay={150} y={40}>
            <h1 className="hero-heading font-black uppercase leading-[0.9] tracking-tighter text-[color:var(--hr-ink-2)]">
              <span className="block text-[10vw] sm:text-[6.5vw] md:text-[min(3.4vw,5.5svh)]">
                Hi, I&apos;m
              </span>
              <span className="hr-name block pb-[0.06em] text-[16vw] sm:text-[11vw] md:text-[min(6.8vw,12svh)]">
                Saurav
              </span>
            </h1>
          </Reveal>

          <Reveal delay={280} y={20}>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[color:var(--hr-ink-3)] sm:text-base">
              <RotatingRole />
            </p>
          </Reveal>

          <Reveal delay={380} y={20}>
            <p
              className="max-w-[480px] leading-relaxed text-[color:var(--hr-ink-2)]"
              style={{ fontSize: 'clamp(0.95rem, 1.35vw, 1.15rem)' }}
            >
              I build fast, secure, production-grade web apps end to end, now adding data
              analysis and machine learning.
            </p>
          </Reveal>

          <Reveal delay={480} y={20} className="flex flex-wrap items-center gap-4">
            <ContactButton />
            <a
              href="#projects"
              className={`hr-btn-ghost group/btn relative overflow-hidden rounded-full px-7 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-[color:var(--hr-ink)] sm:text-sm ${focusRing}`}
            >
              <span className="relative z-10 flex items-center gap-2">
                View work
                <span className="transition-transform duration-500 group-hover/btn:translate-x-1">→</span>
              </span>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/90 to-transparent opacity-0 group-hover/btn:opacity-100"
                style={{ animation: 'hr-shine 1.1s ease-out' }}
              />
            </a>
          </Reveal>

          {/* Ratings: an inset well */}
          <Reveal delay={580} y={20} className="w-full max-w-[520px]">
            <div className="hr-pressed grid grid-cols-3 divide-x divide-slate-400/25 overflow-hidden rounded-[26px]">
              {RATINGS.map((r) => (
                <div
                  key={r.label}
                  className="group/r relative flex flex-col gap-1 px-4 py-3 transition-colors duration-500 hover:bg-white/40 sm:px-6"
                >
                  <span className="font-mono text-lg font-semibold tabular-nums text-[color:var(--hr-ink)] sm:text-xl">
                    {r.value}
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--hr-ink-3)] sm:text-[11px]">
                    {r.label}
                  </span>
                  <span className="absolute bottom-0 left-4 right-4 h-[2px] origin-left scale-x-[0.2] rounded-full bg-slate-500/70 transition-transform duration-500 group-hover/r:scale-x-100 sm:left-6 sm:right-6" />
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* ---------------- Right: portrait ---------------- */}
        <div className="order-1 flex items-center justify-center md:order-2 md:justify-end md:pr-8">
          <div ref={portraitRef}>
            <Reveal
              delay={350}
              y={30}
              className="relative w-[240px] sm:w-[300px] md:w-[min(380px,44svh)] lg:w-[min(440px,50svh)]"
            >
              <div
                ref={stageRef}
                onMouseMove={onMove}
                onMouseLeave={onLeave}
                className="relative aspect-[4/5] w-full"
                style={{
                  perspective: '1400px',
                  '--rx': '0',
                  '--ry': '0',
                  '--px': '0',
                  '--py': '0',
                  transform: 'scale(calc(1 - var(--sp, 0) * 0.08))',
                }}
              >
                {/* Offset backing plate for depth */}
                <div
                  aria-hidden="true"
                  className="hr-pressed absolute inset-0 translate-x-4 translate-y-4 rounded-[36px] sm:translate-x-5 sm:translate-y-5 sm:rounded-[44px]"
                />

                {/* Card with a gentle tilt */}
                <div
                  className="group/card absolute inset-0 transition-transform duration-300 ease-out"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: 'rotateX(var(--rx)) rotateY(var(--ry))',
                  }}
                >
                  <div className="hr-raised absolute inset-0 rounded-[36px] p-2 sm:rounded-[44px] sm:p-2.5">
                    <div className="relative h-full w-full overflow-hidden rounded-[28px] sm:rounded-[35px]">
                      <img
                        src={myimage}
                        alt="Kumar Saurav, full-stack developer"
                        className="h-full w-full select-none object-cover transition-transform duration-700 ease-out group-hover/card:scale-[1.03]"
                        style={{ objectPosition: '50% 22%' }}
                        draggable={false}
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-black/5" />
                    </div>
                  </div>

                  {/* Tagline badge */}
                  <div
                    className="hr-raised-sm absolute -bottom-4 left-1/2 flex items-center gap-3 whitespace-nowrap rounded-full py-1.5 pl-1.5 pr-4 sm:pr-5"
                    style={{ transform: 'translateX(-50%) translateZ(40px)' }}
                  >
                    <span className="hr-pressed flex h-8 w-8 items-center justify-center rounded-full text-teal-600 sm:h-9 sm:w-9">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-4 w-4 sm:h-[18px] sm:w-[18px]"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" />
                      </svg>
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[color:var(--hr-ink)] sm:text-xs">
                      {BADGE_TEXT}
                    </span>
                  </div>
                </div>

                {/* Icon-only floating badges, with a light pointer shift */}
                {ICONS.map((ic) => (
                  <div
                    key={ic.label}
                    className={`absolute ${ic.pos} hidden sm:block`}
                    style={{
                      transform: `translate3d(calc(var(--px) * ${ic.depth}px), calc(var(--py) * ${ic.depth}px), 0)`,
                      transition: 'transform 300ms ease-out',
                    }}
                  >
                    <div
                      className="hr-raised-sm flex h-11 w-11 items-center justify-center rounded-full text-[color:var(--hr-ink-2)] transition-colors duration-300 hover:text-teal-600"
                      title={ic.label}
                      role="img"
                      aria-label={ic.label}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        {ic.path}
                      </svg>
                    </div>
                  </div>
                ))}

                {/* Vertical tagline along the right edge */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-8 top-1/2 hidden -translate-y-1/2 md:flex md:items-center md:gap-3 lg:-right-10"
                  style={{ writingMode: 'vertical-rl', transform: 'translateY(-50%) rotate(180deg)' }}
                >
                  <span className="h-10 w-px bg-gradient-to-b from-transparent via-slate-400/60 to-transparent" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-[color:var(--hr-ink-3)]">
                    {TAGLINE}
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Scroll cue: fades out as you scroll, only when the screen is tall enough */}
      <a
        href="#about"
        aria-label="Scroll to About"
        className={`absolute bottom-3 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 rounded-full ${focusRing} [@media(min-width:768px)_and_(min-height:760px)]:flex`}
        style={{ opacity: 'calc(1 - var(--sp, 0) * 6)' }}
      >
        <span className="hr-pressed flex h-9 w-6 justify-center rounded-full pt-2">
          <span
            className="h-1.5 w-1 rounded-full bg-slate-500"
            style={{ animation: 'hr-cue 1.8s ease-in-out infinite' }}
          />
        </span>
      </a>
    </section>
  );
};

export default HeroSection;