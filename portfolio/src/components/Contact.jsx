import { useCallback, useEffect, useRef, useState } from 'react';
import FadeIn from './FadeIn';

/* Details come from the resume */
const EMAIL = 'btech10023.24@bitmesra.ac.in';
const PHONE_DISPLAY = '+91 98017 33223';
const PHONE_TEL = '+919801733223';
const WHATSAPP = 'https://wa.me/919801733223';
const LOCATION = 'Ranchi, Jharkhand, India';

const PROFILES = [
  { name: 'LinkedIn', handle: 'kumar-saurav', mark: 'in', url: 'https://linkedin.com/in/kumar-saurav' },
  { name: 'GitHub', handle: 'saurav10023', mark: 'GH', url: 'https://github.com/saurav10023' },
  { name: 'LeetCode', handle: 'codebot216', mark: 'LC', url: 'https://leetcode.com/u/codebot216/' },
  { name: 'Codeforces', handle: 'sauravsonu216', mark: 'CF', url: 'https://codeforces.com/profile/sauravsonu216' },
  { name: 'CodeChef', handle: 'codebot216', mark: 'CC', url: 'https://www.codechef.com/users/codebot216' },
];

const focusRing =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#e9edf3]';

const Icon = ({ d, className = 'h-5 w-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const ICONS = {
  mail: ['M4 6h16v12H4z', 'M4 7l8 6 8-6'],
  phone: 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2z',
  pin: ['M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z', 'M12 12.2a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4z'],
  chat: 'M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z',
  copy: ['M9 9h10v11H9z', 'M5 15V4h10'],
  check: 'M5 12.5l4.5 4.5L19 7.5',
  arrow: ['M7 17L17 7', 'M9 7h8v8'],
  send: ['M22 2L11 13', 'M22 2l-7 20-4-9-9-4 20-7z'],
};

/* Copy to clipboard with a fallback for older or non-secure contexts */
const copyText = async (text) => {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through to the legacy path */
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
};

const useCopied = () => {
  const [copied, setCopied] = useState('');
  const timer = useRef(0);
  useEffect(() => () => clearTimeout(timer.current), []);
  const copy = useCallback(async (key, text) => {
    const ok = await copyText(text);
    if (!ok) return;
    setCopied(key);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(''), 2000);
  }, []);
  return [copied, copy];
};

/* One contact method: icon, label, value, a primary action and a copy button */
const Method = ({ icon, label, value, href, actionLabel, copyValue, copied, onCopy, external }) => (
  <li className="cs-raised flex flex-col gap-4 rounded-[28px] p-5 sm:flex-row sm:items-center sm:p-6">
    <span className="cs-pressed grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-[color:var(--cs-accent)]">
      <Icon d={ICONS[icon]} />
    </span>
    <div className="min-w-0 flex-1">
      <p className="text-xs font-semibold text-[color:var(--cs-ink-3)]">{label}</p>
      <p className="mt-0.5 break-words text-base font-bold text-[color:var(--cs-ink)] sm:text-lg">{value}</p>
    </div>
    <div className="flex items-center gap-2">
      {href && (
        <a
          href={href}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className={`cs-primary inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white ${focusRing}`}
        >
          {actionLabel}
          <Icon d={ICONS.arrow} className="h-4 w-4" />
        </a>
      )}
      {copyValue && (
        <button
          type="button"
          onClick={() => onCopy(label, copyValue)}
          aria-label={copied === label ? `${label} copied` : `Copy ${label.toLowerCase()}`}
          className={`cs-ghost grid h-10 w-10 place-items-center rounded-full text-[color:var(--cs-ink-2)] ${focusRing}`}
        >
          <Icon d={copied === label ? ICONS.check : ICONS.copy} className={`h-4 w-4 ${copied === label ? 'text-teal-700' : ''}`} />
        </button>
      )}
    </div>
  </li>
);

const Field = ({ id, label, error, children }) => (
  <div className="flex flex-col gap-2">
    <label htmlFor={id} className="text-sm font-semibold text-[color:var(--cs-ink)]">
      {label}
    </label>
    {children}
    {error && (
      <p id={`${id}-error`} role="alert" className="text-xs font-semibold text-rose-700">
        {error}
      </p>
    )}
  </div>
);

const ContactSection = () => {
  const [copied, copy] = useCopied();
  const [values, setValues] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: '' }));
    if (sent) setSent(false);
  };

  const validate = () => {
    const er = {};
    if (!values.name.trim()) er.name = 'Please enter your name.';
    if (!/^\S+@\S+\.\S+$/.test(values.email.trim())) er.email = 'Please enter a valid email address.';
    if (values.message.trim().length < 10) er.message = 'Please write at least a short message (10+ characters).';
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  /* No backend needed: this opens the visitor's email app with everything filled in */
  const onSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const subject = `Portfolio inquiry from ${values.name.trim()}`;
    const body = `${values.message.trim()}\n\n${values.name.trim()}\n${values.email.trim()}`;
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  const inputCls = `cs-input w-full rounded-2xl px-4 py-3 text-base font-medium text-[color:var(--cs-ink)] placeholder:text-[color:var(--cs-ink-3)] ${focusRing}`;

  return (
    <section className="cs-root relative z-10 overflow-hidden bg-[#e9edf3] px-5 pb-10 pt-20 sm:px-8 sm:pt-24 md:px-10 md:pt-32">
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap");

        .cs-root {
          --cs-ink: #333b4a;
          --cs-ink-2: #5d6779;
          --cs-ink-3: #7a8497;
          --cs-accent: #0f766e;
          --cs-lo: rgba(143,157,180,.5);
          --cs-hi: rgba(255,255,255,.95);
          font-family: "Plus Jakarta Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
          color: var(--cs-ink);
        }
        .cs-raised {
          background: linear-gradient(145deg, #f3f5f9, #e1e6ee);
          border: 1px solid rgba(255,255,255,.75);
          box-shadow: 8px 10px 24px -6px var(--cs-lo), -7px -7px 18px var(--cs-hi);
        }
        .cs-raised-sm {
          background: linear-gradient(145deg, #f3f5f9, #e1e6ee);
          border: 1px solid rgba(255,255,255,.75);
          box-shadow: 3px 3px 8px var(--cs-lo), -3px -3px 8px var(--cs-hi);
        }
        .cs-pressed {
          background: linear-gradient(145deg, rgba(212,218,229,.55), rgba(241,244,248,.6));
          border: 1px solid rgba(255,255,255,.45);
          box-shadow: inset 3px 3px 7px rgba(143,157,180,.55), inset -3px -3px 7px var(--cs-hi);
        }
        .cs-input {
          background: linear-gradient(145deg, rgba(212,218,229,.5), rgba(244,246,250,.7));
          border: 1px solid rgba(255,255,255,.6);
          box-shadow: inset 3px 3px 7px rgba(143,157,180,.5), inset -3px -3px 7px var(--cs-hi);
        }
        .cs-input[aria-invalid="true"] { border-color: rgba(190,18,60,.45); }
        .cs-ghost {
          background: linear-gradient(145deg, rgba(244,246,250,.85), rgba(228,232,240,.6));
          border: 1px solid rgba(255,255,255,.9);
          box-shadow: 4px 4px 10px rgba(143,157,180,.45), -4px -4px 10px rgba(255,255,255,.95);
          transition: transform .25s ease, box-shadow .25s ease;
        }
        @media (hover: hover) { .cs-ghost:hover { transform: translateY(-2px); } }
        .cs-ghost:active { transform: scale(.96); box-shadow: inset 3px 3px 7px var(--cs-lo), inset -3px -3px 7px var(--cs-hi); }
        .cs-primary {
          background: linear-gradient(145deg, #7b8496, #4f586a);
          border: 1px solid rgba(255,255,255,.45);
          box-shadow: 5px 6px 14px -4px rgba(71,82,102,.6), -4px -4px 9px rgba(255,255,255,.9), inset 0 1px 0 rgba(255,255,255,.3);
          transition: transform .3s ease, filter .3s ease, box-shadow .3s ease;
          white-space: nowrap;
        }
        @media (hover: hover) { .cs-primary:hover { transform: translateY(-2px); filter: brightness(1.07); } }
        .cs-primary:active { transform: scale(.97); box-shadow: inset 3px 3px 7px rgba(30,38,54,.5), inset -2px -2px 5px rgba(255,255,255,.2); }
        .cs-link { transition: transform .25s ease, box-shadow .25s ease; }
        @media (hover: hover) { .cs-link:hover { transform: translateY(-3px); } }
        .cs-link:active { transform: scale(.98); }
        .cs-title {
          background: linear-gradient(100deg, #2b3340 10%, #4f5a70 55%, #7c869b 100%);
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent; color: transparent;
        }
        @media (prefers-reduced-motion: reduce) {
          .cs-ghost, .cs-primary, .cs-link { transition: none !important; }
        }
      `}</style>

      {/* Soft light pools and dot grid (plain gradients, no blur filters) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="absolute -left-40 top-10 h-[520px] w-[520px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,.95), rgba(255,255,255,0) 68%)' }}
        />
        <div
          className="absolute -right-40 bottom-24 h-[560px] w-[560px] rounded-full"
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
        {/* Heading */}
        <div className="mb-12 flex flex-col items-center text-center sm:mb-16">
          <FadeIn delay={0} y={30}>
            <h2
              className="cs-title font-black tracking-tight"
              style={{ fontSize: 'clamp(3rem, 12vw, 150px)', lineHeight: 1, paddingBottom: '0.08em' }}
            >
              Contact
            </h2>
          </FadeIn>
          <FadeIn delay={0.1} y={20}>
            <p className="mx-auto mt-5 max-w-[54ch] text-sm font-medium leading-relaxed text-[color:var(--cs-ink-2)] sm:text-base">
              Have a project, an internship or a collaboration in mind? Send me a message and I&rsquo;ll
              get back to you.
            </p>
          </FadeIn>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_1fr] lg:gap-8">
          {/* Left: ways to reach me */}
          <div className="flex flex-col gap-6">
            <ul className="flex flex-col gap-4">
              <Method
                icon="mail"
                label="Email"
                value={EMAIL}
                href={`mailto:${EMAIL}`}
                actionLabel="Send email"
                copyValue={EMAIL}
                copied={copied}
                onCopy={copy}
              />
              <Method
                icon="phone"
                label="Phone"
                value={PHONE_DISPLAY}
                href={`tel:${PHONE_TEL}`}
                actionLabel="Call"
                copyValue={PHONE_TEL}
                copied={copied}
                onCopy={copy}
              />
              <Method
                icon="chat"
                label="WhatsApp"
                value="Message me directly"
                href={WHATSAPP}
                actionLabel="Chat"
                external
              />
              <Method icon="pin" label="Location" value={LOCATION} />
            </ul>
            <p className="sr-only" role="status" aria-live="polite">
              {copied ? `${copied} copied to clipboard` : ''}
            </p>
          </div>

          {/* Right: message form that opens the visitor's email app */}
          <form onSubmit={onSubmit} noValidate className="cs-raised flex flex-col gap-5 rounded-[32px] p-6 sm:rounded-[40px] sm:p-8">
            <div>
              <h3 className="text-xl font-extrabold tracking-tight text-[color:var(--cs-ink)] sm:text-2xl">
                Write a message
              </h3>
              <p className="mt-1 text-sm font-medium text-[color:var(--cs-ink-2)]">
                This opens your email app with everything filled in, ready to send.
              </p>
            </div>

            <Field id="cs-name" label="Your name" error={errors.name}>
              <input
                id="cs-name"
                name="name"
                type="text"
                autoComplete="name"
                value={values.name}
                onChange={onChange}
                placeholder="Jane Doe"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'cs-name-error' : undefined}
                className={inputCls}
              />
            </Field>
            <Field id="cs-email" label="Your email" error={errors.email}>
              <input
                id="cs-email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={values.email}
                onChange={onChange}
                placeholder="jane@company.com"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'cs-email-error' : undefined}
                className={inputCls}
              />
            </Field>
            <Field id="cs-message" label="Message" error={errors.message}>
              <textarea
                id="cs-message"
                name="message"
                rows={5}
                value={values.message}
                onChange={onChange}
                placeholder="Tell me a little about what you have in mind."
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? 'cs-message-error' : undefined}
                className={`${inputCls} resize-y`}
              />
            </Field>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                className={`cs-primary inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-bold text-white ${focusRing}`}
              >
                Open in email app
                <Icon d={ICONS.send} className="h-4 w-4" />
              </button>
              {sent && (
                <p role="status" className="text-sm font-medium text-[color:var(--cs-ink-2)]">
                  Nothing opened?{' '}
                  <button
                    type="button"
                    onClick={() => copy('Email', EMAIL)}
                    className={`font-bold text-[color:var(--cs-ink)] underline underline-offset-2 ${focusRing} rounded`}
                  >
                    {copied === 'Email' ? 'Address copied' : 'Copy my email address'}
                  </button>
                </p>
              )}
            </div>
          </form>
        </div>

        {/* Profiles */}
        <div className="mt-12 sm:mt-16">
          <p className="mb-4 text-center text-sm font-semibold text-[color:var(--cs-ink-2)]">
            Find me online
          </p>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {PROFILES.map((p) => (
              <li key={p.name}>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${p.name} profile, ${p.handle} (opens in a new tab)`}
                  className={`cs-link cs-raised-sm flex items-center gap-3 rounded-2xl px-3.5 py-3 ${focusRing}`}
                >
                  <span className="cs-pressed grid h-10 w-10 shrink-0 place-items-center rounded-xl font-mono text-xs font-bold text-[color:var(--cs-ink)]">
                    {p.mark}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold leading-tight text-[color:var(--cs-ink)]">{p.name}</span>
                    <span className="block truncate text-xs text-[color:var(--cs-ink-3)]">@{p.handle}</span>
                  </span>
                  <Icon d={ICONS.arrow} className="h-4 w-4 text-[color:var(--cs-ink-3)]" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <footer className="mt-14 flex flex-col items-center justify-between gap-2 border-t border-slate-400/25 pt-6 text-xs font-medium text-[color:var(--cs-ink-3)] sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Kumar Saurav. All rights reserved.</p>
          <p>Designed and built with React and TailwindCSS.</p>
        </footer>
      </div>
    </section>
  );
};

export default ContactSection;