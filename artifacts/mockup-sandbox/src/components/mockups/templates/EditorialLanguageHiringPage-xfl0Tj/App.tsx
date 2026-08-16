import { useState } from 'react';
import { ArrowUpRight, ArrowRight, Minus, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DEPARTMENTS = ['Engineering', 'Design', 'Linguistics', 'Growth'];

const LEVELS = [
  { id: 'scout', name: 'Scout', code: 'L3', tagline: 'Prove your mettle', years: '1–3 yrs' },
  { id: 'vanguard', name: 'Vanguard', code: 'L4', tagline: 'Lead from the front', years: '4–7 yrs', featured: true },
  { id: 'champion', name: 'Champion', code: 'L5', tagline: 'Carry the standard', years: '8+ yrs' },
];

const COMP = {
  Engineering: {
    sf:     { scout: [148, 60, 10], vanguard: [196, 140, 15], champion: [248, 260, 20] },
    remote: { scout: [132, 60, 10], vanguard: [176, 140, 15], champion: [224, 260, 20] },
  },
  Design: {
    sf:     { scout: [136, 50, 10], vanguard: [178, 110, 15], champion: [226, 210, 20] },
    remote: { scout: [122, 50, 10], vanguard: [160, 110, 15], champion: [204, 210, 20] },
  },
  Linguistics: {
    sf:     { scout: [118, 40, 10], vanguard: [158, 90, 15], champion: [202, 170, 20] },
    remote: { scout: [106, 40, 10], vanguard: [142, 90, 15], champion: [182, 170, 20] },
  },
  Growth: {
    sf:     { scout: [128, 45, 12], vanguard: [170, 100, 18], champion: [218, 190, 25] },
    remote: { scout: [115, 45, 12], vanguard: [152, 100, 18], champion: [196, 190, 25] },
  },
};

const BENEFITS = [
  { label: 'Immersion stipend', sub: 'annual, any country', values: ['$2,500', '$4,000', '$6,000'] },
  { label: 'Learning budget', sub: 'courses, books, conferences', values: ['$1,500', '$2,500', '$4,000'] },
  { label: 'Sabbatical', sub: 'paid, after 4 years', values: [false, '4 weeks', '8 weeks'] },
  { label: 'Tutoring hours', sub: 'with native speakers, weekly', values: ['2 hrs', '4 hrs', 'Unlimited'] },
  { label: 'Conference speaking', sub: 'sponsored travel', values: [false, true, true] },
  { label: 'Hiring committee seat', sub: 'shape who joins the expedition', values: [false, false, true] },
];

const ROLES = [
  { title: 'Senior Speech Recognition Engineer', dept: 'Engineering', loc: 'San Francisco', level: 'Vanguard' },
  { title: 'Staff Product Designer, Learning Paths', dept: 'Design', loc: 'Remote — Americas', level: 'Champion' },
  { title: 'Computational Linguist, Romance Languages', dept: 'Linguistics', loc: 'Remote — EMEA', level: 'Vanguard' },
  { title: 'Growth Engineer, Activation', dept: 'Growth', loc: 'San Francisco', level: 'Scout' },
  { title: 'Curriculum Architect, Mandarin', dept: 'Linguistics', loc: 'Remote — APAC', level: 'Champion' },
  { title: 'iOS Engineer, Streaks & Rituals', dept: 'Engineering', loc: 'Remote — Americas', level: 'Scout' },
];

const fmt = (n) => `$${n.toLocaleString()}k`;

export default function App() {
  const [dept, setDept] = useState('Engineering');
  const [loc, setLoc] = useState('sf');
  const [hoveredRole, setHoveredRole] = useState(null);

  const comp = COMP[dept][loc];

  return (
    <div className="min-h-screen w-full" style={{ background: '#1F1813' }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT@9..144,300..700,50&family=Archivo:wght@400;500;600&display=swap"
        rel="stylesheet"
      />
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --ink: #211a14;
          --ink-soft: #4a3e30;
          --cream: #f2ead9;
          --cream-deep: #e7dcc6;
          --bone: #d8cbb2;
          --umber: #6e5b44;
          --sand: #b3a285;
          --clay: #c0703f;
          --dark: #1f1813;
          --dark-2: #2a2119;
        }
        body { margin: 0; }
        .serif { font-family: 'Fraunces', Georgia, serif; }
        .sans { font-family: 'Archivo', system-ui, sans-serif; }
        .smallcaps {
          font-family: 'Archivo', sans-serif;
          font-variant-caps: all-small-caps;
          letter-spacing: 0.14em;
          font-feature-settings: 'c2sc', 'smcp';
        }
        .hairline-r { border-right: 1px solid rgba(110,91,68,0.35); }
        .role-row { transition: background 0.25s ease, padding-left 0.25s ease; }
        .role-row:hover { background: #2a2119; padding-left: 14px; }
        .tab-btn { transition: color 0.2s ease; position: relative; }
        .tab-btn::after {
          content: ''; position: absolute; left: 0; right: 100%; bottom: -7px; height: 2px;
          background: var(--ink); transition: right 0.3s cubic-bezier(.7,0,.2,1);
        }
        .tab-btn.active::after { right: 0; }
        .col-featured {
          background: #211a14; color: #f2ead9;
          box-shadow: 0 18px 50px -18px rgba(33,26,20,0.55);
        }
        ::selection { background: #c0703f; color: #f2ead9; }
        .scroll-thin::-webkit-scrollbar { width: 6px; }
        .scroll-thin::-webkit-scrollbar-thumb { background: #6e5b44; border-radius: 3px; }
      `}} />

      <div className="grid lg:grid-cols-2 min-h-screen">

        {/* ───────────────────────── LEFT — DARK / MANIFESTO + ROLES ───────────────────────── */}
        <div className="relative flex flex-col" style={{ background: 'var(--dark)', color: 'var(--cream)' }}>
          {/* masthead */}
          <header className="flex items-center justify-between px-8 lg:px-12 pt-8 pb-6 border-b" style={{ borderColor: 'rgba(216,203,178,0.18)' }}>
            <div className="flex items-baseline gap-3">
              <span className="serif text-2xl font-semibold tracking-tight">Voxa</span>
              <span className="smallcaps text-[13px]" style={{ color: 'var(--sand)' }}>Careers · Issue No. 07</span>
            </div>
            <span className="smallcaps text-[13px]" style={{ color: 'var(--sand)' }}>Berkeley · Lisbon · Seoul</span>
          </header>

          {/* manifesto */}
          <div className="px-8 lg:px-12 pt-12 pb-10">
            <p className="smallcaps text-[13px] mb-6" style={{ color: 'var(--clay)' }}>The expedition is hiring</p>
            <h1 className="serif font-light leading-[0.98] tracking-[-0.02em]" style={{ fontSize: 'clamp(2.6rem, 4.6vw, 4.4rem)' }}>
              Fluency is not given.
              <br />
              <span className="font-semibold" style={{ color: 'var(--cream-deep)' }}>It is taken</span> — one
              <br />
              hard word at a time.
            </h1>
            <div className="grid grid-cols-12 mt-10 gap-6">
              <p className="col-span-12 md:col-span-7 sans text-[15px] leading-relaxed" style={{ color: 'var(--bone)' }}>
                Voxa teaches 41 languages to 18 million learners who refuse to stay silent in a foreign room.
                We hire people with the same refusal — engineers, designers, and linguists who would rather
                attempt the impossible sentence than rehearse the easy one.
              </p>
              <div className="col-span-12 md:col-span-5 sans text-[13px] space-y-2" style={{ color: 'var(--sand)' }}>
                <div className="flex justify-between border-b pb-2" style={{ borderColor: 'rgba(216,203,178,0.18)' }}>
                  <span className="smallcaps">Learners</span><span style={{ color: 'var(--cream)' }}>18.2M</span>
                </div>
                <div className="flex justify-between border-b pb-2" style={{ borderColor: 'rgba(216,203,178,0.18)' }}>
                  <span className="smallcaps">Languages</span><span style={{ color: 'var(--cream)' }}>41</span>
                </div>
                <div className="flex justify-between border-b pb-2" style={{ borderColor: 'rgba(216,203,178,0.18)' }}>
                  <span className="smallcaps">Open roles</span><span style={{ color: 'var(--cream)' }}>{ROLES.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* roles */}
          <div className="mt-auto border-t" style={{ borderColor: 'rgba(216,203,178,0.18)' }}>
            <div className="flex items-center justify-between px-8 lg:px-12 pt-7 pb-4">
              <h2 className="smallcaps text-[14px]" style={{ color: 'var(--sand)' }}>Open positions — Spring intake</h2>
              <span className="smallcaps text-[13px] flex items-center gap-1.5" style={{ color: 'var(--clay)' }}>
                View all <ArrowRight size={13} strokeWidth={2.2} />
              </span>
            </div>
            <ul className="pb-8">
              {ROLES.map((r, i) => (
                <li
                  key={r.title}
                  className="role-row group cursor-pointer px-8 lg:px-12 py-[14px] border-b flex items-center gap-4"
                  style={{ borderColor: 'rgba(216,203,178,0.12)' }}
                  onMouseEnter={() => setHoveredRole(i)}
                  onMouseLeave={() => setHoveredRole(null)}
                >
                  <span className="smallcaps text-[12px] w-7 shrink-0" style={{ color: 'var(--umber)' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="serif text-[17px] leading-snug" style={{ color: hoveredRole === i ? 'var(--cream)' : 'var(--cream-deep)' }}>
                      {r.title}
                    </p>
                    <p className="smallcaps text-[12px] mt-0.5" style={{ color: 'var(--sand)' }}>
                      {r.dept} · {r.loc} · {r.level} band
                    </p>
                  </div>
                  <ArrowUpRight
                    size={18}
                    strokeWidth={1.8}
                    className="shrink-0 transition-all duration-300"
                    style={{
                      color: hoveredRole === i ? 'var(--clay)' : 'var(--umber)',
                      transform: hoveredRole === i ? 'translate(2px,-2px)' : 'none',
                    }}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ───────────────────────── RIGHT — CREAM / COMP COMPARISON ───────────────────────── */}
        <div className="relative" style={{ background: 'var(--cream)', color: 'var(--ink)' }}>
          <div className="px-8 lg:px-12 pt-8 pb-12">

            {/* header row */}
            <div className="flex items-baseline justify-between border-b pb-6" style={{ borderColor: 'var(--bone)' }}>
              <div>
                <p className="smallcaps text-[13px] mb-2" style={{ color: 'var(--umber)' }}>Section II — Compensation, compared</p>
                <h2 className="serif font-medium tracking-tight leading-none" style={{ fontSize: 'clamp(1.8rem, 2.6vw, 2.5rem)' }}>
                  What the climb pays.
                </h2>
              </div>
              {/* location toggle */}
              <div className="flex items-center sans text-[12px] border rounded-full overflow-hidden shrink-0" style={{ borderColor: 'var(--umber)' }}>
                {[['sf', 'San Francisco'], ['remote', 'Remote']].map(([k, label]) => (
                  <button
                    key={k}
                    onClick={() => setLoc(k)}
                    className="smallcaps px-4 py-1.5 transition-colors duration-200"
                    style={{
                      background: loc === k ? 'var(--ink)' : 'transparent',
                      color: loc === k ? 'var(--cream)' : 'var(--ink-soft)',
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* department tabs */}
            <div className="flex gap-7 pt-6 pb-8">
              {DEPARTMENTS.map((d) => (
                <button
                  key={d}
                  onClick={() => setDept(d)}
                  className={`tab-btn smallcaps text-[14px] ${dept === d ? 'active' : ''}`}
                  style={{ color: dept === d ? 'var(--ink)' : 'var(--umber)' }}
                >
                  {d}
                </button>
              ))}
            </div>

            {/* level columns */}
            <AnimatePresence mode="wait">
              <motion.div
                key={dept + loc}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
              >
                <div className="grid grid-cols-3 gap-px" style={{ background: 'var(--bone)' }}>
                  {LEVELS.map((lvl) => {
                    const [base, equity, bonus] = comp[lvl.id];
                    const featured = lvl.featured;
                    return (
                      <div
                        key={lvl.id}
                        className={`px-5 py-6 flex flex-col ${featured ? 'col-featured -my-3 py-9 z-10' : ''}`}
                        style={featured ? {} : { background: 'var(--cream-deep)' }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="smallcaps text-[12px]" style={{ color: featured ? 'var(--sand)' : 'var(--umber)' }}>
                            {lvl.code} · {lvl.years}
                          </span>
                          {featured && (
                            <span className="smallcaps text-[11px] px-2 py-0.5 rounded-full" style={{ background: 'var(--clay)', color: 'var(--cream)' }}>
                              Most hired
                            </span>
                          )}
                        </div>
                        <h3 className="serif text-[26px] font-medium mt-2 leading-none">{lvl.name}</h3>
                        <p className="sans text-[12.5px] mt-1.5 italic" style={{ color: featured ? 'var(--bone)' : 'var(--ink-soft)' }}>
                          {lvl.tagline}
                        </p>

                        <div className="mt-6 pt-4 border-t" style={{ borderColor: featured ? 'rgba(216,203,178,0.25)' : 'var(--bone)' }}>
                          <p className="smallcaps text-[11px]" style={{ color: featured ? 'var(--sand)' : 'var(--umber)' }}>Base salary</p>
                          <p className="serif text-[30px] font-medium leading-tight">{fmt(base)}</p>
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-3">
                          <div>
                            <p className="smallcaps text-[11px]" style={{ color: featured ? 'var(--sand)' : 'var(--umber)' }}>Equity / 4yr</p>
                            <p className="sans text-[15px] font-medium">{fmt(equity)}</p>
                          </div>
                          <div>
                            <p className="smallcaps text-[11px]" style={{ color: featured ? 'var(--sand)' : 'var(--umber)' }}>Bonus target</p>
                            <p className="sans text-[15px] font-medium">{bonus}%</p>
                          </div>
                        </div>

                        <button
                          className="mt-6 sans text-[13px] font-medium py-2.5 w-full transition-colors duration-200 flex items-center justify-center gap-2 group"
                          style={{
                            background: featured ? 'var(--clay)' : 'transparent',
                            color: featured ? 'var(--cream)' : 'var(--ink)',
                            border: featured ? '1px solid var(--clay)' : '1px solid var(--umber)',
                          }}
                          onMouseEnter={(e) => { if (!featured) { e.currentTarget.style.background = 'var(--ink)'; e.currentTarget.style.color = 'var(--cream)'; } }}
                          onMouseLeave={(e) => { if (!featured) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--ink)'; } }}
                        >
                          See {lvl.name} roles <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* benefits comparison table */}
                <div className="mt-12">
                  <p className="smallcaps text-[13px] pb-3 border-b" style={{ color: 'var(--umber)', borderColor: 'var(--ink)' }}>
                    Beyond salary — every band, compared
                  </p>
                  <table className="w-full sans text-[13.5px]">
                    <tbody>
                      {BENEFITS.map((b, i) => (
                        <tr key={b.label} className="border-b transition-colors duration-150 hover:bg-[#ece2cd]" style={{ borderColor: 'var(--bone)' }}>
                          <td className="py-3 pr-4 w-[40%]">
                            <span className="font-medium block leading-tight">{b.label}</span>
                            <span className="smallcaps text-[11px]" style={{ color: 'var(--umber)' }}>{b.sub}</span>
                          </td>
                          {b.values.map((v, j) => (
                            <td key={j} className="py-3 px-2 text-center w-[20%]" style={{ background: j === 1 ? 'rgba(33,26,20,0.05)' : 'transparent' }}>
                              {v === true ? (
                                <Check size={15} className="inline" style={{ color: 'var(--clay)' }} strokeWidth={2.4} />
                              ) : v === false ? (
                                <Minus size={14} className="inline" style={{ color: 'var(--sand)' }} />
                              ) : (
                                <span className={j === 1 ? 'font-semibold' : ''}>{v}</span>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                      <tr>
                        <td className="pt-3"></td>
                        {LEVELS.map((l) => (
                          <td key={l.id} className="pt-3 text-center smallcaps text-[12px]" style={{ color: 'var(--umber)' }}>
                            {l.name}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* footnote */}
                <div className="mt-10 grid grid-cols-12 gap-6 items-end">
                  <p className="col-span-12 md:col-span-8 sans text-[12.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                    Figures shown for the <span className="font-semibold">{dept}</span> track,{' '}
                    {loc === 'sf' ? 'San Francisco baseline' : 'remote (location-adjusted, floor at 90% of baseline)'}.
                    Bands are published internally — every Voxan can see every band. We negotiate level, never pay.
                  </p>
                  <div className="col-span-12 md:col-span-4 md:text-right">
                    <span className="smallcaps text-[12px] block" style={{ color: 'var(--umber)' }}>Last revised</span>
                    <span className="serif text-[15px]">March 2025 · Cycle 14</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}