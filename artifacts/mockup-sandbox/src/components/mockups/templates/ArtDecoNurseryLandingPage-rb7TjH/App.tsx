import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Compass, Diamond } from 'lucide-react';

const BG = '#14271F';
const GOLD = '#C8A55B';
const GOLD_BRIGHT = '#E9D29A';
const GOLD_DIM = '#7E6A3F';
const CREAM = '#EFE6D0';
const SAGE = '#6E8472';
const LINE = '#33493E';

const guides = [
  { num: 'I', cat: 'PROPAGATION', title: 'Rooting Monstera Cuttings in Water', time: '12 MIN READ', diff: 'NOVICE', note: 'Node selection, the patience of clear glass, and when to commit to soil.' },
  { num: 'II', cat: 'SOIL CRAFT', title: 'Composing an Aroid Mix from Scratch', time: '18 MIN READ', diff: 'JOURNEYMAN', note: 'Bark, perlite, charcoal — a recipe in three movements for hungry roots.' },
  { num: 'III', cat: 'LIGHT MAPPING', title: 'Charting the Sun Through a North Window', time: '9 MIN READ', diff: 'NOVICE', note: 'Read your rooms like terrain. Foot-candles, shadows, and seasonal drift.' },
  { num: 'IV', cat: 'PRUNING', title: 'The Hard Cutback: Reviving a Leggy Pothos', time: '14 MIN READ', diff: 'JOURNEYMAN', note: 'Why ruthlessness is mercy, and where the new growth will erupt.' },
  { num: 'V', cat: 'PROPAGATION', title: 'Dividing Snake Plants at the Rhizome', time: '11 MIN READ', diff: 'EXPEDITION', note: 'A clean blade, a steady hand, and one plant becomes a colony.' },
  { num: 'VI', cat: 'SOIL CRAFT', title: 'Top-Dressing with Worm Castings', time: '7 MIN READ', diff: 'NOVICE', note: 'Slow nutrition for slow growers — feeding without the flood.' },
];

const steps = [
  { num: 'I', title: 'Survey the Root Mass', body: 'Tip the bird of paradise on its side and ease the root ball free. Circling roots at the pot wall are your signal — this specimen has outgrown its territory and is ready for new ground.' },
  { num: 'II', title: 'Score the Perimeter', body: 'With a clean hori-hori or blade, make four shallow vertical cuts down the root ball. This feels severe. It is not. Severed roots branch; bound roots strangle.' },
  { num: 'III', title: 'Set the Foundation', body: 'Lay two inches of chunky aroid mix in the new vessel — one size up, never two. The crown should sit a finger-width below the rim, exactly where it sat before.' },
  { num: 'IV', title: 'Backfill & Settle', body: 'Work soil into the gaps with your fingers, not your fists. Water slowly until it runs clear from the base, then withhold for ten days while the roots take their bearings.' },
];

const categories = ['ALL ROUTES', 'PROPAGATION', 'SOIL CRAFT', 'LIGHT MAPPING', 'PRUNING'];

function Sunburst({ style }) {
  const rays = [];
  for (let i = 0; i <= 24; i++) {
    const a = Math.PI - (i / 24) * Math.PI;
    const x1 = 300 + Math.cos(a) * 90;
    const y1 = 300 - Math.sin(a) * 90;
    const x2 = 300 + Math.cos(a) * 290;
    const y2 = 300 - Math.sin(a) * 290;
    rays.push(<line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={i % 2 === 0 ? GOLD : GOLD_DIM} strokeWidth={i % 2 === 0 ? 1.4 : 0.8} />);
  }
  return (
    <svg viewBox="0 0 600 310" style={style} fill="none">
      {rays}
      <path d="M 30 300 A 270 270 0 0 1 570 300" stroke={GOLD} strokeWidth="1.5" />
      <path d="M 215 300 A 85 85 0 0 1 385 300" stroke={GOLD_BRIGHT} strokeWidth="1.5" />
      <path d="M 250 300 A 50 50 0 0 1 350 300" stroke={GOLD} strokeWidth="1" />
      <circle cx="300" cy="300" r="8" fill={GOLD_BRIGHT} />
    </svg>
  );
}

function CornerFrame({ children, className = '' }) {
  return (
    <div className={`relative ${className}`}>
      {[
        'top-0 left-0 border-t border-l',
        'top-0 right-0 border-t border-r',
        'bottom-0 left-0 border-b border-l',
        'bottom-0 right-0 border-b border-r',
      ].map((pos, i) => (
        <span key={i} className={`absolute w-5 h-5 ${pos}`} style={{ borderColor: GOLD }} />
      ))}
      {children}
    </div>
  );
}

export default function App() {
  const [activeCat, setActiveCat] = useState('ALL ROUTES');
  const [activeStep, setActiveStep] = useState(0);
  const [hovering, setHovering] = useState(false);

  const mx = useMotionValue(-200);
  const my = useMotionValue(-200);
  const ringX = useSpring(mx, { stiffness: 180, damping: 22 });
  const ringY = useSpring(my, { stiffness: 180, damping: 22 });
  const slowX = useSpring(mx, { stiffness: 40, damping: 20 });
  const slowY = useSpring(my, { stiffness: 40, damping: 20 });

  const heroShiftX = useTransform(slowX, [0, typeof window !== 'undefined' ? window.innerWidth : 1400], [-18, 18]);
  const heroShiftY = useTransform(slowY, [0, typeof window !== 'undefined' ? window.innerHeight : 900], [-12, 12]);

  useEffect(() => {
    const move = (e) => { mx.set(e.clientX); my.set(e.clientY); };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [mx, my]);

  const hoverProps = {
    onMouseEnter: () => setHovering(true),
    onMouseLeave: () => setHovering(false),
  };

  const filtered = activeCat === 'ALL ROUTES' ? guides : guides.filter(g => g.cat === activeCat);

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ backgroundColor: BG, color: CREAM, cursor: 'none' }}>
      <link href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@400;500;600;700&family=Marcellus&family=Cormorant:ital,wght@0,400;1,400;1,500&display=swap" rel="stylesheet" />
      <style dangerouslySetInnerHTML={{ __html: `
        * { cursor: none !important; }
        ::selection { background: ${GOLD}; color: ${BG}; }
        .nav-font { font-family: 'Big Shoulders Display', sans-serif; letter-spacing: 0.22em; }
        .serif { font-family: 'Marcellus', serif; }
        .body-serif { font-family: 'Cormorant', serif; }
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .marquee-track { animation: marquee 36s linear infinite; }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin-slow { animation: spin-slow 24s linear infinite; }
        .guide-card { transition: border-color .35s ease, transform .35s ease; }
        .guide-card:hover { border-color: ${GOLD}; transform: translateY(-4px); }
        .guide-card:hover .card-arrow { color: ${GOLD_BRIGHT}; transform: translate(3px,-3px); }
        .card-arrow { transition: all .35s ease; }
        .nav-link { position: relative; transition: color .3s ease; }
        .nav-link::after { content:''; position:absolute; left:0; bottom:-4px; width:0; height:1px; background:${GOLD_BRIGHT}; transition: width .3s ease; }
        .nav-link:hover { color: ${GOLD_BRIGHT}; }
        .nav-link:hover::after { width:100%; }
        .deco-btn { transition: all .35s ease; }
        .deco-btn:hover { background: ${GOLD}; color: ${BG} !important; border-color: ${GOLD} !important; }
        .step-row { transition: all .3s ease; }
        input::placeholder { color: ${SAGE}; font-family: 'Big Shoulders Display', sans-serif; letter-spacing: 0.18em; }
        html { scrollbar-width: thin; scrollbar-color: ${GOLD_DIM} ${BG}; }
      `}} />

      {/* ——— Custom cursor ——— */}
      <motion.div className="fixed top-0 left-0 z-[100] pointer-events-none hidden md:block"
        style={{ x: mx, y: my, translateX: '-50%', translateY: '-50%' }}>
        <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: GOLD_BRIGHT }} />
      </motion.div>
      <motion.div className="fixed top-0 left-0 z-[99] pointer-events-none hidden md:flex items-center justify-center"
        style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%' }}>
        <motion.div animate={{ width: hovering ? 64 : 38, height: hovering ? 64 : 38, rotate: hovering ? 45 : 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="border flex items-center justify-center"
          style={{ borderColor: hovering ? GOLD_BRIGHT : GOLD, borderRadius: '50%' }}>
          {hovering && <Diamond size={10} color={GOLD_BRIGHT} />}
        </motion.div>
      </motion.div>

      {/* ——— Top hairlines ——— */}
      <div className="h-px" style={{ backgroundColor: GOLD }} />
      <div className="h-[3px]" style={{ backgroundColor: BG }} />
      <div className="h-px mb-0" style={{ backgroundColor: GOLD_DIM }} />

      {/* ——— Nav ——— */}
      <header className="max-w-7xl mx-auto px-6 md:px-10 pt-7 pb-6 flex items-center justify-between border-b" style={{ borderColor: LINE }}>
        <nav className="hidden md:flex items-center gap-8 nav-font text-[13px]" style={{ color: SAGE }}>
          <a href="#guides" className="nav-link" {...hoverProps}>FIELD GUIDES</a>
          <a href="#log" className="nav-link" {...hoverProps}>EXPEDITION LOG</a>
          <a href="#" className="nav-link" {...hoverProps}>SPECIMENS</a>
        </nav>
        <div className="flex items-center gap-4 mx-auto md:mx-0" {...hoverProps}>
          <span className="hidden sm:block w-12 h-px" style={{ backgroundColor: GOLD_DIM }} />
          <Diamond size={10} color={GOLD} />
          <h1 className="serif text-2xl tracking-[0.28em]" style={{ color: GOLD_BRIGHT }}>GILT & GROVE</h1>
          <Diamond size={10} color={GOLD} />
          <span className="hidden sm:block w-12 h-px" style={{ backgroundColor: GOLD_DIM }} />
        </div>
        <nav className="hidden md:flex items-center gap-8 nav-font text-[13px]" style={{ color: SAGE }}>
          <a href="#" className="nav-link" {...hoverProps}>THE ATELIER</a>
          <a href="#" className="nav-link" {...hoverProps}>VISIT</a>
          <a href="#join" className="nav-link" style={{ color: GOLD }} {...hoverProps}>JOIN THE EXPEDITION</a>
        </nav>
      </header>

      {/* ——— Hero ——— */}
      <section className="relative max-w-7xl mx-auto px-6 md:px-10 pt-16 pb-20 text-center">
        <motion.div style={{ x: heroShiftX, y: heroShiftY }} className="absolute inset-x-0 -top-2 flex justify-center pointer-events-none">
          <Sunburst style={{ width: 'min(640px, 90vw)' }} />
        </motion.div>

        <div className="relative pt-44 md:pt-56">
          <p className="nav-font text-[12px] mb-6" style={{ color: GOLD }}>EST. MCMXXIV &nbsp;◆&nbsp; A BOTANICAL ATLAS FOR THE CURIOUS &nbsp;◆&nbsp; PORTLAND, OREGON</p>
          <h2 className="serif leading-[1.02] mx-auto" style={{ fontSize: 'clamp(3rem, 8vw, 6.5rem)', color: CREAM, maxWidth: '14ch' }}>
            Cultivate the<br />
            <span style={{ color: GOLD_BRIGHT }}>Unknown</span>
          </h2>

          <div className="flex items-center justify-center gap-4 my-8">
            <span className="w-24 h-px" style={{ backgroundColor: GOLD_DIM }} />
            <Compass size={16} color={GOLD} />
            <span className="w-24 h-px" style={{ backgroundColor: GOLD_DIM }} />
          </div>

          <p className="body-serif italic text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed" style={{ color: SAGE }}>
            Every windowsill is a frontier. We chart the routes — propagation, soil craft, light mapping —
            so your collection grows like an expedition, not an accident.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5">
            <a href="#guides" className="deco-btn nav-font text-[13px] px-10 py-4 border flex items-center gap-3" style={{ borderColor: GOLD, color: GOLD_BRIGHT }} {...hoverProps}>
              OPEN THE FIELD GUIDES <ArrowRight size={15} />
            </a>
            <a href="#log" className="deco-btn nav-font text-[13px] px-10 py-4 border flex items-center gap-3" style={{ borderColor: LINE, color: SAGE }} {...hoverProps}>
              READ EXPEDITION LOG №4
            </a>
          </div>
        </div>
      </section>

      {/* ——— Marquee ——— */}
      <div className="border-y overflow-hidden py-4" style={{ borderColor: GOLD_DIM }}>
        <div className="marquee-track flex whitespace-nowrap nav-font text-[13px]" style={{ color: GOLD }}>
          {[...Array(2)].map((_, i) => (
            <span key={i} className="flex items-center">
              {['PROPAGATION', 'SOIL CRAFT', 'LIGHT MAPPING', 'PRUNING RITES', 'RARE AROIDS', 'DESERT FLORA', 'CANOPY DWELLERS', 'ROOT DIVISION'].map((t, j) => (
                <span key={j} className="flex items-center">
                  <span className="px-8">{t}</span>
                  <Diamond size={9} color={GOLD_DIM} />
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ——— Field Guides ——— */}
      <section id="guides" className="max-w-7xl mx-auto px-6 md:px-10 pt-24 pb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div>
            <p className="nav-font text-[12px] mb-4" style={{ color: GOLD }}>CHAPTER ONE ◆ THE FIELD GUIDES</p>
            <h3 className="serif text-4xl md:text-6xl leading-tight" style={{ color: CREAM }}>
              Six Routes Into<br />Greener Territory
            </h3>
          </div>
          <div className="flex flex-wrap gap-x-7 gap-y-3 nav-font text-[12px]">
            {categories.map(c => (
              <button key={c} onClick={() => setActiveCat(c)} {...hoverProps}
                className="pb-1 border-b transition-all duration-300"
                style={{
                  color: activeCat === c ? GOLD_BRIGHT : SAGE,
                  borderColor: activeCat === c ? GOLD : 'transparent',
                }}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((g) => (
            <a key={g.num} href="#" {...hoverProps}
              className="guide-card border p-8 flex flex-col justify-between min-h-[300px]"
              style={{ borderColor: LINE }}>
              <div>
                <div className="flex items-start justify-between mb-8">
                  <span className="serif text-5xl" style={{ color: GOLD }}>{g.num}</span>
                  <ArrowUpRight className="card-arrow" size={20} color={SAGE} />
                </div>
                <p className="nav-font text-[11px] mb-3" style={{ color: GOLD }}>{g.cat}</p>
                <h4 className="serif text-2xl leading-snug mb-4" style={{ color: CREAM }}>{g.title}</h4>
                <p className="body-serif italic text-lg leading-relaxed" style={{ color: SAGE }}>{g.note}</p>
              </div>
              <div className="flex items-center justify-between mt-8 pt-5 border-t nav-font text-[11px]" style={{ borderColor: LINE, color: SAGE }}>
                <span>{g.time}</span>
                <span style={{ color: GOLD_DIM }}>◆ {g.diff}</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ——— Expedition Log / How-to ——— */}
      <section id="log" className="max-w-7xl mx-auto px-6 md:px-10 py-24">
        <CornerFrame className="border" >
          <div className="border" style={{ borderColor: LINE, margin: 6 }}>
            <div className="p-8 md:p-14">
              <div className="text-center mb-14">
                <p className="nav-font text-[12px] mb-4" style={{ color: GOLD }}>EXPEDITION LOG ◆ ENTRY №4</p>
                <h3 className="serif text-4xl md:text-5xl" style={{ color: CREAM }}>Repotting the Bird of Paradise</h3>
                <div className="flex items-center justify-center gap-4 mt-6">
                  <span className="w-16 h-px" style={{ backgroundColor: GOLD_DIM }} />
                  <Diamond size={9} color={GOLD} />
                  <span className="w-16 h-px" style={{ backgroundColor: GOLD_DIM }} />
                </div>
                <p className="body-serif italic text-xl mt-6" style={{ color: SAGE }}>Four movements, one Sunday afternoon, no casualties.</p>
              </div>

              <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
                {/* Step list */}
                <div className="lg:col-span-5 flex flex-col">
                  {steps.map((s, i) => (
                    <button key={s.num} onClick={() => setActiveStep(i)} {...hoverProps}
                      className="step-row text-left flex items-center gap-6 py-6 border-b"
                      style={{
                        borderColor: i === activeStep ? GOLD : LINE,
                        color: i === activeStep ? GOLD_BRIGHT : SAGE,
                      }}>
                      <span className="serif text-2xl w-10" style={{ color: i === activeStep ? GOLD : GOLD_DIM }}>{s.num}</span>
                      <span className="serif text-xl flex-1">{s.title}</span>
                      <ArrowRight size={16} style={{ opacity: i === activeStep ? 1 : 0.25, color: GOLD }} />
                    </button>
                  ))}
                  <p className="nav-font text-[11px] mt-8" style={{ color: GOLD_DIM }}>
                    DIFFICULTY ◆ JOURNEYMAN &nbsp;&nbsp;|&nbsp;&nbsp; SEASON ◆ EARLY SPRING &nbsp;&nbsp;|&nbsp;&nbsp; TIME ◆ 45 MIN
                  </p>
                </div>

                {/* Step detail */}
                <div className="lg:col-span-7 relative">
                  <div className="absolute -top-8 -right-4 spin-slow hidden lg:block" style={{ width: 110, height: 110 }}>
                    <svg viewBox="0 0 100 100" fill="none">
                      <circle cx="50" cy="50" r="48" stroke={GOLD_DIM} strokeWidth="0.8" />
                      <circle cx="50" cy="50" r="36" stroke={GOLD} strokeWidth="0.8" />
                      {[...Array(16)].map((_, i) => {
                        const a = (i / 16) * Math.PI * 2;
                        return <line key={i} x1={50 + Math.cos(a) * 36} y1={50 + Math.sin(a) * 36} x2={50 + Math.cos(a) * 48} y2={50 + Math.sin(a) * 48} stroke={GOLD} strokeWidth="0.8" />;
                      })}
                      <rect x="44" y="44" width="12" height="12" transform="rotate(45 50 50)" stroke={GOLD_BRIGHT} strokeWidth="1" />
                    </svg>
                  </div>

                  <motion.div key={activeStep} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
                    <span className="serif block leading-none mb-6" style={{ fontSize: 'clamp(5rem, 10vw, 9rem)', color: GOLD }}>
                      {steps[activeStep].num}
                    </span>
                    <h4 className="serif text-3xl md:text-4xl mb-6" style={{ color: CREAM }}>{steps[activeStep].title}</h4>
                    <p className="body-serif text-2xl leading-relaxed max-w-xl" style={{ color: SAGE }}>
                      {steps[activeStep].body}
                    </p>
                    <div className="mt-10 flex items-center gap-4 nav-font text-[12px]" style={{ color: GOLD }}>
                      <span>MOVEMENT {activeStep + 1} OF 4</span>
                      <span className="flex-1 max-w-[200px] h-px" style={{ backgroundColor: GOLD_DIM }} />
                      <button {...hoverProps} onClick={() => setActiveStep((activeStep + 1) % 4)} className="flex items-center gap-2 nav-link">
                        NEXT <ArrowRight size={14} />
                      </button>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </CornerFrame>
      </section>

      {/* ——— Manifesto strip ——— */}
      <section className="max-w-5xl mx-auto px-6 md:px-10 pb-24 text-center">
        <Diamond size={12} color={GOLD} className="mx-auto mb-8" />
        <p className="serif text-3xl md:text-[2.6rem] leading-snug" style={{ color: CREAM }}>
          “We are not a shop with plants.<br className="hidden md:block" />
          We are a <span style={{ color: GOLD_BRIGHT }}>cartography studio</span> for living things —
          and every guide we publish is a map we drew by getting lost first.”
        </p>
        <p className="nav-font text-[12px] mt-8" style={{ color: SAGE }}>— THE GILT & GROVE ATELIER, FOUNDING LOG, 1924</p>
      </section>

      {/* ——— Join ——— */}
      <section id="join" className="border-t" style={{ borderColor: GOLD_DIM }}>
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-20 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="nav-font text-[12px] mb-4" style={{ color: GOLD }}>THE WEEKLY DISPATCH</p>
            <h3 className="serif text-4xl md:text-5xl leading-tight" style={{ color: CREAM }}>
              One field note,<br />every Sunday at dawn.
            </h3>
          </div>
          <div>
            <div className="flex border" style={{ borderColor: GOLD }}>
              <input type="email" placeholder="YOUR COORDINATES (EMAIL)" {...hoverProps}
                className="flex-1 bg-transparent px-6 py-5 outline-none nav-font text-[13px]" style={{ color: CREAM }} />
              <button className="deco-btn nav-font text-[13px] px-8 border-l flex items-center gap-2" style={{ borderColor: GOLD, color: GOLD_BRIGHT }} {...hoverProps}>
                ENLIST <ArrowRight size={14} />
              </button>
            </div>
            <p className="body-serif italic text-lg mt-4" style={{ color: SAGE }}>
              4,200 explorers receive it. No catalogues, no discounts — only craft.
            </p>
          </div>
        </div>
      </section>

      {/* ——— Footer ——— */}
      <footer className="border-t" style={{ borderColor: LINE }}>
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 flex flex-col md:flex-row items-center justify-between gap-8 nav-font text-[11px]" style={{ color: SAGE }}>
          <span>© MCMXXIV — MMXXV GILT & GROVE</span>
          <div className="flex items-center gap-4">
            <span className="w-10 h-px" style={{ backgroundColor: GOLD_DIM }} />
            <Diamond size={9} color={GOLD} />
            <span className="serif text-base tracking-[0.3em]" style={{ color: GOLD }}>G & G</span>
            <Diamond size={9} color={GOLD} />
            <span className="w-10 h-px" style={{ backgroundColor: GOLD_DIM }} />
          </div>
          <div className="flex gap-7">
            <a href="#" className="nav-link" {...hoverProps}>INSTAGRAM</a>
            <a href="#" className="nav-link" {...hoverProps}>ARE.NA</a>
            <a href="#" className="nav-link" {...hoverProps}>VISIT THE GROVE</a>
          </div>
        </div>
        <div className="h-px" style={{ backgroundColor: GOLD_DIM }} />
        <div className="h-[3px]" style={{ backgroundColor: BG }} />
        <div className="h-px" style={{ backgroundColor: GOLD }} />
      </footer>
    </div>
  );
}