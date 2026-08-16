import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ArrowUpRight, Activity, Zap, Stethoscope, Syringe, HeartPulse, CalendarCheck, ArrowRight } from 'lucide-react';

const CHARTS = [
  {
    id: 'A',
    patient: 'Sedan, Combustion, 2019',
    condition: 'Chronic Tailpipe Syndrome',
    note: 'Patient presents with persistent emissions, audible wheezing at idle, and an unhealthy dependency on fossil intake. Prognosis: obsolete.',
    vitals: [
      { k: 'CO₂ output', v: '4.6 t / yr' },
      { k: 'Moving parts', v: '2,000+' },
      { k: 'Resale pulse', v: 'Fading' },
    ],
  },
  {
    id: 'B',
    patient: 'SUV, V8, 2021',
    condition: 'Acute Range Anxiety (Projected)',
    note: 'Curiously, the patient projects its own fears onto electric vehicles. Classic deflection. We recommend immediate exposure therapy: one test drive.',
    vitals: [
      { k: 'Fuel cost', v: '$2,840 / yr' },
      { k: 'Oil changes', v: '4 / yr' },
      { k: 'Denial level', v: 'Severe' },
    ],
  },
  {
    id: 'C',
    patient: 'Coupe, Turbocharged, 2023',
    condition: 'Performance Envy, Stage III',
    note: 'Despite aggressive styling, patient is outrun at every light by a family hatchback in silent mode. Ego bruising consistent with 0–60 in 2.9s exposure.',
    vitals: [
      { k: '0–60 mph', v: '5.1 s' },
      { k: 'Decibels', v: 'Too many' },
      { k: 'Excuses', v: 'Numerous' },
    ],
  },
];

const TICKER = 'SEASON’S GREETINGS FROM THE WAITING ROOM OF THE FUTURE — NOW ACCEPTING TERMINAL COMBUSTION CASES — WALK-INS WELCOME, GAS-UPS NOT — WISHING YOU A FULLY CHARGED NEW YEAR — ';

export default function App() {
  const [active, setActive] = useState('A');
  const chart = CHARTS.find((c) => c.id === active);

  return (
    <div className="volt-root relative w-full overflow-x-hidden bg-[#F2EFE6] text-[#141310] antialiased">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@1,6..72,300;1,6..72,400;1,6..72,500&family=Archivo:wght@400;500;600;700&family=Archivo+Expanded:wght@500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .volt-root { font-family: 'Archivo', sans-serif; }
        .serif-i { font-family: 'Newsreader', serif; font-style: italic; }
        .mono { font-family: 'JetBrains Mono', monospace; }
        .exp { font-family: 'Archivo Expanded', 'Archivo', sans-serif; }

        @keyframes grainShift {
          0% { transform: translate(0,0); }
          10% { transform: translate(-2%, -3%); }
          20% { transform: translate(3%, 1%); }
          30% { transform: translate(-1%, 4%); }
          40% { transform: translate(4%, -2%); }
          50% { transform: translate(-3%, 2%); }
          60% { transform: translate(2%, 3%); }
          70% { transform: translate(-4%, -1%); }
          80% { transform: translate(1%, -4%); }
          90% { transform: translate(3%, 2%); }
          100% { transform: translate(0,0); }
        }
        .grain {
          position: fixed; inset: -50%; width: 200%; height: 200%;
          pointer-events: none; z-index: 60; opacity: 0.07;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          animation: grainShift 1.2s steps(6) infinite;
        }

        @keyframes heroGlow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .hero-bg {
          background: linear-gradient(115deg, #f2efe6 0%, #f2efe6 38%, #e9e3d2 52%, #f2efe6 66%, #f2efe6 100%);
          background-size: 220% 220%;
          animation: heroGlow 14s ease-in-out infinite;
        }
        @keyframes pulseRed {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .red-shift {
          background: linear-gradient(120deg, #e8230b 0%, #ff3214 35%, #d61c06 60%, #ff3a1d 100%);
          background-size: 240% 240%;
          animation: pulseRed 10s ease-in-out infinite;
        }

        @keyframes ticker {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .ticker-track { animation: ticker 38s linear infinite; }

        @keyframes ekg {
          from { stroke-dashoffset: 1200; }
          to { stroke-dashoffset: 0; }
        }
        .ekg-path { stroke-dasharray: 1200; animation: ekg 6s linear infinite; }

        .chart-tab { transition: all .25s cubic-bezier(.4,0,.2,1); }
        .chart-tab:hover { letter-spacing: .04em; }

        .hover-fill { position: relative; isolation: isolate; overflow: hidden; }
        .hover-fill::after {
          content: ''; position: absolute; inset: 0; background: #141310;
          transform: translateY(101%); transition: transform .35s cubic-bezier(.65,0,.35,1); z-index: -1;
        }
        .hover-fill:hover::after { transform: translateY(0); }
        .hover-fill:hover { color: #F2EFE6 !important; }

        ::selection { background: #FF2D0B; color: #F2EFE6; }
      `,
        }}
      />

      {/* film grain */}
      <div className="grain" />

      {/* ===== Masthead ===== */}
      <header className="flex w-full items-stretch justify-between border-b border-[#141310] text-[11px] uppercase tracking-[0.12em]">
        <div className="flex items-center gap-3 border-r border-[#141310] px-5 py-3">
          <Zap className="h-4 w-4 fill-[#FF2D0B] text-[#FF2D0B]" strokeWidth={1.5} />
          <span className="exp font-bold tracking-[0.2em]">VOLT CLINIC</span>
        </div>
        <div className="mono hidden items-center px-5 py-3 text-[#141310]/60 md:flex">
          Dept. of Combustion Disorders · Est. 2024
        </div>
        <div className="mono hidden items-center border-l border-[#141310] px-5 py-3 lg:flex">
          Issue Nº 12 — The Holiday Check-Up
        </div>
        <div className="flex items-center gap-2 border-l border-[#141310] bg-[#FF2D0B] px-5 py-3 text-[#F2EFE6]">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#F2EFE6]" />
          <span className="font-semibold">Open 24/7. Unlike gas stations’ goodwill.</span>
        </div>
      </header>

      {/* ===== Hero ===== */}
      <section className="hero-bg relative w-full border-b border-[#141310]">
        {/* EKG line */}
        <svg className="pointer-events-none absolute left-0 top-1/2 w-full -translate-y-1/2 opacity-[0.16]" height="160" viewBox="0 0 1440 160" fill="none" preserveAspectRatio="none">
          <path
            className="ekg-path"
            d="M0 80 H180 L210 80 L230 30 L255 130 L280 80 H520 L545 80 L565 20 L590 140 L615 80 H880 L905 80 L925 35 L950 125 L975 80 H1240 L1265 80 L1285 25 L1310 135 L1335 80 H1440"
            stroke="#FF2D0B"
            strokeWidth="2.5"
          />
        </svg>

        <div className="relative grid w-full grid-cols-12 gap-y-10 px-6 pb-16 pt-14 md:px-10 md:pb-24 md:pt-20">
          {/* kicker */}
          <div className="col-span-12 flex flex-wrap items-center gap-4">
            <span className="mono rounded-full border border-[#141310] px-3 py-1 text-[10px] uppercase tracking-[0.2em]">
              Patient intake · Dec 2024
            </span>
            <span className="mono text-[10px] uppercase tracking-[0.2em] text-[#141310]/50">
              File under: Holiday greetings, weaponized
            </span>
          </div>

          {/* headline */}
          <div className="col-span-12 lg:col-span-9">
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="exp text-[clamp(2.6rem,8.2vw,7.5rem)] font-bold uppercase leading-[0.92] tracking-[-0.02em]"
            >
              Combustion is a<br />
              <span className="serif-i font-medium normal-case tracking-normal text-[#FF2D0B]">pre-existing</span>{' '}
              condition.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mt-8 max-w-xl text-[15px] leading-relaxed text-[#141310]/75 md:text-base"
            >
              This holiday season, the Volt Clinic — the only EV brand with a bedside manner —
              is offering free diagnoses for every gas-powered vehicle still in denial.
              Bring your loved ones. Bring their loud, leaky cars. We’ll take it from here.
            </motion.p>
          </div>

          {/* hero side card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.55, duration: 0.8 }}
            className="col-span-12 flex flex-col justify-end lg:col-span-3"
          >
            <div className="border border-[#141310] bg-[#F8F6EE]">
              <div className="flex items-center justify-between border-b border-[#141310] px-4 py-2">
                <span className="mono text-[10px] uppercase tracking-[0.2em]">Greeting card, official</span>
                <Stethoscope className="h-4 w-4" strokeWidth={1.5} />
              </div>
              <div className="px-4 py-5">
                <p className="serif-i text-[22px] leading-snug">
                  “Wishing you, and whatever you currently drive, a swift recovery.”
                </p>
                <p className="mono mt-4 text-[10px] uppercase tracking-[0.18em] text-[#141310]/55">
                  — The attending physicians, Volt Clinic
                </p>
              </div>
              <button className="hover-fill flex w-full items-center justify-between border-t border-[#141310] px-4 py-3 text-[12px] font-semibold uppercase tracking-[0.14em]">
                Book a December check-up
                <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== Ticker ===== */}
      <div className="w-full overflow-hidden border-b border-[#141310] bg-[#141310] py-3 text-[#F2EFE6]">
        <div className="ticker-track flex w-max whitespace-nowrap">
          {[0, 1].map((i) => (
            <span key={i} className="exp text-[13px] font-semibold uppercase tracking-[0.22em]">
              {TICKER}
              {TICKER}
            </span>
          ))}
        </div>
      </div>

      {/* ===== Patient charts ===== */}
      <section className="w-full border-b border-[#141310]">
        <div className="grid w-full grid-cols-12">
          {/* left column / section label */}
          <div className="col-span-12 border-b border-[#141310] px-6 py-8 md:px-10 lg:col-span-4 lg:border-b-0 lg:border-r">
            <div className="mono mb-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.22em] text-[#141310]/55">
              <span className="text-[#FF2D0B]">01</span> Examination room
            </div>
            <h2 className="exp text-3xl font-bold uppercase leading-[1.02] tracking-tight md:text-4xl">
              This year’s most<br />tragic patients
            </h2>
            <p className="serif-i mt-6 max-w-sm text-[19px] leading-snug text-[#141310]/80">
              “We don’t judge. We simply read the chart aloud, slowly, in front of the family.”
            </p>

            {/* tabs */}
            <div className="mt-10 flex flex-col border-t border-[#141310]">
              {CHARTS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActive(c.id)}
                  className={`chart-tab flex items-center justify-between border-b border-[#141310] px-1 py-4 text-left text-sm font-semibold uppercase tracking-[0.08em] ${
                    active === c.id ? 'bg-[#141310] px-4 text-[#F2EFE6]' : 'text-[#141310] hover:px-3'
                  }`}
                >
                  <span>
                    <span className="mono mr-3 text-[11px] text-[#FF2D0B]">CHART {c.id}</span>
                    {c.patient}
                  </span>
                  <Plus className={`h-4 w-4 transition-transform duration-300 ${active === c.id ? 'rotate-45' : ''}`} strokeWidth={2} />
                </button>
              ))}
            </div>
          </div>

          {/* right column / chart detail */}
          <div className="col-span-12 lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={chart.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="flex h-full flex-col"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#141310] px-6 py-5 md:px-10">
                  <div className="mono text-[10px] uppercase tracking-[0.22em] text-[#141310]/55">
                    Chart {chart.id} / Confidential, but we’re publishing it anyway
                  </div>
                  <div className="flex items-center gap-2 text-[#FF2D0B]">
                    <HeartPulse className="h-4 w-4" strokeWidth={1.75} />
                    <span className="mono text-[10px] uppercase tracking-[0.22em]">Critical, fashionably</span>
                  </div>
                </div>

                <div className="grid flex-1 grid-cols-1 md:grid-cols-2">
                  <div className="border-b border-[#141310] px-6 py-10 md:border-b-0 md:border-r md:px-10">
                    <p className="mono text-[10px] uppercase tracking-[0.22em] text-[#141310]/50">Diagnosis</p>
                    <h3 className="serif-i mt-4 text-[clamp(1.8rem,3.4vw,3rem)] leading-[1.08] text-[#FF2D0B]">
                      {chart.condition}
                    </h3>
                    <p className="mt-6 max-w-md text-[15px] leading-relaxed text-[#141310]/75">{chart.note}</p>
                  </div>
                  <div className="flex flex-col">
                    {chart.vitals.map((v, i) => (
                      <div
                        key={v.k}
                        className={`flex items-baseline justify-between px-6 py-7 md:px-10 ${
                          i !== chart.vitals.length - 1 ? 'border-b border-[#141310]' : ''
                        }`}
                      >
                        <span className="mono text-[11px] uppercase tracking-[0.18em] text-[#141310]/55">{v.k}</span>
                        <span className="exp text-2xl font-bold tracking-tight md:text-3xl">{v.v}</span>
                      </div>
                    ))}
                    <div className="hover-fill mt-auto flex cursor-pointer items-center justify-between border-t border-[#141310] px-6 py-5 text-[12px] font-semibold uppercase tracking-[0.16em] md:px-10">
                      Refer this vehicle for replacement
                      <ArrowRight className="h-4 w-4" strokeWidth={2} />
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ===== Full-bleed pull quote ===== */}
      <section className="red-shift relative w-full border-b border-[#141310] px-6 py-24 text-[#F7F3E8] md:px-10 md:py-32">
        <div className="mono mb-8 flex items-center gap-3 text-[10px] uppercase tracking-[0.24em] text-[#F7F3E8]/70">
          <span>02</span> Second opinion
        </div>
        <p className="serif-i max-w-[1100px] text-[clamp(2rem,6vw,5.2rem)] leading-[1.04]">
          “The most generous gift you can give your family this year is the silence of an engine that never existed.”
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-6">
          <span className="mono text-[11px] uppercase tracking-[0.2em] text-[#F7F3E8]/80">
            Dr. K. Wattson — Chief of Electrification, Volt Clinic
          </span>
          <span className="hidden h-px w-24 bg-[#F7F3E8]/50 md:block" />
          <span className="mono text-[11px] uppercase tracking-[0.2em] text-[#F7F3E8]/60">
            Quoted out of context, proudly
          </span>
        </div>
      </section>

      {/* ===== Prescription / Rx ===== */}
      <section className="w-full border-b border-[#141310]">
        <div className="grid w-full grid-cols-1 lg:grid-cols-12">
          {/* image */}
          <div className="relative col-span-1 min-h-[340px] overflow-hidden border-b border-[#141310] lg:col-span-5 lg:border-b-0 lg:border-r">
            <img
              src="https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=1400&h=1600&fit=crop"
              alt="Electric vehicle charging"
              className="absolute inset-0 h-full w-full object-cover grayscale-[35%] contrast-[1.05]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141310]/70 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 w-full px-6 pb-6 md:px-8">
              <p className="mono text-[10px] uppercase tracking-[0.22em] text-[#F2EFE6]/70">Fig. 04 — IV drip, 350 kW</p>
              <p className="serif-i mt-2 text-2xl text-[#F2EFE6]">The only injection your car will ever need.</p>
            </div>
          </div>

          {/* Rx pad */}
          <div className="col-span-1 px-6 py-12 md:px-12 md:py-16 lg:col-span-7">
            <div className="mono mb-8 flex items-center gap-3 text-[10px] uppercase tracking-[0.22em] text-[#141310]/55">
              <span className="text-[#FF2D0B]">03</span> Prescription pad
            </div>
            <div className="flex items-end justify-between gap-6">
              <h2 className="exp text-4xl font-bold uppercase leading-[0.95] tracking-tight md:text-6xl">
                Take one,<br />daily. Forever.
              </h2>
              <span className="serif-i hidden text-[7rem] leading-none text-[#FF2D0B] md:block">℞</span>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-px border border-[#141310] bg-[#141310] sm:grid-cols-2">
              {[
                { icon: Zap, k: 'Dosage', v: '534 hp', sub: 'Administered instantly. No waiting room, no waiting torque.' },
                { icon: Activity, k: 'Range per treatment', v: '410 mi', sub: 'Side effects include smugness at gas stations you no longer visit.' },
                { icon: Syringe, k: 'Recovery time', v: '18 min', sub: '10–80% on a fast charger. Faster than your dentist’s small talk.' },
                { icon: HeartPulse, k: 'Heart rate, yours', v: '0–60 / 3.1s', sub: 'Mild palpitations are expected and frankly encouraged.' },
              ].map((item) => (
                <div key={item.k} className="group bg-[#F2EFE6] p-7 transition-colors duration-300 hover:bg-[#F8F6EE]">
                  <item.icon className="h-5 w-5 text-[#FF2D0B]" strokeWidth={1.75} />
                  <p className="mono mt-5 text-[10px] uppercase tracking-[0.2em] text-[#141310]/55">{item.k}</p>
                  <p className="exp mt-1 text-3xl font-bold tracking-tight">{item.v}</p>
                  <p className="mt-3 text-[13px] leading-relaxed text-[#141310]/65">{item.sub}</p>
                </div>
              ))}
            </div>

            <p className="serif-i mt-8 text-[18px] text-[#141310]/75">
              “Refills unnecessary — it charges while you sleep, like every good resolution should.”
            </p>
          </div>
        </div>
      </section>

      {/* ===== Holiday greeting / closing ===== */}
      <section className="relative w-full overflow-hidden bg-[#141310] px-6 py-24 text-[#F2EFE6] md:px-10 md:py-32">
        <div className="mono mb-10 flex items-center gap-3 text-[10px] uppercase tracking-[0.24em] text-[#F2EFE6]/50">
          <span className="text-[#FF2D0B]">04</span> Discharge papers / season’s greetings
        </div>
        <h2 className="exp max-w-[1200px] text-[clamp(2.4rem,7vw,6.5rem)] font-bold uppercase leading-[0.94] tracking-[-0.02em]">
          Get well soon.<br />
          <span className="serif-i font-medium normal-case tracking-normal text-[#FF2D0B]">Or get electric sooner.</span>
        </h2>
        <p className="mt-10 max-w-2xl text-[15px] leading-relaxed text-[#F2EFE6]/65">
          From all of us at the Volt Clinic: a happy, quiet, zero-emission holiday to you and yours.
          Appointments for the new year are now open. Your gas car doesn’t need to know — but it probably suspects.
        </p>

        <div className="mt-14 flex flex-col gap-px border border-[#F2EFE6]/25 sm:flex-row">
          <button className="group flex flex-1 items-center justify-between gap-6 bg-[#FF2D0B] px-8 py-6 text-left transition-colors duration-300 hover:bg-[#ff431f]">
            <div>
              <p className="exp text-lg font-bold uppercase tracking-wide">Schedule the intervention</p>
              <p className="mono mt-1 text-[10px] uppercase tracking-[0.2em] text-[#F2EFE6]/75">Test drives · Jan 2 onward</p>
            </div>
            <CalendarCheck className="h-6 w-6 transition-transform duration-300 group-hover:rotate-6" strokeWidth={1.5} />
          </button>
          <button className="group flex flex-1 items-center justify-between gap-6 px-8 py-6 text-left transition-colors duration-300 hover:bg-[#F2EFE6]/5">
            <div>
              <p className="exp text-lg font-bold uppercase tracking-wide">Send the greeting card</p>
              <p className="mono mt-1 text-[10px] uppercase tracking-[0.2em] text-[#F2EFE6]/55">To a combustion owner you love</p>
            </div>
            <ArrowUpRight className="h-6 w-6 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" strokeWidth={1.5} />
          </button>
        </div>

        {/* footer strip */}
        <div className="mono mt-20 flex flex-wrap items-center justify-between gap-4 border-t border-[#F2EFE6]/20 pt-6 text-[10px] uppercase tracking-[0.2em] text-[#F2EFE6]/45">
          <span>© 2024 Volt Clinic Motors — Not actual medical advice. Actual automotive advice.</span>
          <span>Printed on 100% recycled provocations</span>
          <span className="flex items-center gap-2 text-[#FF2D0B]">
            <Zap className="h-3 w-3 fill-current" /> Fully charged. Mildly insufferable.
          </span>
        </div>
      </section>
    </div>
  );
}