import { useEffect, useLayoutEffect, useRef, useState } from 'react';

const LINKS = ['About', 'Projects','Skills' , 'Contact'];

const focusRing =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent';

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

  /* Scroll state */
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

  /* The pressed-in bubble follows the hovered link, and rests on the active one. */
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
    <nav className="pointer-events-none fixed left-0 right-0 top-0 z-50 px-4 pt-3 sm:px-6 sm:pt-4">
      <style>{`
        :root {
          --nv-ink: #3b4352;
          --nv-ink-2: #667085;
          --nv-ink-3: #98a1b2;
          --nv-lo: rgba(143,157,180,.5);
          --nv-hi: rgba(255,255,255,.95);
        }

        /* Neumorphic surfaces */
        .nv-raised {
          background: linear-gradient(145deg, #f3f5f9, #e1e6ee);
          border: 1px solid rgba(255,255,255,.75);
          box-shadow: 4px 4px 10px var(--nv-lo), -4px -4px 10px var(--nv-hi);
        }
        .nv-pressed {
          background: linear-gradient(145deg, rgba(212,218,229,.6), rgba(241,244,248,.55));
          border: 1px solid rgba(255,255,255,.4);
          box-shadow: inset 3px 3px 7px rgba(143,157,180,.55), inset -3px -3px 7px var(--nv-hi);
        }
        .nv-raised-btn { transition: box-shadow .3s ease, transform .2s ease, color .3s ease; }
        .nv-raised-btn:active {
          transform: scale(.97);
          box-shadow: inset 3px 3px 7px var(--nv-lo), inset -3px -3px 7px var(--nv-hi);
        }

        /* Clear liquid glass body */
        .nv-glass {
          background-color: rgba(255,255,255,.16);
          -webkit-backdrop-filter: blur(12px) saturate(180%) brightness(1.04);
          backdrop-filter: blur(12px) saturate(180%) brightness(1.04);
          border: 1px solid rgba(255,255,255,.55);
          box-shadow:
            10px 12px 28px -10px rgba(143,157,180,.6),
            -8px -8px 22px -8px rgba(255,255,255,.9),
            inset 0 1px 1px rgba(255,255,255,.95),
            inset 0 -1px 1px rgba(143,157,180,.3),
            inset 3px 3px 10px rgba(255,255,255,.35),
            inset -3px -3px 10px rgba(255,255,255,.18);
        }
        .nv-glass[data-solid="true"] { background-color: rgba(240,243,248,.5); }
        /* Real refraction on Chromium desktop. Other browsers keep the clean blur above. */
        @media (min-width: 768px) and (hover: hover) {
          .nv-glass { backdrop-filter: blur(6px) url(#nv-liquid) saturate(180%) brightness(1.05); }
        }

        /* Bright rim: light top-left, soft shadow bottom-right, like a glass edge */
        .nv-rim::before {
          content: ''; position: absolute; inset: 0; border-radius: inherit; padding: 1px; pointer-events: none; z-index: 20;
          background: linear-gradient(135deg, rgba(255,255,255,1), rgba(255,255,255,0) 30%, rgba(255,255,255,0) 66%, rgba(143,157,180,.4));
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude;
        }


        @media (prefers-reduced-motion: reduce) {
          .nv-anim { transition-duration: 1ms !important; transition-delay: 0s !important; }
        }
        @supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
          .nv-glass { background-color: rgba(236,240,246,.95); }
        }
      `}</style>

      {/* Refraction filter used by the glass body (desktop Chromium only) */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
        <filter id="nv-liquid" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.008 0.016" numOctaves="2" seed="7" result="noise" />
          <feGaussianBlur in="noise" stdDeviation="3" result="soft" />
          <feDisplacementMap in="SourceGraphic" in2="soft" scale="26" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      {/* One glass body. On mobile it morphs downward to hold the menu. */}
      <div
        ref={rootRef}
        onMouseMove={trackPointer}
        data-solid={solid}
        className={`nv-glass nv-rim nv-anim group/glass pointer-events-auto relative mx-auto max-w-6xl overflow-hidden rounded-[32px] transition-[max-width,background-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          solid ? 'md:max-w-4xl' : 'md:max-w-6xl'
        }`}
      >
        {/* Glass layers: top sheen, diagonal light, cursor specular */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-[inherit] bg-gradient-to-b from-white/60 to-transparent" />
        <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-br from-white/40 via-transparent to-white/10" />
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover/glass:opacity-100"
          style={{
            background:
              'radial-gradient(300px circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.65), transparent 60%)',
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
            className={`group/logo flex items-center gap-2.5 rounded-full pl-1.5 pr-3 text-[color:var(--nv-ink)] ${focusRing}`}
          >
            <span className="nv-raised flex h-9 w-9 items-center justify-center rounded-full text-[11px] font-black uppercase tracking-tight text-[color:var(--nv-ink-2)]">
              KS
            </span>
            <span className="text-sm font-bold uppercase tracking-[0.2em]">
              Saurav
              <span className="ml-0.5 text-[color:var(--nv-ink-3)]">.</span>
            </span>
          </a>

          {/* Desktop links with a pressed-in bubble that follows hover and rests on the active link */}
          <div className="relative hidden items-center md:flex" onMouseLeave={() => setHovered(null)}>
            <span
              aria-hidden="true"
              className="nv-pressed nv-anim absolute inset-y-0 rounded-full transition-[left,width,opacity] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
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
                className={`relative rounded-full px-5 py-2 text-xs font-bold uppercase tracking-[0.2em] transition-colors duration-500 ${focusRing} ${
                  target === link ? 'text-[color:var(--nv-ink)]' : 'text-[color:var(--nv-ink-2)]'
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
              className={`nv-raised nv-raised-btn group/cta relative hidden items-center gap-2 overflow-hidden rounded-full px-5 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[color:var(--nv-ink)] md:inline-flex ${focusRing}`}
            >
              <span className="relative h-1.5 w-1.5 rounded-full bg-teal-600" />
              <span className="relative">Resume</span>
              <span className="relative">
                ↗
              </span>
            </a>

            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="nv-menu"
              className={`${menuOpen ? 'nv-pressed' : 'nv-raised'} nv-raised-btn flex h-10 w-10 items-center justify-center rounded-full md:hidden ${focusRing}`}
            >
              <span className="relative block h-3 w-5">
                <span
                  className={`absolute left-0 h-[1.5px] w-5 rounded-full bg-[color:var(--nv-ink)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    menuOpen ? 'top-1/2 rotate-45' : 'top-0'
                  }`}
                />
                <span
                  className={`absolute left-0 top-1/2 h-[1.5px] w-5 -translate-y-1/2 rounded-full bg-[color:var(--nv-ink)] transition-all duration-300 ${
                    menuOpen ? 'scale-x-0 opacity-0' : ''
                  }`}
                />
                <span
                  className={`absolute left-0 h-[1.5px] w-5 rounded-full bg-[color:var(--nv-ink)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
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
            <div className="mx-3 border-t border-slate-400/20 px-1 pb-4 pt-4 sm:mx-4">
              <div className="flex flex-col gap-3">
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
                      className={`nv-anim group/item relative flex items-center gap-4 rounded-[20px] px-5 py-3.5 text-sm font-bold uppercase tracking-[0.2em] ${focusRing} ${
                        on
                          ? 'nv-pressed text-[color:var(--nv-ink)]'
                          : 'nv-raised text-[color:var(--nv-ink-2)]'
                      }`}
                      style={{
                        opacity: menuOpen ? 1 : 0,
                        transform: menuOpen ? 'none' : 'translateY(-12px) scale(0.97)',
                        transition: `opacity 350ms ease ${menuOpen ? 120 + i * 55 : 0}ms, transform 550ms cubic-bezier(0.22,1,0.36,1) ${menuOpen ? 120 + i * 55 : 0}ms, box-shadow 300ms, color 300ms`,
                      }}
                    >
                      <span className="text-[10px] tabular-nums text-[color:var(--nv-ink-3)]">0{i + 1}</span>
                      <span className="flex-1">{link}</span>
                      <span className="text-[color:var(--nv-ink-3)] transition-transform duration-300 group-hover/item:translate-x-1">→</span>
                    </a>
                  );
                })}
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  tabIndex={menuOpen ? 0 : -1}
                  className={`nv-anim mt-1 flex items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-bold uppercase tracking-[0.2em] text-white active:scale-[0.98] ${focusRing}`}
                  style={{
                    background: 'linear-gradient(145deg, #8d95a6, #6a7284)',
                    border: '1px solid rgba(255,255,255,.45)',
                    boxShadow: '5px 6px 14px -4px rgba(88,99,120,.55), -3px -3px 8px rgba(255,255,255,.85), inset 0 1px 0 rgba(255,255,255,.35)',
                    opacity: menuOpen ? 1 : 0,
                    transform: menuOpen ? 'none' : 'translateY(-12px) scale(0.97)',
                    transition: `opacity 350ms ease ${menuOpen ? 120 + LINKS.length * 55 : 0}ms, transform 550ms cubic-bezier(0.22,1,0.36,1) ${menuOpen ? 120 + LINKS.length * 55 : 0}ms`,
                  }}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  Resume ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;