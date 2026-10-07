import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import FadeIn from './FadeIn';

const LINKS = ['About', 'Skills', 'Projects', 'Contact'];

/* Liquid-glass surface, shared across all sections. */
const glass =
  'bg-white/[0.05] backdrop-blur-2xl backdrop-saturate-[1.6] border border-white/[0.14] ' +
  'shadow-[inset_0_1px_0_rgba(255,255,255,0.28),inset_0_-1px_0_rgba(255,255,255,0.05),inset_0_0_24px_rgba(255,255,255,0.03),0_24px_70px_-24px_rgba(0,0,0,0.85)]';

const focusRing = 'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50';

/* Tracks the cursor and exposes --mx / --my for the specular highlight. */
const trackPointer = (e) => {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty('--mx', `${e.clientX - r.left}px`);
  el.style.setProperty('--my', `${e.clientY - r.top}px`);
};

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, ready: false });

  const rootRef = useRef(null);
  const itemRefs = useRef({});

  /* Scroll state only. No progress line any more. */
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setScrolled(window.scrollY > 24));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  /* Scroll-spy: highlight the section currently in the middle of the viewport. */
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const nodes = LINKS.map((l) => document.getElementById(l.toLowerCase())).filter(Boolean);
    if (!nodes.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const name = LINKS.find((l) => l.toLowerCase() === e.target.id);
            if (name) setActive(name);
          }
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );
    nodes.forEach((n) => io.observe(n));
    const clearAtTop = () => window.scrollY < 80 && setActive(null);
    window.addEventListener('scroll', clearAtTop, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', clearAtTop);
    };
  }, []);

  /* The glass bubble follows the hovered link, and rests on the active one. */
  const target = hovered || active;
  const measure = () => {
    const el = target && itemRefs.current[target];
    if (!el) {
      setIndicator((p) => ({ ...p, ready: false }));
      return;
    }
    setIndicator({ left: el.offsetLeft, width: el.offsetWidth, ready: true });
  };
  useLayoutEffect(measure, [target]);
  useEffect(() => {
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  });

  /* Close the dropdown with Escape or by clicking outside it. */
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false);
    const onDown = (e) => rootRef.current && !rootRef.current.contains(e.target) && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown);
    };
  }, [menuOpen]);

  const goTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMenuOpen(false);
  };

  const solid = scrolled || menuOpen;

  return (
    <FadeIn
      as="nav"
      delay={0}
      y={-20}
      className="pointer-events-none fixed left-0 right-0 top-0 z-50 px-4 pt-3 sm:px-6 sm:pt-4"
    >
      <style>{`
        @keyframes nv-pulse { 0% { box-shadow: 0 0 0 0 rgba(94,234,212,0.55); } 100% { box-shadow: 0 0 0 8px rgba(94,234,212,0); } }
        .nv-pulse { animation: nv-pulse 1.8s ease-out infinite; }
        /* Bright rim light: strongest top-left and bottom-right, like light catching a glass edge */
        .nv-rim::before {
          content: ''; position: absolute; inset: 0; border-radius: inherit; padding: 1px; pointer-events: none; z-index: 20;
          background: linear-gradient(135deg, rgba(255,255,255,0.6), rgba(255,255,255,0.06) 28%, rgba(255,255,255,0.02) 62%, rgba(255,255,255,0.32));
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude;
        }
        @media (prefers-reduced-motion: reduce) {
          .nv-pulse { animation: none; }
          .nv-anim { transition-duration: 1ms !important; transition-delay: 0s !important; }
        }
      `}</style>

      {/* One glass body. On mobile it morphs downward to hold the menu, like a drop of liquid. */}
      <div
        ref={rootRef}
        onMouseMove={trackPointer}
        className={`nv-rim nv-anim group/glass pointer-events-auto relative mx-auto overflow-hidden rounded-[32px] transition-[max-width,background-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${glass} ${
          solid ? '!bg-[#0C0C0C]/45 md:max-w-4xl' : 'md:max-w-6xl'
        } max-w-6xl`}
      >
        {/* Glass layers: top sheen, diagonal light, cursor specular */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-[inherit] bg-gradient-to-b from-white/[0.16] to-transparent" />
        <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-br from-white/[0.1] via-transparent to-white/[0.04]" />
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover/glass:opacity-100"
          style={{
            background:
              'radial-gradient(300px circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.16), transparent 60%)',
          }}
        />

        {/* Header row */}
        <div
          className={`nv-anim relative z-10 flex items-center justify-between transition-[padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            scrolled ? 'px-3 py-2 sm:px-4' : 'px-4 py-3 sm:px-6'
          }`}
        >
          {/* Logo */}
          <a
            href="#home"
            onClick={goTop}
            className={`group/logo flex items-center gap-2.5 rounded-full pl-1.5 pr-3 text-[#F4F1EA] ${focusRing}`}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-white/[0.12] text-[11px] font-black uppercase tracking-tight shadow-[inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-4px_8px_rgba(255,255,255,0.06),0_6px_16px_-6px_rgba(0,0,0,0.7)] backdrop-blur-xl transition-transform duration-500 ease-[cubic-bezier(0.34,1.4,0.5,1)] group-hover/logo:scale-110 group-hover/logo:-rotate-6">
              KS
            </span>
            <span className="text-sm font-semibold uppercase tracking-[0.2em]">
              Saurav
              <span className="ml-0.5 text-[#5EEAD4]">.</span>
            </span>
          </a>

          {/* Desktop links with a liquid glass bubble that follows hover and rests on the active link */}
          <div
            className="relative hidden items-center md:flex"
            onMouseLeave={() => setHovered(null)}
          >
            <span
              aria-hidden="true"
              className="nv-anim absolute inset-y-0 rounded-full border border-white/30 bg-white/[0.13] shadow-[inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-6px_12px_rgba(255,255,255,0.05),0_8px_24px_-8px_rgba(0,0,0,0.7)] backdrop-blur-xl transition-[left,width,opacity] duration-[600ms] ease-[cubic-bezier(0.34,1.4,0.5,1)]"
              style={{
                left: indicator.left,
                width: indicator.width,
                opacity: indicator.ready ? (hovered && hovered !== active ? 0.7 : 1) : 0,
              }}
            />
            {LINKS.map((link) => (
              <a
                key={link}
                ref={(el) => (itemRefs.current[link] = el)}
                href={`#${link.toLowerCase()}`}
                onClick={() => setActive(link)}
                onMouseEnter={() => setHovered(link)}
                onFocus={() => setHovered(link)}
                onBlur={() => setHovered(null)}
                aria-current={active === link ? 'page' : undefined}
                className={`relative rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition-colors duration-500 ${focusRing} ${
                  target === link ? 'text-[#F4F1EA]' : 'text-[#D7E2EA]/60'
                }`}
              >
                {link}
              </a>
            ))}
          </div>

          {/* Resume CTA + mobile toggle */}
          <div className="flex items-center gap-2">
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className={`group/cta relative hidden items-center gap-2 overflow-hidden rounded-full border border-white/30 bg-white/[0.1] px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#F4F1EA] shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_8px_20px_-10px_rgba(0,0,0,0.7)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-0.5 hover:bg-white/[0.18] active:translate-y-0 active:scale-95 md:inline-flex ${focusRing}`}
            >
              {/* Light sweep on hover */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-[900ms] ease-out group-hover/cta:translate-x-[320%]"
              />
              <span className="nv-pulse relative h-1.5 w-1.5 rounded-full bg-[#5EEAD4]" />
              <span className="relative">Resume</span>
              <span className="relative transition-transform duration-500 group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5">
                ↗
              </span>
            </a>

            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="nv-menu"
              className={`flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/[0.1] shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] backdrop-blur-xl transition-transform duration-300 active:scale-90 md:hidden ${focusRing}`}
            >
              <span className="relative block h-3 w-5">
                <span
                  className={`absolute left-0 h-[1.5px] w-5 rounded-full bg-[#F4F1EA] transition-all duration-500 ease-[cubic-bezier(0.34,1.4,0.5,1)] ${
                    menuOpen ? 'top-1/2 rotate-45' : 'top-0'
                  }`}
                />
                <span
                  className={`absolute left-0 top-1/2 h-[1.5px] w-5 -translate-y-1/2 rounded-full bg-[#F4F1EA] transition-all duration-300 ${
                    menuOpen ? 'scale-x-0 opacity-0' : ''
                  }`}
                />
                <span
                  className={`absolute left-0 h-[1.5px] w-5 rounded-full bg-[#F4F1EA] transition-all duration-500 ease-[cubic-bezier(0.34,1.4,0.5,1)] ${
                    menuOpen ? 'top-1/2 -rotate-45' : 'bottom-0'
                  }`}
                />
              </span>
            </button>
          </div>
        </div>

        {/* Dropdown: grid rows animate 0fr -> 1fr, so the glass body smoothly grows to fit the menu */}
        <div
          id="nv-menu"
          aria-hidden={!menuOpen}
          className="nv-anim relative z-10 grid transition-[grid-template-rows] duration-[550ms] ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden"
          style={{ gridTemplateRows: menuOpen ? '1fr' : '0fr' }}
        >
          <div className="min-h-0 overflow-hidden">
            <div className="mx-3 border-t border-white/10 pb-3 pt-3 sm:mx-4">
              <div className="flex flex-col gap-1">
                {LINKS.map((link, i) => {
                  const on = active === link;
                  return (
                    <a
                      key={link}
                      href={`#${link.toLowerCase()}`}
                      tabIndex={menuOpen ? 0 : -1}
                      onClick={() => {
                        setActive(link);
                        setMenuOpen(false);
                      }}
                      className={`nv-anim group/item relative flex items-center gap-4 rounded-[20px] border px-5 py-3.5 text-sm font-semibold uppercase tracking-[0.2em] ${focusRing} ${
                        on
                          ? 'border-white/25 bg-white/[0.13] text-[#F4F1EA] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]'
                          : 'border-transparent text-[#D7E2EA]/65 hover:bg-white/[0.07]'
                      }`}
                      style={{
                        opacity: menuOpen ? 1 : 0,
                        transform: menuOpen ? 'none' : 'translateY(-12px) scale(0.97)',
                        transition: `opacity 350ms ease ${menuOpen ? 120 + i * 55 : 0}ms, transform 550ms cubic-bezier(0.22,1,0.36,1) ${menuOpen ? 120 + i * 55 : 0}ms, background-color 300ms, border-color 300ms`,
                      }}
                    >
                      <span className="text-[10px] tabular-nums text-[#5EEAD4]">0{i + 1}</span>
                      <span className="flex-1">{link}</span>
                      <span className="text-[#D7E2EA]/40 transition-transform duration-300 group-hover/item:translate-x-1">→</span>
                    </a>
                  );
                })}
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  tabIndex={menuOpen ? 0 : -1}
                  className={`nv-anim mt-1 flex items-center justify-center gap-2 rounded-[20px] border border-white/30 bg-white/[0.13] px-5 py-3.5 text-sm font-semibold uppercase tracking-[0.2em] text-[#F4F1EA] shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] active:scale-[0.98] ${focusRing}`}
                  style={{
                    opacity: menuOpen ? 1 : 0,
                    transform: menuOpen ? 'none' : 'translateY(-12px) scale(0.97)',
                    transition: `opacity 350ms ease ${menuOpen ? 120 + LINKS.length * 55 : 0}ms, transform 550ms cubic-bezier(0.22,1,0.36,1) ${menuOpen ? 120 + LINKS.length * 55 : 0}ms`,
                  }}
                >
                  <span className="nv-pulse h-1.5 w-1.5 rounded-full bg-[#5EEAD4]" />
                  Resume ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FadeIn>
  );
};

export default Navbar;