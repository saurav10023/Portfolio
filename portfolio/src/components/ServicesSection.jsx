import FadeIn from './FadeIn';
import { services } from '../data/services';

/* Liquid-glass surface: same recipe as the Projects section. */
const glass =
  'bg-white/[0.05] backdrop-blur-2xl backdrop-saturate-[1.6] border border-white/[0.14] ' +
  'shadow-[inset_0_1px_0_rgba(255,255,255,0.28),inset_0_-1px_0_rgba(255,255,255,0.05),inset_0_0_24px_rgba(255,255,255,0.03),0_24px_70px_-24px_rgba(0,0,0,0.85)]';

/* Tracks the cursor and exposes --mx / --my for the specular highlight. */
const trackPointer = (e) => {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty('--mx', `${e.clientX - r.left}px`);
  el.style.setProperty('--my', `${e.clientY - r.top}px`);
};

const Specular = ({ accent }) => (
  <>
    <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-br from-white/[0.14] via-transparent to-white/[0.03]" />
    <div
      className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover/glass:opacity-100"
      style={{
        background: `radial-gradient(360px circle at var(--mx, 50%) var(--my, 50%), ${accent}26, transparent 60%)`,
      }}
    />
  </>
);

const ServiceCard = ({ service }) => {
  const learning = service.status === 'learning';

  return (
    <div
      onMouseMove={trackPointer}
      className={`group/glass relative flex h-full flex-col gap-5 overflow-hidden rounded-[32px] p-6 transition-transform duration-500 hover:-translate-y-1 sm:rounded-[40px] sm:p-8 ${glass}`}
    >
      <Specular accent={service.accent} />

      {/* Header: number + status */}
      <div className="relative flex items-start justify-between gap-4">
        <span
          className="font-black leading-none tabular-nums"
          style={{ fontSize: 'clamp(2.75rem, 6vw, 4.5rem)', color: service.accent }}
        >
          {service.number}
        </span>
        <span
          className="rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] backdrop-blur-md"
          style={{
            color: learning ? '#F4F1EA' : service.accent,
            borderColor: learning ? 'rgba(255,255,255,0.25)' : `${service.accent}66`,
            backgroundColor: learning ? 'rgba(255,255,255,0.08)' : `${service.accent}14`,
          }}
        >
          {learning ? 'Currently Learning' : 'Shipped'}
        </span>
      </div>

      {/* Title + description */}
      <div className="relative flex flex-col gap-3">
        <h3 className="text-xl font-semibold uppercase leading-[1.1] tracking-tight text-[#F4F1EA] sm:text-2xl">
          {service.name}
        </h3>
        <p className="text-sm leading-relaxed text-[#D7E2EA]/70 sm:text-base">
          {service.description}
        </p>
      </div>

      {/* Highlights drawn from the resume */}
      <ul className="relative flex flex-col gap-2.5">
        {service.highlights.map((h) => (
          <li key={h} className="flex items-start gap-3 text-sm leading-snug text-[#D7E2EA]/80">
            <span
              className="mt-[7px] h-1.5 w-1.5 flex-shrink-0 rounded-full"
              style={{ backgroundColor: service.accent }}
            />
            {h}
          </li>
        ))}
      </ul>

      {/* Stack chips */}
      <div className="relative mt-auto flex flex-wrap gap-2 pt-2">
        {service.stack.map((tech) => (
          <span
            key={tech}
            className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-[10px] font-medium uppercase tracking-wide text-[#F4F1EA]/85 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-md sm:text-xs"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
};

const ServicesSection = () => {
  const first = services[0]?.accent ?? '#5EEAD4';
  const last = services[services.length - 1]?.accent ?? '#FB7185';

  return (
    <section
      id="price"
      className="relative z-10 -mt-10 overflow-hidden rounded-t-[40px] bg-[#0C0C0C] px-5 py-20 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 sm:py-24 md:-mt-14 md:rounded-t-[60px] md:px-10 md:py-32"
    >
      <style>{`
        @keyframes sv-float-a { 0%,100% { transform: translate3d(0,0,0); } 50% { transform: translate3d(60px,40px,0); } }
        @keyframes sv-float-b { 0%,100% { transform: translate3d(0,0,0); } 50% { transform: translate3d(-70px,-30px,0); } }
        @media (prefers-reduced-motion: reduce) {
          [style*="sv-float"] { animation: none !important; }
        }
      `}</style>

      {/* Colour orbs behind the glass */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -left-24 top-24 h-[420px] w-[420px] rounded-full opacity-30 blur-[120px]"
          style={{ backgroundColor: first, animation: 'sv-float-a 18s ease-in-out infinite' }}
        />
        <div
          className="absolute -right-20 bottom-10 h-[460px] w-[460px] rounded-full opacity-25 blur-[130px]"
          style={{ backgroundColor: last, animation: 'sv-float-b 22s ease-in-out infinite' }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.04),transparent_60%)]" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <FadeIn delay={0}>
          <div className="mb-14 text-center sm:mb-20 md:mb-24">
            <span className="inline-block rounded-full border border-white/15 bg-white/[0.06] px-4 py-1.5 text-[10px] uppercase tracking-[0.4em] text-[#D7E2EA]/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] backdrop-blur-xl sm:text-xs">
              What I Do
            </span>
            <h2
              className="hero-heading mt-6 font-black uppercase"
              style={{ fontSize: 'clamp(3rem, 12vw, 160px)', lineHeight: 1 }}
            >
              Services
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-[#D7E2EA]/60 sm:text-base">
              Production-grade full-stack engineering, backed by 500+ solved DSA problems and
              a growing practice in data analysis and machine learning.
            </p>
          </div>
        </FadeIn>

        <div className="grid gap-5 md:grid-cols-2 lg:gap-8">
          {services.map((service, i) => (
            <FadeIn key={service.number} delay={(i % 2) * 0.1} y={40}>
              <ServiceCard service={service} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;