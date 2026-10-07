import FadeIn from './FadeIn';
import AnimatedText from './AnimatedText';
import ContactButton from './ContactButton';

const MOON_URL =
  'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png';
const OBJECT_URL =
  'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png';
const LEGO_URL =
  'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png';
const GROUP_URL =
  'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png';

const ABOUT_TEXT =
  'Third-year Computer Science student at BIT Mesra who builds and ships production software, owning each project from requirements to deployment. Now extending a strong engineering foundation into data analysis and machine learning.';

// Concise "at a glance" facts, all from the resume.
const FACTS = [
  {
    label: 'Education',
    accent: '#5EEAD4',
    value: 'B.Tech, Computer Science',
    detail: 'BIT Mesra · Class of 2028',
  },
  {
    label: 'Shipped',
    accent: '#A78BFA',
    value: 'School Cart, Bachpan School',
    detail: 'Two live products serving real users',
  },
  {
    label: 'Exploring',
    accent: '#FB7185',
    value: 'EDA, Feature Engineering, ML',
    detail: 'Building on a DSA and backend base',
  },
];

// Decorative corner art, pinned to the true corners so it never crowds the content.
const CORNER_DECOR = [
  { src: MOON_URL, pos: 'top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8', size: 'w-[64px] sm:w-[96px] md:w-[130px]', delay: 0.1, mobile: true, float: 'ab-float-a 9s' },
  { src: LEGO_URL, pos: 'top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-8', size: 'w-[64px] sm:w-[96px] md:w-[130px]', delay: 0.15, mobile: true, float: 'ab-float-b 11s' },
  { src: OBJECT_URL, pos: 'bottom-4 left-4 sm:bottom-6 sm:left-6 md:bottom-8 md:left-8', size: 'w-[56px] sm:w-[84px] md:w-[110px]', delay: 0.25, mobile: false, float: 'ab-float-b 10s' },
  { src: GROUP_URL, pos: 'bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8', size: 'w-[70px] sm:w-[104px] md:w-[140px]', delay: 0.3, mobile: false, float: 'ab-float-a 12s' },
];

/* Liquid-glass surface, shared with the Projects and Services sections. */
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

const AboutSection = () => {
  return (
    <section
      id="about"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-24 sm:px-10 sm:py-28"
    >
      <style>{`
        @keyframes ab-float-a { 0%,100% { transform: translate3d(0,0,0) rotate(0deg); } 50% { transform: translate3d(0,-14px,0) rotate(4deg); } }
        @keyframes ab-float-b { 0%,100% { transform: translate3d(0,0,0) rotate(0deg); } 50% { transform: translate3d(0,12px,0) rotate(-4deg); } }
        @keyframes ab-orb-a { 0%,100% { transform: translate3d(0,0,0); } 50% { transform: translate3d(50px,30px,0); } }
        @keyframes ab-orb-b { 0%,100% { transform: translate3d(0,0,0); } 50% { transform: translate3d(-60px,-24px,0); } }
        @media (prefers-reduced-motion: reduce) {
          [style*="ab-"] { animation: none !important; }
        }
      `}</style>

      {/* Soft colour orbs behind the glass */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-[8%] top-[22%] h-[360px] w-[360px] rounded-full bg-[#5EEAD4] opacity-[0.14] blur-[120px]"
          style={{ animation: 'ab-orb-a 20s ease-in-out infinite' }}
        />
        <div
          className="absolute bottom-[12%] right-[6%] h-[400px] w-[400px] rounded-full bg-[#A78BFA] opacity-[0.16] blur-[130px]"
          style={{ animation: 'ab-orb-b 24s ease-in-out infinite' }}
        />
      </div>

      {/* Ambient corner art: non-interactive, gently floating */}
      <div aria-hidden="true" className="pointer-events-none select-none">
        {CORNER_DECOR.map((item) => (
          <FadeIn
            key={item.src + item.pos}
            delay={item.delay}
            x={0}
            y={0}
            duration={0.9}
            className={`absolute z-0 opacity-60 md:opacity-70 ${item.size} ${item.pos} ${
              item.mobile ? '' : 'hidden sm:block'
            }`}
          >
            <img
              src={item.src}
              alt=""
              className="h-auto w-full"
              style={{ animation: `${item.float} ease-in-out infinite` }}
            />
          </FadeIn>
        ))}
      </div>

      {/* Content lane */}
      <div className="relative z-10 flex w-full max-w-2xl flex-col items-center gap-10 sm:gap-12">
        <div className="flex flex-col items-center gap-6">
          <FadeIn delay={0}>
            <span className="inline-block rounded-full border border-white/15 bg-white/[0.06] px-4 py-1.5 text-[10px] uppercase tracking-[0.4em] text-[#D7E2EA]/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] backdrop-blur-xl sm:text-xs">
              Introduction
            </span>
          </FadeIn>
          <FadeIn delay={0.08} y={40}>
            <h2
              className="hero-heading text-center font-black uppercase leading-none tracking-tight"
              style={{ fontSize: 'clamp(2.75rem, 10vw, 130px)' }}
            >
              About me
            </h2>
          </FadeIn>
        </div>

        <AnimatedText
          text={ABOUT_TEXT}
          className="max-w-[560px] text-center font-medium leading-relaxed text-[#D7E2EA]"
          style={{ fontSize: 'clamp(1rem, 1.8vw, 1.25rem)' }}
        />

        {/* One concise glass card: three facts, hairline dividers */}
        <FadeIn delay={0.2} y={30} className="w-full">
          <div
            onMouseMove={trackPointer}
            className={`group/glass relative overflow-hidden rounded-[28px] sm:rounded-[36px] ${glass}`}
          >
            <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-br from-white/[0.14] via-transparent to-white/[0.03]" />
            <div
              className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover/glass:opacity-100"
              style={{
                background:
                  'radial-gradient(380px circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.14), transparent 60%)',
              }}
            />

            <ul className="relative divide-y divide-white/10">
              {FACTS.map((fact) => (
                <li
                  key={fact.label}
                  className="group/row flex flex-col gap-1.5 px-6 py-5 transition-colors duration-500 hover:bg-white/[0.05] sm:flex-row sm:items-center sm:gap-8 sm:px-8 sm:py-6"
                >
                  <span className="flex w-28 flex-shrink-0 items-center gap-2.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#D7E2EA]/55 sm:text-[11px]">
                    <span
                      className="h-1.5 w-1.5 rounded-full transition-transform duration-500 group-hover/row:scale-150"
                      style={{ backgroundColor: fact.accent }}
                    />
                    {fact.label}
                  </span>
                  <div className="min-w-0">
                    <p className="text-base font-semibold text-[#F4F1EA] sm:text-lg">{fact.value}</p>
                    <p className="text-xs text-[#D7E2EA]/55 sm:text-sm">{fact.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </FadeIn>

        <FadeIn delay={0.3} y={20}>
          <ContactButton />
        </FadeIn>
      </div>
    </section>
  );
};

export default AboutSection;