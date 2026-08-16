import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  ArrowDownRight, Sparkles, Bean, Flame, CircleDashed,
  ArrowUpRight, Squircle, Asterisk
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip,
  LineChart, Line, CartesianGrid, Cell
} from 'recharts';

// ——— Palette (duotone + one saturated accent) ———
const COCOA = '#271811';
const CREAM = '#F2E7D6';
const ACCENT = '#FF5A1F';

// ——— Data ———
const flavorData = [
  { name: 'Smoked Fig & Sea Salt', bars: 14820 },
  { name: 'Burnt Honey Crunch', bars: 12940 },
  { name: 'Goat Milk & Nettle', bars: 9410 },
  { name: 'Tipsy Cherry 70%', bars: 8675 },
  { name: 'Plain (Boring) 85%', bars: 4120 },
  { name: 'The Mistake™', bars: 16302 },
];

const meltData = [
  { m: 'Jan', idx: 12 }, { m: 'Feb', idx: 18 }, { m: 'Mar', idx: 14 },
  { m: 'Apr', idx: 26 }, { m: 'May', idx: 38 }, { m: 'Jun', idx: 61 },
  { m: 'Jul', idx: 84 }, { m: 'Aug', idx: 79 }, { m: 'Sep', idx: 44 },
  { m: 'Oct', idx: 22 }, { m: 'Nov', idx: 13 }, { m: 'Dec', idx: 9 },
];

const origins = [
  { country: 'Ucayali, Peru', pct: 38, note: 'floral, stubborn, worth it' },
  { country: 'Tumaco, Colombia', pct: 27, note: 'tastes like a brass band' },
  { country: 'Kokoa Kamili, Tanzania', pct: 21, note: 'jammy little troublemaker' },
  { country: 'Åkesson, Madagascar', pct: 14, note: 'citrus with an attitude' },
];

const incidents = [
  { id: '042', date: 'Mar 14', desc: 'Intern ate the control batch. Twice.', sev: 'Mild' },
  { id: '067', date: 'Jun 02', desc: 'Tempering machine achieved sentience, demanded snacks.', sev: 'Spicy' },
  { id: '081', date: 'Jul 19', desc: 'Heatwave. We mourned 412 bars. They melted beautifully.', sev: 'Tragic' },
  { id: '096', date: 'Oct 31', desc: 'Someone wrapped a bar of soap. Customer reviewed it 5 stars.', sev: 'Spicy' },
  { id: '112', date: 'Dec 24', desc: 'Founder hid bars from own family. No regrets filed.', sev: 'Mild' },
];

// ——— Typing hero ———
function useTypewriter(text, speed = 65, startDelay = 400) {
  const [out, setOut] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    let i = 0;
    let interval;
    const t = setTimeout(() => {
      interval = setInterval(() => {
        i++;
        setOut(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
    }, startDelay);
    return () => { clearTimeout(t); clearInterval(interval); };
  }, [text, speed, startDelay]);
  return [out, done];
}

// ——— Animated big number ———
function CountUp({ to, suffix = '', duration = 1600 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(to * eased));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, to, duration]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

function SectionTag({ num, label }) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <span className="font-mono text-[11px] tracking-[0.25em] uppercase px-2.5 py-1 border border-[#27181140] rounded-full">
        {num}
      </span>
      <span className="font-mono text-[11px] tracking-[0.3em] uppercase opacity-60">{label}</span>
      <div className="flex-1 h-px bg-[#27181125]" />
    </div>
  );
}

function Reveal({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: COCOA, color: CREAM }} className="px-3 py-2 rounded-lg text-[12px] font-mono shadow-xl">
      <div className="opacity-60 mb-0.5">{label || payload[0].payload.name}</div>
      <div style={{ color: ACCENT }} className="font-bold">
        {payload[0].value.toLocaleString()} {payload[0].dataKey === 'bars' ? 'bars' : 'pts'}
      </div>
    </div>
  );
};

export default function App() {
  const [typed, typeDone] = useTypewriter('WE ATE THE DATA.');
  const [activeOrigin, setActiveOrigin] = useState(0);

  return (
    <div style={{ background: CREAM, color: COCOA }} className="min-h-screen antialiased selection:bg-[#FF5A1F] selection:text-[#F2E7D6]">
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT,WONK@9..144,300..900,100,1&family=Space+Mono:wght@400;700&family=Karla:ital,wght@0,300..800;1,300..800&display=swap" rel="stylesheet" />
      <style dangerouslySetInnerHTML={{ __html: `
        .display { font-family: 'Fraunces', serif; font-variation-settings: 'SOFT' 100, 'WONK' 1; }
        .body-font { font-family: 'Karla', sans-serif; }
        .font-mono { font-family: 'Space Mono', monospace; }
        .grain::before {
          content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 50; opacity: 0.5;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E");
        }
        @keyframes blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
        .cursor-blink { animation: blink 0.85s infinite; }
        @keyframes spinSlow { to { transform: rotate(360deg); } }
        .spin-slow { animation: spinSlow 14s linear infinite; }
        @keyframes wiggle { 0%,100% { transform: rotate(-3deg); } 50% { transform: rotate(3deg); } }
        .wiggle { animation: wiggle 2.4s ease-in-out infinite; }
        ::-webkit-scrollbar { width: 10px; }
        ::-webkit-scrollbar-track { background: ${CREAM}; }
        ::-webkit-scrollbar-thumb { background: ${COCOA}; border-radius: 8px; border: 2px solid ${CREAM}; }
        .squiggle { background-image: url("data:image/svg+xml,%3Csvg width='40' height='8' viewBox='0 0 40 8' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 4 Q5 0 10 4 T20 4 T30 4 T40 4' stroke='%23FF5A1F' stroke-width='2' fill='none'/%3E%3C/svg%3E"); background-repeat: repeat-x; background-position: bottom; padding-bottom: 10px; }
      `}} />

      <div className="grain" />

      <div className="body-font text-[14px] leading-relaxed grid grid-cols-1 lg:grid-cols-3 max-w-[1680px] mx-auto">

        {/* ——————————— LEFT ⅓ : sticky ledger ——————————— */}
        <aside className="lg:col-span-1 lg:sticky lg:top-0 lg:h-screen flex flex-col justify-between border-r border-[#27181125] px-8 py-10 lg:px-12">
          <div>
            <div className="flex items-start justify-between">
              <div>
                <div className="display font-black text-[28px] leading-none tracking-tight">
                  Wonky Bean<span style={{ color: ACCENT }}>*</span>
                </div>
                <div className="font-mono text-[10px] tracking-[0.35em] uppercase mt-2 opacity-60">
                  Chocolate Mischief Co.
                </div>
              </div>
              <Asterisk className="spin-slow" size={34} strokeWidth={1.5} style={{ color: ACCENT }} />
            </div>

            <div className="mt-12 squiggle inline-block">
              <span className="font-mono text-[11px] tracking-[0.3em] uppercase">The Annual Bean Report</span>
            </div>
            <div className="display font-black text-[64px] leading-[0.9] mt-3" style={{ color: ACCENT }}>
              ’24
            </div>

            <p className="mt-8 max-w-[28ch] opacity-80">
              Twelve months. Four origins. Sixty-six thousand bars. One tempering machine
              with a god complex. This is everything we counted, weighed, melted and
              occasionally ate before we could measure it.
            </p>

            <nav className="mt-10 space-y-1">
              {[
                ['01', 'The Damage', '#damage'],
                ['02', 'Flavor Forensics', '#flavors'],
                ['03', 'The Melt Index', '#melt'],
                ['04', 'Bean Provenance', '#origins'],
                ['05', 'Incident Log', '#incidents'],
              ].map(([n, label, href]) => (
                <a key={n} href={href}
                  className="group flex items-center gap-4 py-2 border-b border-[#27181118] hover:pl-2 transition-all duration-300">
                  <span className="font-mono text-[10px] opacity-50">{n}</span>
                  <span className="text-[13px] font-bold tracking-wide uppercase">{label}</span>
                  <ArrowDownRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: ACCENT }} />
                </a>
              ))}
            </nav>
          </div>

          <div className="mt-12">
            <div className="flex gap-6">
              <div>
                <div className="display font-black text-[40px] leading-none">
                  <CountUp to={66} suffix="k" />
                </div>
                <div className="font-mono text-[10px] tracking-[0.2em] uppercase opacity-60 mt-1">bars made</div>
              </div>
              <div>
                <div className="display font-black text-[40px] leading-none" style={{ color: ACCENT }}>
                  <CountUp to={9} suffix="%" />
                </div>
                <div className="font-mono text-[10px] tracking-[0.2em] uppercase opacity-60 mt-1">eaten by us</div>
              </div>
              <div>
                <div className="display font-black text-[40px] leading-none">
                  <CountUp to={0} />
                </div>
                <div className="font-mono text-[10px] tracking-[0.2em] uppercase opacity-60 mt-1">apologies</div>
              </div>
            </div>
            <div className="font-mono text-[10px] tracking-[0.2em] uppercase opacity-40 mt-8">
              Audited by nobody · Rounded generously
            </div>
          </div>
        </aside>

        {/* ——————————— RIGHT ⅔ : the report ——————————— */}
        <main className="lg:col-span-2 px-8 py-10 lg:px-16 lg:py-16">

          {/* HERO */}
          <section className="min-h-[78vh] flex flex-col justify-center">
            <div className="font-mono text-[12px] tracking-[0.35em] uppercase mb-6 flex items-center gap-3">
              <Squircle size={12} fill={ACCENT} stroke="none" className="wiggle" />
              Findings, confessions & crumbs · FY 2024
            </div>
            <h1 className="display font-black leading-[0.86] tracking-[-0.03em]"
              style={{ fontSize: 'clamp(72px, 11vw, 168px)' }}>
              {typed.split('DATA').length > 1 ? (
                <>
                  {typed.split('DATA')[0]}
                  <span style={{ color: ACCENT }}>DATA</span>
                  {typed.split('DATA')[1]}
                </>
              ) : typed}
              <span className="cursor-blink" style={{ color: ACCENT }}>▌</span>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={typeDone ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="mt-8 max-w-[52ch] opacity-80"
            >
              Then we wrote it down, because investors keep using the word "accountability."
              What follows is an unreasonably honest account of a year spent turning
              wonky beans into bars people fight over at dinner parties.
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={typeDone ? { opacity: 1 } : {}}
              transition={{ delay: 0.3 }}
              className="mt-10 flex items-center gap-3 font-mono text-[11px] tracking-[0.25em] uppercase"
            >
              <span style={{ background: ACCENT, color: CREAM }} className="px-4 py-2 rounded-full font-bold">scroll for evidence</span>
              <ArrowDownRight size={18} />
            </motion.div>
          </section>

          {/* 01 — THE DAMAGE */}
          <section id="damage" className="mt-24">
            <SectionTag num="01" label="The Damage" />
            <Reveal>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#27181125] border border-[#27181125] rounded-2xl overflow-hidden">
                {[
                  { v: 66302, s: '', l: 'bars produced', icon: Bean },
                  { v: 4.2, s: 't', l: 'cacao roasted', icon: Flame },
                  { v: 6121, s: '', l: 'bars "sampled" in-house', icon: Sparkles, accent: true },
                  { v: 312, s: '', l: 'tempering tantrums', icon: CircleDashed },
                ].map((stat, i) => (
                  <div key={i} style={{ background: CREAM }} className="p-6 lg:p-8 group hover:bg-[#27181108] transition-colors">
                    <stat.icon size={18} strokeWidth={1.75} style={{ color: stat.accent ? ACCENT : COCOA }} className="mb-6 opacity-80" />
                    <div className="display font-black text-[44px] leading-none" style={{ color: stat.accent ? ACCENT : COCOA }}>
                      <CountUp to={stat.v} suffix={stat.s} />
                    </div>
                    <div className="font-mono text-[10px] tracking-[0.18em] uppercase opacity-60 mt-2">{stat.l}</div>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-[58ch] opacity-75">
                "Sampled in-house" is doing heroic work in that sentence. Quality control is a
                lifestyle, and frankly we'd rather over-report than have HR find the wrappers.
              </p>
            </Reveal>
          </section>

          {/* 02 — FLAVOR FORENSICS */}
          <section id="flavors" className="mt-28">
            <SectionTag num="02" label="Flavor Forensics" />
            <Reveal>
              <h2 className="display font-black leading-[0.92] tracking-[-0.02em] mb-4" style={{ fontSize: 'clamp(44px, 5vw, 72px)' }}>
                The Mistake™ outsold<br />everything we planned.
              </h2>
              <p className="max-w-[56ch] opacity-75 mb-10">
                A dropped tray of burnt caramel landed in the nib bin in February. We sold it
                as-is, named it honestly, and it became our best seller. Marketing has been
                asked to drop more trays.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="border border-[#27181125] rounded-2xl p-6 lg:p-10">
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-[11px] tracking-[0.25em] uppercase opacity-60">Bars sold by flavor · 2024</span>
                  <span className="font-mono text-[11px] px-3 py-1 rounded-full font-bold" style={{ background: ACCENT, color: CREAM }}>units</span>
                </div>
                <div className="h-[340px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={flavorData} layout="vertical" margin={{ left: 0, right: 24 }}>
                      <XAxis type="number" hide />
                      <YAxis
                        type="category" dataKey="name" width={170}
                        tick={{ fill: COCOA, fontSize: 12, fontFamily: 'Karla' }}
                        axisLine={false} tickLine={false}
                      />
                      <Tooltip content={<ChartTooltip />} cursor={{ fill: '#27181110' }} />
                      <Bar dataKey="bars" radius={[0, 12, 12, 0]} barSize={26}>
                        {flavorData.map((d, i) => (
                          <Cell key={i} fill={d.name === 'The Mistake™' ? ACCENT : COCOA} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 font-mono text-[10px] tracking-[0.15em] uppercase opacity-50">
                  * Plain (Boring) 85% retained for people who claim they "don't really like sweets."
                </div>
              </div>
            </Reveal>
          </section>

          {/* 03 — MELT INDEX */}
          <section id="melt" className="mt-28">
            <SectionTag num="03" label="The Melt Index" />
            <div className="grid md:grid-cols-5 gap-10">
              <Reveal>
                <div className="md:col-span-2">
                  <div className="display font-black leading-[0.85]" style={{ fontSize: 'clamp(80px, 9vw, 130px)', color: ACCENT }}>
                    JULY
                  </div>
                  <div className="display font-bold text-[26px] mt-1">was a massacre.</div>
                  <p className="mt-6 opacity-75 max-w-[36ch]">
                    The Melt Index tracks the percentage of shipments arriving in a state our
                    lawyers describe as "structurally reinterpreted." We now ship with ice packs,
                    apologies, and a small poem.
                  </p>
                  <div className="mt-8 flex items-center gap-3">
                    <div className="display font-black text-[48px] leading-none">84</div>
                    <div className="font-mono text-[10px] tracking-[0.2em] uppercase opacity-60 leading-snug">peak melt<br />index, july</div>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="md:col-span-3 border border-[#27181125] rounded-2xl p-6 lg:p-8 h-full">
                  <span className="font-mono text-[11px] tracking-[0.25em] uppercase opacity-60">Melt index by month</span>
                  <div className="h-[300px] mt-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={meltData} margin={{ left: -20, right: 8, top: 8 }}>
                        <CartesianGrid stroke="#27181118" vertical={false} />
                        <XAxis dataKey="m" tick={{ fill: COCOA, fontSize: 11, fontFamily: 'Space Mono' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: COCOA, fontSize: 11, fontFamily: 'Space Mono' }} axisLine={false} tickLine={false} />
                        <Tooltip content={<ChartTooltip />} cursor={{ stroke: ACCENT, strokeDasharray: '4 4' }} />
                        <Line type="monotone" dataKey="idx" stroke={ACCENT} strokeWidth={3.5}
                          dot={{ r: 4, fill: CREAM, stroke: COCOA, strokeWidth: 2 }}
                          activeDot={{ r: 7, fill: ACCENT, stroke: CREAM, strokeWidth: 3 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </Reveal>
            </div>
          </section>

          {/* 04 — ORIGINS */}
          <section id="origins" className="mt-28">
            <SectionTag num="04" label="Bean Provenance" />
            <Reveal>
              <h2 className="display font-black leading-[0.92] tracking-[-0.02em] mb-10" style={{ fontSize: 'clamp(44px, 5vw, 72px)' }}>
                Four farms.<br />Zero middlemen.<br /><span style={{ color: ACCENT }}>Many emails.</span>
              </h2>
            </Reveal>
            <div className="space-y-3">
              {origins.map((o, i) => (
                <Reveal key={o.country} delay={i * 0.06}>
                  <button
                    onClick={() => setActiveOrigin(i)}
                    className={`w-full text-left rounded-2xl border transition-all duration-300 px-6 py-5 group ${
                      activeOrigin === i ? 'border-transparent' : 'border-[#27181125] hover:border-[#27181150]'
                    }`}
                    style={activeOrigin === i ? { background: COCOA, color: CREAM } : {}}
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-[10px] opacity-50 w-6">{String(i + 1).padStart(2, '0')}</span>
                      <span className="display font-bold text-[22px] tracking-tight flex-1">{o.country}</span>
                      <span className="text-[12px] italic opacity-60 hidden md:block">{o.note}</span>
                      <span className="display font-black text-[30px]" style={{ color: ACCENT }}>{o.pct}%</span>
                      <ArrowUpRight size={16} className={`transition-transform ${activeOrigin === i ? 'rotate-45' : 'group-hover:translate-x-1'}`} />
                    </div>
                    <div className="mt-4 ml-10 h-2 rounded-full overflow-hidden" style={{ background: activeOrigin === i ? '#F2E7D622' : '#27181118' }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: ACCENT }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${o.pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                      />
                    </div>
                  </button>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.15}>
              <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 font-mono text-[10px] tracking-[0.18em] uppercase opacity-50">
                <span>avg. paid: 2.9× commodity price</span>
                <span>contracts: 3-year minimum</span>
                <span>visits: 7 (2 involved a canoe)</span>
              </div>
            </Reveal>
          </section>

          {/* 05 — INCIDENT LOG */}
          <section id="incidents" className="mt-28">
            <SectionTag num="05" label="Incident Log" />
            <Reveal>
              <div className="rounded-2xl overflow-hidden border border-[#27181125]">
                <div className="grid grid-cols-[60px_70px_1fr_80px] gap-4 px-6 py-3 font-mono text-[10px] tracking-[0.2em] uppercase"
                  style={{ background: COCOA, color: CREAM }}>
                  <span>Ref</span><span>Date</span><span>Description of mischief</span><span className="text-right">Severity</span>
                </div>
                {incidents.map((inc, i) => (
                  <div key={inc.id}
                    className={`grid grid-cols-[60px_70px_1fr_80px] gap-4 px-6 py-4 items-center hover:bg-[#27181108] transition-colors ${i !== incidents.length - 1 ? 'border-b border-[#27181118]' : ''}`}>
                    <span className="font-mono text-[11px] opacity-60">#{inc.id}</span>
                    <span className="font-mono text-[11px] opacity-60">{inc.date}</span>
                    <span className="text-[14px]">{inc.desc}</span>
                    <span className="text-right">
                      <span className="font-mono text-[10px] uppercase tracking-wide px-2 py-1 rounded-full font-bold"
                        style={inc.sev === 'Tragic'
                          ? { background: ACCENT, color: CREAM }
                          : inc.sev === 'Spicy'
                            ? { border: `1.5px solid ${ACCENT}`, color: ACCENT }
                            : { border: '1.5px solid #27181140' }}>
                        {inc.sev}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>
          </section>

          {/* OUTRO */}
          <section className="mt-32 mb-16">
            <Reveal>
              <div className="rounded-3xl px-8 py-14 lg:px-14 lg:py-20 relative overflow-hidden" style={{ background: COCOA, color: CREAM }}>
                <Asterisk size={220} strokeWidth={0.6} className="absolute -right-12 -top-12 opacity-20 spin-slow" style={{ color: ACCENT }} />
                <div className="font-mono text-[11px] tracking-[0.35em] uppercase opacity-60 mb-6">Forecast · FY 2025</div>
                <div className="display font-black leading-[0.88] tracking-[-0.03em]" style={{ fontSize: 'clamp(48px, 7vw, 110px)' }}>
                  More beans.<br />
                  More bars.<br />
                  <span style={{ color: ACCENT }}>Fewer spreadsheets.</span>
                </div>
                <p className="mt-8 max-w-[48ch] opacity-70">
                  Next year's report will be shorter, because we plan to eat the evidence faster.
                  Thank you to our farmers, our customers, and the tempering machine — may it
                  never read this.
                </p>
                <div className="mt-10 flex flex-wrap gap-4 items-center">
                  <a href="#" className="font-mono text-[12px] font-bold tracking-[0.2em] uppercase px-6 py-3 rounded-full transition-transform hover:-rotate-2 hover:scale-105"
                    style={{ background: ACCENT, color: CREAM }}>
                    Stock the bars →
                  </a>
                  <a href="#" className="font-mono text-[12px] tracking-[0.2em] uppercase px-6 py-3 rounded-full border border-[#F2E7D640] hover:border-[#F2E7D6] transition-colors">
                    Read FY '23 (worse)
                  </a>
                </div>
              </div>
            </Reveal>
            <div className="mt-10 flex flex-wrap items-center justify-between gap-4 font-mono text-[10px] tracking-[0.2em] uppercase opacity-50">
              <span>© 2025 Wonky Bean Chocolate Mischief Co.</span>
              <span>Single origin · Twin-screw ground · Triple checked, ish</span>
              <span>Made in a kitchen that smells unfair</span>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}