const focusRing =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#e9edf3]';

const ContactButton = ({ className = '' }) => {
  return (
    <a
      href="#contact"
      className={`cb-btn group/cb relative inline-flex items-center gap-2.5 overflow-hidden rounded-full px-7 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-white sm:text-sm ${focusRing} ${className}`}
    >
      <style>{`
        .cb-btn {
          background: linear-gradient(145deg, #7b8496, #596175);
          border: 1px solid rgba(255,255,255,.45);
          box-shadow:
            5px 6px 14px -3px rgba(88,99,120,.6),
            -4px -4px 10px rgba(255,255,255,.9),
            inset 0 1px 0 rgba(255,255,255,.35);
          transition: box-shadow .3s ease, transform .25s ease, filter .3s ease;
        }
        .cb-btn:hover { transform: translateY(-2px); filter: brightness(1.06); }
        .cb-btn:active {
          transform: scale(.98);
          box-shadow:
            inset 3px 3px 8px rgba(40,48,64,.55),
            inset -2px -2px 6px rgba(255,255,255,.18);
        }
        @keyframes cb-shine {
          from { transform: translateX(-120%) skewX(-18deg); }
          to { transform: translateX(260%) skewX(-18deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .cb-btn span[style*="cb-shine"] { animation: none !important; }
        }
      `}</style>

      <span className="relative z-10 h-1.5 w-1.5 rounded-full bg-teal-300" />
      <span className="relative z-10">Contact Me</span>
      <span className="relative z-10 transition-transform duration-500 group-hover/cb:translate-x-1">
        →
      </span>

      {/* Shine sweep on hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover/cb:opacity-100"
        style={{ animation: 'cb-shine 1.1s ease-out' }}
      />
    </a>
  );
};

export default ContactButton;