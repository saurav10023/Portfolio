import { useEffect, useRef, useState } from 'react';
import FadeIn from './FadeIn';
import ContactButton from './ContactButton';
import Navbar from './Navbar';
import myimage from '../assets/myimage.png';

/* Ratings come from the resume. */
const RATINGS = [
  { label: 'LeetCode', value: '1635', accent: '#FBBF24' },
  { label: 'CodeChef', value: '1451', accent: '#A78BFA' },
  { label: 'Codeforces', value: '1126', accent: '#38BDF8' },
];

const ROLES = ['Full-Stack Engineer', 'Backend Developer', 'Data & ML Learner'];

/* Floating glass chips around the portrait. `depth` drives parallax with the tilt. */
const CHIPS = [
  { label: 'React', accent: '#5EEAD4', pos: 'top-[6%] -left-[10%]', delay: '0s', depth: 40 },
  { label: 'Node.js', accent: '#A3E635', pos: 'top-[30%] -right-[12%]', delay: '1.2s', depth: 60 },
  { label: 'MongoDB', accent: '#38BDF8', pos: 'bottom-[26%] -left-[14%]', delay: '0.6s', depth: 55 },
  { label: 'Python · ML', accent: '#FB7185', pos: 'bottom-[4%] right-[2%]', delay: '1.8s', depth: 45 },
];

/* Liquid-glass surface, shared across all sections. */
const glass =
  'bg-white/[0.05] backdrop-blur-2xl backdrop-saturate-[1.6] border border-white/[0.14] ' +
  'shadow-[inset_0_1px_0_rgba(255,255,255,0.28),inset_0_-1px_0_rgba(255,255,255,0.05),inset_0_0_24px_rgba(255,255,255,0.03),0_24px_70px_-24px_rgba(0,0,0,0.85)]';

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
      className="inline-block text-[#F4F1EA]"
      style={{ animation: 'hr-word 600ms cubic-bezier(0.22,1,0.36,1) both' }}
    >
      {ROLES[i]}
    </span>
  );
};

const HeroSection = () => {
  const stageRef = useRef(null);
  const frame = useRef(0);

  /* Pointer-driven 3D tilt: writes CSS variables, no re-renders. */
  const onMove = (e) => {
    if (reducedMotion()) return;
    const el = stageRef.current;
    if (!el) return;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty('--rx', `${(-py * 10).toFixed(2)}deg`);
      el.style.setProperty('--ry', `${(px * 12).toFixed(2)}deg`);
      el.style.setProperty('--px', px.toFixed(3));
      el.style.setProperty('--py', py.toFixed(3));
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
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
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-[#0C0C0C] md:h-[100svh]"
      style={{ overflowX: 'clip' }}
    >
      <style>{`
        @keyframes hr-word { from { opacity: 0; transform: translateY(10px); filter: blur(6px); } to { opacity: 1; transform: none; filter: blur(0); } }
        @keyframes hr-chip { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes hr-orb-a { 0%,100% { transform: translate3d(0,0,0); } 50% { transform: translate3d(70px,50px,0); } }
        @keyframes hr-orb-b { 0%,100% { transform: translate3d(0,0,0); } 50% { transform: translate3d(-80px,-40px,0); } }
        @keyframes hr-spin { to { transform: rotate(360deg); } }
        @keyframes hr-pulse { 0% { box-shadow: 0 0 0 0 rgba(94,234,212,0.55); } 100% { box-shadow: 0 0 0 10px rgba(94,234,212,0); } }
        @keyframes hr-shine { from { transform: translateX(-120%) skewX(-18deg); } to { transform: translateX(260%) skewX(-18deg); } }
        .hr-name {
          background: linear-gradient(100deg, #F4F1EA 10%, #5EEAD4 40%, #A78BFA 70%, #FB7185 95%);
          background-size: 220% 100%;
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent; color: transparent;
          animation: hr-grad 9s ease-in-out infinite alternate;
        }
        @keyframes hr-grad { from { background-position: 0% 50%; } to { background-position: 100% 50%; } }
        @media (prefers-reduced-motion: reduce) {
          [style*="hr-"], .hr-name { animation: none !important; }
        }
      `}</style>

      {/* Colour orbs, dot grid and vignette behind the glass */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="absolute -left-32 top-10 h-[520px] w-[520px] rounded-full bg-[#5EEAD4] opacity-[0.22] blur-[140px]"
          style={{ animation: 'hr-orb-a 20s ease-in-out infinite' }}
        />
        <div
          className="absolute -right-32 bottom-0 h-[560px] w-[560px] rounded-full bg-[#A78BFA] opacity-[0.26] blur-[150px]"
          style={{ animation: 'hr-orb-b 24s ease-in-out infinite' }}
        />
        <div
          className="absolute left-1/2 top-1/3 h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-[#FB7185] opacity-[0.10] blur-[130px]"
          style={{ animation: 'hr-orb-a 28s ease-in-out infinite reverse' }}
        />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.12) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.05),transparent_60%)]" />
      </div>

      <Navbar />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 items-center gap-10 px-6 pb-10 pt-24 sm:pt-28 md:grid-cols-[1fr_1fr] md:gap-6 md:px-10 md:pb-8 md:pt-24">
        {/* ---------------- Left: copy ---------------- */}
        <div className="order-2 flex flex-col items-start gap-5 md:order-1 md:gap-[clamp(0.75rem,2.2svh,1.5rem)]">
          <FadeIn delay={0.05} y={20}>
            <span
              className={`inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-[10px] font-medium uppercase tracking-[0.3em] text-[#D7E2EA]/75 sm:text-xs ${glass}`}
            >
              <span
                className="h-2 w-2 rounded-full bg-[#5EEAD4]"
                style={{ animation: 'hr-pulse 1.8s ease-out infinite' }}
              />
              Ranchi, India · CS&apos;28 · BIT Mesra
            </span>
          </FadeIn>

          <FadeIn delay={0.15} y={40}>
            <h1 className="hero-heading font-black uppercase leading-[0.9] tracking-tighter text-[#D7E2EA]">
              <span className="block text-[10vw] sm:text-[6.5vw] md:text-[min(3.4vw,5.5svh)]">
                Hi, I&apos;m
              </span>
              <span className="hr-name block pb-[0.06em] text-[16vw] sm:text-[11vw] md:text-[min(6.8vw,12svh)]">
                Saurav
              </span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.28} y={20}>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#D7E2EA]/55 sm:text-base">
              <RotatingRole />
            </p>
          </FadeIn>

          <FadeIn delay={0.38} y={20}>
            <p
              className="max-w-[480px] leading-relaxed text-[#D7E2EA]/70"
              style={{ fontSize: 'clamp(0.95rem, 1.35vw, 1.15rem)' }}
            >
              I build fast, secure, production-grade web apps end to end, now adding data
              analysis and machine learning.
            </p>
          </FadeIn>

          <FadeIn delay={0.48} y={20} className="flex flex-wrap items-center gap-4">
            <ContactButton />
            <a
              href="#projects"
              className={`group/btn relative overflow-hidden rounded-full px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#F4F1EA] transition-all duration-500 hover:-translate-y-0.5 hover:bg-white/[0.1] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 sm:text-sm ${glass}`}
            >
              <span className="relative z-10 flex items-center gap-2">
                View work
                <span className="transition-transform duration-500 group-hover/btn:translate-x-1">→</span>
              </span>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 group-hover/btn:opacity-100"
                style={{ animation: 'hr-shine 1.1s ease-out' }}
              />
            </a>
          </FadeIn>

          {/* Glass ratings bar */}
          <FadeIn delay={0.58} y={20} className="w-full max-w-[520px]">
            <div className={`grid grid-cols-3 divide-x divide-white/10 overflow-hidden rounded-[26px] ${glass}`}>
              {RATINGS.map((r) => (
                <div
                  key={r.label}
                  className="group/r relative flex flex-col gap-1 px-4 py-3 transition-colors duration-500 hover:bg-white/[0.06] sm:px-6"
                >
                  <span className="font-mono text-lg font-semibold tabular-nums text-[#F4F1EA] sm:text-xl">
                    {r.value}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#D7E2EA]/50 sm:text-[11px]">
                    {r.label}
                  </span>
                  <span
                    className="absolute bottom-0 left-4 right-4 h-[2px] origin-left scale-x-[0.25] rounded-full transition-transform duration-500 group-hover/r:scale-x-100 sm:left-6 sm:right-6"
                    style={{ backgroundColor: r.accent }}
                  />
                </div>
              ))}
            </div>
          </FadeIn>
        </div>

        {/* ---------------- Right: tilting glass portrait ---------------- */}
        <div className="order-1 flex items-center justify-center md:order-2 md:justify-end md:pr-4">
          <FadeIn delay={0.35} y={30} className="relative w-[230px] sm:w-[290px] md:w-[min(400px,46svh)] lg:w-[min(480px,52svh)]">
            <div
              ref={stageRef}
              onMouseMove={onMove}
              onMouseLeave={onLeave}
              className="relative aspect-[5/6] w-full"
              style={{ perspective: '1200px', '--rx': '0', '--ry': '0', '--px': '0', '--py': '0' }}
            >
              {/* Tilting card */}
              <div
                className="group/glass absolute inset-0 transition-transform duration-300 ease-out"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: 'rotateX(var(--rx)) rotateY(var(--ry))',
                }}
              >
                {/* Rotating light-catch ring behind the glass */}
                <div className="absolute -inset-[3px] overflow-hidden rounded-[44px] sm:rounded-[56px]">
                  <div
                    className="absolute left-1/2 top-1/2 aspect-square w-[160%] -translate-x-1/2 -translate-y-1/2 opacity-70"
                    style={{
                      background:
                        'conic-gradient(from 0deg, transparent 0%, #5EEAD4 12%, transparent 28%, transparent 50%, #A78BFA 64%, transparent 80%, #FB7185 92%, transparent 100%)',
                      animation: 'hr-spin 9s linear infinite',
                    }}
                  />
                </div>

                {/* Glass frame */}
                <div className={`absolute inset-0 rounded-[42px] p-3 sm:rounded-[54px] sm:p-4 ${glass} !bg-[#101114]/70`}>
                  <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-br from-white/[0.16] via-transparent to-white/[0.04]" />
                  <div
                    className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover/glass:opacity-100"
                    style={{
                      background:
                        'radial-gradient(320px circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.16), transparent 60%)',
                    }}
                  />

                  {/* Portrait */}
                  <div className="relative h-full w-full overflow-hidden rounded-[30px] bg-[#0B0F14] ring-1 ring-white/10 sm:rounded-[40px]">
                    <img
                      src={myimage}
                      alt="Kumar Saurav, full-stack developer"
                      className="h-full w-full select-none object-cover transition-transform duration-[900ms] ease-out group-hover/glass:scale-[1.04]"
                      style={{ objectPosition: '50% 22%' }}
                      draggable={false}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0C0C0C]/55 via-transparent to-transparent" />
                    <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_0_40px_rgba(0,0,0,0.3)]" />
                  </div>
                </div>

                {/* Live-project glass card, lifted forward in 3D */}
                <div
                  className={`absolute -bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-3 whitespace-nowrap rounded-full px-4 py-2.5 sm:px-5 ${glass} !bg-[#131417]/70`}
                  style={{ transform: 'translateX(-50%) translateZ(70px)' }}
                >
                  <span
                    className="h-2 w-2 rounded-full bg-[#5EEAD4]"
                    style={{ animation: 'hr-pulse 1.8s ease-out infinite' }}
                  />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#F4F1EA] sm:text-xs">
                    School Cart
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#D7E2EA]/50 sm:text-xs">
                    Live in production
                  </span>
                </div>
              </div>

              {/* Floating glass chips: parallax layer above the card */}
              {CHIPS.map((chip) => (
                <div
                  key={chip.label}
                  className={`absolute ${chip.pos} hidden sm:block`}
                  style={{
                    transform: `translate3d(calc(var(--px) * ${chip.depth}px), calc(var(--py) * ${chip.depth}px), 0)`,
                    transition: 'transform 300ms ease-out',
                  }}
                >
                  <div
                    className={`flex items-center gap-2 rounded-full px-4 py-2.5 ${glass} !bg-[#131417]/60`}
                    style={{ animation: 'hr-chip 5s ease-in-out infinite', animationDelay: chip.delay }}
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: chip.accent, boxShadow: `0 0 12px ${chip.accent}` }}
                    />
                    <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#F4F1EA]">
                      {chip.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;