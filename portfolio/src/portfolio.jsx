import { useState, useEffect, useRef } from "react";

const CYAN = "#00f5ff";
const PURPLE = "#a855f7";
const GREEN = "#22d3a0";
const AMBER = "#f59e0b";
const BG = "#060a10";
const BG2 = "#0d1117";
const BG3 = "#111827";
const BORDER = "rgba(0,245,255,0.12)";

const skillCategories = [
  {
    id: "frontend", label: "Frontend", color: CYAN,
    skills: [
      { name: "React.js", xp: "Advanced" }, { name: "JavaScript", xp: "Advanced" },
      { name: "HTML5", xp: "Expert" }, { name: "CSS3", xp: "Expert" },
      { name: "Tailwind CSS", xp: "Proficient" },
    ],
  },
  {
    id: "backend", label: "Backend", color: PURPLE,
    skills: [
      { name: "Node.js", xp: "Advanced" }, { name: "Express.js", xp: "Advanced" },
      { name: "MongoDB", xp: "Advanced" }, { name: "JWT Auth", xp: "Proficient" },
      { name: "REST APIs", xp: "Advanced" },
    ],
  },
  {
    id: "cs", label: "CS & Tools", color: GREEN,
    skills: [
      { name: "DSA", xp: "Advanced" }, { name: "C++", xp: "Advanced" },
      { name: "Git & GitHub", xp: "Proficient" }, { name: "Python", xp: "Beginner" },
      { name: "NumPy / Pandas", xp: "Beginner" },
    ],
  },
];

const XP_COLOR = {
  Expert:    { bg: "rgba(0,245,255,0.13)",   border: "rgba(0,245,255,0.45)",   text: CYAN },
  Advanced:  { bg: "rgba(168,85,247,0.12)",  border: "rgba(168,85,247,0.4)",   text: PURPLE },
  Proficient:{ bg: "rgba(34,211,160,0.1)",   border: "rgba(34,211,160,0.35)",  text: GREEN },
  Beginner:  { bg: "rgba(255,255,255,0.04)", border: "rgba(255,255,255,0.1)",  text: "rgba(255,255,255,0.38)" },
};

const cpProfiles = [
  {
    platform: "Codeforces", handle: "your_cf_handle",
    rating: 1234, maxRating: 1234, rank: "Specialist",
    accent: "#71c7ff", bg: "rgba(113,199,255,0.06)", border: "rgba(113,199,255,0.2)",
    logo: "CF", problems: 320, contests: 24, ratingMax: 3000,
    profileUrl: "https://codeforces.com/profile/your_cf_handle",
  },
  {
    platform: "CodeChef", handle: "your_cc_handle",
    rating: 1654, maxRating: 1654, rank: "3★ Coder",
    accent: "#84cc16", bg: "rgba(132,204,22,0.06)", border: "rgba(132,204,22,0.2)",
    logo: "CC", problems: 150, contests: 18, ratingMax: 3500,
    profileUrl: "https://www.codechef.com/users/your_cc_handle",
  },
  {
    platform: "LeetCode", handle: "your_lc_handle",
    rating: 1480, maxRating: 1480, rank: "Guardian",
    accent: AMBER, bg: "rgba(245,158,11,0.06)", border: "rgba(245,158,11,0.2)",
    logo: "LC", problems: 210, contests: 15, ratingMax: 3000,
    profileUrl: "https://leetcode.com/your_lc_handle",
  },
];

const projects = [
  {
    title: "School Live Website", tag: "Frontend", tagColor: CYAN, live: true,
    desc: "Developed and deployed the frontend for a live school website. Focused on clean UI, responsiveness, and a modern aesthetic for real-world production use.",
    tech: ["React.js", "CSS", "JavaScript", "Responsive Design"],
  },
  {
    title: "School Uniform Store", tag: "Full Stack", tagColor: PURPLE, live: false,
    desc: "End-to-end e-commerce platform for the same school — allowing parents to browse, order, and pay for uniforms and accessories with full authentication, cart, and order management.",
    tech: ["React.js", "Node.js", "Express", "MongoDB", "JWT", "REST API"],
  },
];

const navLinks = ["About", "Skills", "CP Ratings", "Projects", "Contact"];

function GlowDot({ color = CYAN, size = 6 }) {
  return <span style={{ display: "inline-block", width: size, height: size, borderRadius: "50%", background: color, boxShadow: `0 0 8px 2px ${color}55`, flexShrink: 0 }} />;
}

function SectionLabel({ children }) {
  return (
    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: CYAN, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ display: "block", width: 32, height: 1, background: CYAN }} />{children}
    </div>
  );
}

function SectionTitle({ children }) {
  return <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, color: "#fff", margin: "0 0 12px", letterSpacing: -0.5 }}>{children}</h2>;
}

function NavBar({ active, onNav }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: scrolled ? "rgba(6,10,16,0.92)" : "transparent", backdropFilter: scrolled ? "blur(16px)" : "none", borderBottom: scrolled ? `1px solid ${BORDER}` : "none", transition: "all 0.3s ease", padding: "0 5%", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <GlowDot color={CYAN} size={8} />
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 16, fontWeight: 700, color: CYAN, letterSpacing: 2 }}>{"<SK />"}</span>
      </div>
      <div style={{ display: "flex", gap: 28 }}>
        {navLinks.map(n => (
          <button key={n} onClick={() => onNav(n)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Space Mono', monospace", fontSize: 12, letterSpacing: 1.5, color: active === n ? CYAN : "rgba(255,255,255,0.45)", textTransform: "uppercase", transition: "color 0.2s", padding: "4px 0", borderBottom: active === n ? `1px solid ${CYAN}` : "1px solid transparent" }}>{n}</button>
        ))}
      </div>
    </nav>
  );
}

function HeroSection() {
  const [typed, setTyped] = useState("");
  const [cursor, setCursor] = useState(true);
  const phrases = ["Full Stack Developer", "React Enthusiast", "DSA Problem Solver", "BIT Mesra, CSE"];
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const tick = setTimeout(() => {
      const cur = phrases[phraseIdx];
      if (!deleting) {
        if (charIdx < cur.length) { setTyped(cur.slice(0, charIdx + 1)); setCharIdx(c => c + 1); }
        else setTimeout(() => setDeleting(true), 1400);
      } else {
        if (charIdx > 0) { setTyped(cur.slice(0, charIdx - 1)); setCharIdx(c => c - 1); }
        else { setDeleting(false); setPhraseIdx(i => (i + 1) % phrases.length); }
      }
    }, deleting ? 45 : 80);
    return () => clearTimeout(tick);
  });
  useEffect(() => { const t = setInterval(() => setCursor(c => !c), 530); return () => clearInterval(t); }, []);

  return (
    <section id="About" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 8%", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, zIndex: 0, backgroundImage: `linear-gradient(rgba(0,245,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.03) 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />
      <div style={{ position: "absolute", top: "20%", right: "10%", width: 420, height: 420, borderRadius: "50%", background: `radial-gradient(circle, ${PURPLE}22 0%, transparent 70%)`, zIndex: 0 }} />
      <div style={{ position: "absolute", bottom: "15%", left: "5%", width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(circle, ${CYAN}18 0%, transparent 70%)`, zIndex: 0 }} />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 700 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(0,245,255,0.06)", border: `1px solid ${BORDER}`, borderRadius: 100, padding: "6px 16px", marginBottom: 28 }}>
          <GlowDot color={GREEN} size={7} />
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: GREEN, letterSpacing: 2 }}>AVAILABLE FOR INTERNSHIPS</span>
        </div>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(2.8rem, 7vw, 5.5rem)", fontWeight: 800, margin: "0 0 8px", lineHeight: 1.05, color: "#fff", letterSpacing: -1 }}>Shivam Kumar</h1>
        <div style={{ height: 64, marginBottom: 12, display: "flex", alignItems: "center" }}>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "clamp(1.1rem, 2.5vw, 1.6rem)", color: CYAN, letterSpacing: 1 }}>
            {typed}<span style={{ opacity: cursor ? 1 : 0, color: CYAN }}>|</span>
          </span>
        </div>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(0.95rem, 1.8vw, 1.1rem)", color: "rgba(255,255,255,0.55)", lineHeight: 1.75, maxWidth: 560, margin: "0 0 40px" }}>
          B.Tech CSE student at <span style={{ color: "rgba(255,255,255,0.85)" }}>BIT Mesra</span>. I build full-stack web apps from the ground up — crafting interfaces users love and backends that scale.
        </p>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <a href="#Projects" style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, letterSpacing: 1.5, background: CYAN, color: BG, padding: "12px 28px", borderRadius: 6, textDecoration: "none", fontWeight: 700, textTransform: "uppercase" }} onMouseOver={e => e.currentTarget.style.opacity = 0.85} onMouseOut={e => e.currentTarget.style.opacity = 1}>View Projects</a>
          <a href="#Contact" style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, letterSpacing: 1.5, background: "transparent", color: CYAN, padding: "11px 28px", borderRadius: 6, border: `1px solid ${CYAN}55`, textDecoration: "none", fontWeight: 700, textTransform: "uppercase" }} onMouseOver={e => { e.currentTarget.style.background = `${CYAN}11`; e.currentTarget.style.borderColor = CYAN; }} onMouseOut={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = `${CYAN}55`; }}>Contact Me</a>
        </div>
        <div style={{ display: "flex", gap: 32, marginTop: 56, flexWrap: "wrap" }}>
          {[{ label: "Projects Built", val: "2+" }, { label: "Tech Stack", val: "10+" }, { label: "Year of Study", val: "2nd" }].map(s => (
            <div key={s.label}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "2rem", fontWeight: 800, color: CYAN }}>{s.val}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════
   REDESIGNED SKILLS — Tab + Tag Cloud
════════════════════════════════════════ */
function SkillTag({ name, xp, visible, delay }) {
  const c = XP_COLOR[xp];
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: c.bg, border: `1px solid ${c.border}`, borderRadius: 8, padding: "10px 18px", opacity: visible ? 1 : 0, transform: visible ? "translateY(0) scale(1)" : "translateY(14px) scale(0.93)", transition: `opacity 0.4s ease ${delay}ms, transform 0.4s ease ${delay}ms` }}>
      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, color: "#fff" }}>{name}</span>
      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: c.text, letterSpacing: 0.8, textTransform: "uppercase", background: c.bg, border: `1px solid ${c.border}`, borderRadius: 4, padding: "2px 7px" }}>{xp}</span>
    </div>
  );
}

const allTechPills = [
  { name: "React.js", color: CYAN }, { name: "Node.js", color: PURPLE }, { name: "MongoDB", color: GREEN },
  { name: "JavaScript", color: AMBER }, { name: "Express.js", color: CYAN }, { name: "HTML5", color: PURPLE },
  { name: "CSS3", color: GREEN }, { name: "C++", color: CYAN }, { name: "JWT", color: AMBER },
  { name: "DSA", color: PURPLE }, { name: "Git", color: GREEN }, { name: "Python", color: CYAN },
  { name: "Tailwind", color: AMBER }, { name: "REST API", color: PURPLE }, { name: "NumPy", color: GREEN },
];

function SkillsSection() {
  const [active, setActive] = useState("frontend");
  const [visible, setVisible] = useState(false);
  const [pillsVisible, setPillsVisible] = useState(false);
  const sectionRef = useRef();

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); setPillsVisible(true); } }, { threshold: 0.15 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const switchTab = (id) => {
    setVisible(false);
    setActive(id);
    setTimeout(() => setVisible(true), 80);
  };

  const cat = skillCategories.find(c => c.id === active);

  return (
    <section id="Skills" ref={sectionRef} style={{ padding: "100px 8%", background: BG2, position: "relative", overflow: "hidden" }}>
      {/* Decorative rings */}
      <div style={{ position: "absolute", top: "50%", right: "-10%", transform: "translateY(-50%)", width: 400, height: 400, borderRadius: "50%", border: `1px solid rgba(0,245,255,0.05)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "50%", right: "-6%", transform: "translateY(-50%)", width: 270, height: 270, borderRadius: "50%", border: `1px solid rgba(168,85,247,0.06)`, pointerEvents: "none" }} />

      <SectionLabel>Skills</SectionLabel>
      <SectionTitle>Technical Arsenal</SectionTitle>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1.05rem", color: "rgba(255,255,255,0.4)", marginBottom: 44, maxWidth: 460 }}>Everything I use to ship — from pixels to databases.</p>

      {/* Category tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 36, flexWrap: "wrap" }}>
        {skillCategories.map(c => (
          <button key={c.id} onClick={() => switchTab(c.id)} style={{ background: active === c.id ? c.color + "16" : "transparent", border: `1px solid ${active === c.id ? c.color + "55" : "rgba(255,255,255,0.1)"}`, borderRadius: 8, padding: "10px 24px", cursor: "pointer", fontFamily: "'Space Mono', monospace", fontSize: 12, color: active === c.id ? c.color : "rgba(255,255,255,0.38)", letterSpacing: 1.5, textTransform: "uppercase", transition: "all 0.22s ease" }}>
            {c.label}
          </button>
        ))}
      </div>

      {/* Skill tag cloud */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, minHeight: 130, marginBottom: 28 }}>
        {cat.skills.map((s, i) => <SkillTag key={s.name} name={s.name} xp={s.xp} visible={visible} delay={i * 75} />)}
      </div>

      {/* XP legend */}
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginBottom: 52, padding: "14px 20px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 10 }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.25)", letterSpacing: 1, textTransform: "uppercase", marginRight: 4 }}>Level:</span>
        {Object.entries(XP_COLOR).map(([label, c]) => (
          <span key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 2, background: c.text, opacity: 0.75 }} />
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.32)", textTransform: "uppercase", letterSpacing: 0.8 }}>{label}</span>
          </span>
        ))}
      </div>

      {/* Full stack pill cloud */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 36 }}>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.18)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 18 }}>Full tech stack</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {allTechPills.map((t, i) => (
            <span key={t.name} style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: t.color, border: `1px solid ${t.color}28`, background: t.color + "0b", padding: "5px 14px", borderRadius: 100, letterSpacing: 0.5, opacity: pillsVisible ? 1 : 0, transition: `opacity 0.5s ease ${300 + i * 42}ms` }}>{t.name}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════
   CP RATINGS SECTION
════════════════════════════════════════ */
function RatingArc({ rating, max, color }) {
  const r = 50;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(rating / max, 1);
  const [animated, setAnimated] = useState(false);
  const ref = useRef();
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setTimeout(() => setAnimated(true), 250); }, { threshold: 0.4 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  const dash = animated ? pct * circ * 0.75 : 0;
  return (
    <div ref={ref} style={{ position: "relative", width: 124, height: 124, flexShrink: 0 }}>
      <svg width="124" height="124" style={{ transform: "rotate(135deg)" }}>
        <circle cx="62" cy="62" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" strokeDasharray={`${circ * 0.75} ${circ}`} strokeLinecap="round" />
        <circle cx="62" cy="62" r={r} fill="none" stroke={color} strokeWidth="6" strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" style={{ transition: "stroke-dasharray 1.5s cubic-bezier(0.4,0,0.2,1)", filter: `drop-shadow(0 0 7px ${color}88)` }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <span style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.35rem", fontWeight: 800, color: "#fff", lineHeight: 1 }}>{rating}</span>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.28)", letterSpacing: 1, textTransform: "uppercase", marginTop: 3 }}>rating</span>
      </div>
    </div>
  );
}

function CPCard({ profile }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ background: hovered ? profile.bg : "rgba(255,255,255,0.02)", border: `1px solid ${hovered ? profile.border : "rgba(255,255,255,0.07)"}`, borderRadius: 16, padding: "28px 24px", transition: "all 0.3s ease", transform: hovered ? "translateY(-5px)" : "none", boxShadow: hovered ? `0 20px 60px ${profile.accent}14` : "none", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -30, right: -30, width: 150, height: 150, borderRadius: "50%", background: `radial-gradient(circle, ${profile.accent}14 0%, transparent 70%)`, pointerEvents: "none" }} />

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, fontWeight: 700, color: profile.accent, background: profile.bg, border: `1px solid ${profile.border}`, borderRadius: 6, padding: "4px 10px" }}>{profile.logo}</span>
            <span style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.1rem", fontWeight: 800, color: "#fff" }}>{profile.platform}</span>
          </div>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: "rgba(255,255,255,0.3)", letterSpacing: 1 }}>@{profile.handle}</span>
        </div>
        <RatingArc rating={profile.rating} max={profile.ratingMax} color={profile.accent} />
      </div>

      {/* Rank badge */}
      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: profile.accent + "15", border: `1px solid ${profile.accent}33`, borderRadius: 100, padding: "6px 14px", marginBottom: 22 }}>
        <span style={{ fontSize: 12 }}>★</span>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: profile.accent, letterSpacing: 1 }}>{profile.rank}</span>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
        {[{ label: "Problems", val: `${profile.problems}+` }, { label: "Contests", val: `${profile.contests}+` }].map(s => (
          <div key={s.label} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: "12px 14px" }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.28)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.15rem", fontWeight: 700, color: "#fff" }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Visit */}
      <a href={profile.profileUrl} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px", borderRadius: 8, border: `1px solid ${profile.accent}25`, background: profile.accent + "0a", textDecoration: "none", fontFamily: "'Space Mono', monospace", fontSize: 11, color: profile.accent, letterSpacing: 1.5, textTransform: "uppercase", transition: "background 0.2s" }} onMouseOver={e => e.currentTarget.style.background = profile.accent + "1a"} onMouseOut={e => e.currentTarget.style.background = profile.accent + "0a"}>
        View Profile ↗
      </a>
    </div>
  );
}

function CPSection() {
  return (
    <section id="CP Ratings" style={{ padding: "100px 8%", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(168,85,247,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.025) 1px, transparent 1px)`, backgroundSize: "60px 60px", zIndex: 0 }} />
      <div style={{ position: "absolute", bottom: "-10%", left: "40%", width: 360, height: 360, borderRadius: "50%", background: `radial-gradient(circle, ${PURPLE}15 0%, transparent 70%)`, pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <SectionLabel>Competitive Programming</SectionLabel>
        <SectionTitle>CP Ratings</SectionTitle>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1.05rem", color: "rgba(255,255,255,0.4)", marginBottom: 52, maxWidth: 500 }}>
          Grinding data structures, algorithms, and contest problems across major platforms.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: 24 }}>
          {cpProfiles.map(p => <CPCard key={p.platform} profile={p} />)}
        </div>
        <div style={{ marginTop: 28, display: "inline-flex", alignItems: "center", gap: 10, padding: "12px 18px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10 }}>
          <GlowDot color={AMBER} size={6} />
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.28)", letterSpacing: 0.8 }}>
            Edit the <code style={{ color: CYAN, background: "rgba(0,245,255,0.08)", padding: "1px 6px", borderRadius: 4 }}>cpProfiles</code> array to update your real handles & ratings
          </span>
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, index }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ background: hovered ? BG3 : BG2, border: `1px solid ${hovered ? project.tagColor + "44" : BORDER}`, borderRadius: 16, padding: "32px 28px", transition: "all 0.3s ease", position: "relative", overflow: "hidden", transform: hovered ? "translateY(-4px)" : "none", boxShadow: hovered ? `0 16px 48px ${project.tagColor}18` : "none" }}>
      <div style={{ position: "absolute", top: 24, right: 28, fontFamily: "'Space Mono', monospace", fontSize: 48, fontWeight: 700, color: "rgba(255,255,255,0.04)", lineHeight: 1 }}>0{index + 1}</div>
      <div style={{ marginBottom: 18, display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, background: project.tagColor + "18", color: project.tagColor, border: `1px solid ${project.tagColor}33`, padding: "4px 12px", borderRadius: 100, letterSpacing: 1.5, textTransform: "uppercase" }}>{project.tag}</span>
        {project.live && <span style={{ display: "flex", alignItems: "center", gap: 5 }}><GlowDot color={GREEN} size={6} /><span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: GREEN }}>Live</span></span>}
      </div>
      <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.4rem", fontWeight: 800, color: "#fff", margin: "0 0 12px" }}>{project.title}</h3>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, margin: "0 0 24px" }}>{project.desc}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {project.tech.map(t => <span key={t} style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.38)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", padding: "3px 10px", borderRadius: 4 }}>{t}</span>)}
      </div>
    </div>
  );
}

function ProjectsSection() {
  return (
    <section id="Projects" style={{ padding: "100px 8%", background: BG2 }}>
      <SectionLabel>Projects</SectionLabel>
      <SectionTitle>Things I've Built</SectionTitle>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1.05rem", color: "rgba(255,255,255,0.45)", marginBottom: 52, maxWidth: 500 }}>Real-world projects — from design to deployment.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
        {projects.map((p, i) => <ProjectCard key={p.title} project={p} index={i} />)}
      </div>
      <div style={{ marginTop: 24, border: `1px dashed rgba(255,255,255,0.09)`, borderRadius: 16, padding: "32px 28px", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12, minHeight: 180 }}>
        <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, color: "rgba(255,255,255,0.2)" }}>+</div>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.22)" }}>More projects coming soon...</span>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section id="Contact" style={{ padding: "100px 8%", background: BG }}>
      <SectionLabel>Contact</SectionLabel>
      <SectionTitle>Let's Connect</SectionTitle>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1.05rem", color: "rgba(255,255,255,0.45)", marginBottom: 52, maxWidth: 480 }}>Open for internship opportunities, collaborations, or just a good tech conversation.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, maxWidth: 700 }}>
        {[
          { label: "Email", val: "shivam@example.com", icon: "📧", href: "mailto:shivam@example.com" },
          { label: "LinkedIn", val: "linkedin.com/in/shivam", icon: "💼", href: "#" },
          { label: "GitHub", val: "github.com/shivam", icon: "🐙", href: "#" },
          { label: "College", val: "BIT Mesra, CSE", icon: "🎓", href: "#" },
        ].map(c => (
          <a key={c.label} href={c.href} style={{ textDecoration: "none" }}>
            <div style={{ background: BG3, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "20px", transition: "border-color 0.2s, background 0.2s" }} onMouseOver={e => { e.currentTarget.style.borderColor = `${CYAN}55`; e.currentTarget.style.background = `rgba(0,245,255,0.04)`; }} onMouseOut={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.background = BG3; }}>
              <div style={{ fontSize: 20, marginBottom: 10 }}>{c.icon}</div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: CYAN, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>{c.label}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{c.val}</div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ padding: "32px 8%", borderTop: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: "rgba(255,255,255,0.22)", letterSpacing: 1 }}>© 2025 Shivam Kumar · BIT Mesra</span>
      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: "rgba(255,255,255,0.18)" }}>Built with React.js</span>
    </footer>
  );
}

export default function Portfolio() {
  const [activeNav, setActiveNav] = useState("About");

  const handleNav = (section) => {
    setActiveNav(section);
    const el = document.getElementById(section);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500&display=swap";
    document.head.appendChild(link);

    const observer = new IntersectionObserver(
      (entries) => { entries.forEach(e => { if (e.isIntersecting) setActiveNav(e.target.id); }); },
      { threshold: 0.3, rootMargin: "-60px 0px -40% 0px" }
    );
    navLinks.forEach(id => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ background: BG, color: "#fff", minHeight: "100vh" }}>
      <NavBar active={activeNav} onNav={handleNav} />
      <HeroSection />
      <SkillsSection />
      <CPSection />
      <ProjectsSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
