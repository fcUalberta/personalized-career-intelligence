import { useState } from 'react';
import {
  Heart,
  Sparkles,
  ArrowRight,
  Check,
  Sprout,
  Flower2,
  Trees,
  Building2,
  MessageCircleHeart,
  ShieldCheck,
  Clock3,
  Phone,
  Star,
} from 'lucide-react';

const PLANS = [
  {
    id: 'sprout',
    name: 'Sprout',
    icon: Sprout,
    tagline: 'For first experiments',
    monthly: 0,
    annual: 0,
    accent: '#7FE3C9',
    cta: 'Start free, stay free',
    features: [
      '10k inference calls / mo',
      '2 fine-tune jobs',
      'Community garden (forum)',
      'Email check-ins, weekly',
    ],
  },
  {
    id: 'bloom',
    name: 'Bloom',
    icon: Flower2,
    tagline: 'For teams finding their rhythm',
    monthly: 49,
    annual: 39,
    accent: '#FF5C9E',
    featured: true,
    cta: 'Grow with Bloom',
    features: [
      '1M inference calls / mo',
      'Unlimited fine-tune jobs',
      'Drift watch & gentle alerts',
      'Human support in < 5 min',
      'Bias & fairness audits',
      'Shared eval notebooks',
    ],
  },
  {
    id: 'garden',
    name: 'Garden',
    icon: Trees,
    tagline: 'For products in full bloom',
    monthly: 199,
    annual: 159,
    accent: '#C7A6FF',
    cta: 'Tend your Garden',
    features: [
      '10M inference calls / mo',
      'Dedicated GPU pool',
      'SOC 2 + HIPAA toolkits',
      'On-call ML caretaker',
      'Custom model nursery',
    ],
  },
];

export default function App() {
  const [billing, setBilling] = useState('annual');

  return (
    <div className="tend-root min-h-screen w-full bg-[#FDEDE0] text-[#33172E] antialiased">
      <link
        href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700;12..96,800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=VT323&display=swap"
        rel="stylesheet"
      />
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .tend-root { font-family: 'DM Sans', sans-serif; }
        .display { font-family: 'Bricolage Grotesque', sans-serif; }
        .pixel { font-family: 'VT323', monospace; letter-spacing: 0.04em; }

        .scanlines::after {
          content: '';
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 50;
          background: repeating-linear-gradient(
            to bottom,
            rgba(51, 23, 46, 0.035) 0px,
            rgba(51, 23, 46, 0.035) 1px,
            transparent 1px,
            transparent 4px
          );
          mix-blend-mode: multiply;
        }

        .card {
          background: #FFF8F1;
          border: 2px solid #33172E;
          box-shadow: 5px 5px 0 0 #33172E;
          transition: transform 180ms ease, box-shadow 180ms ease;
        }
        .card:hover {
          transform: translate(-2px, -2px);
          box-shadow: 8px 8px 0 0 #33172E;
        }

        .titlebar {
          border-bottom: 2px solid #33172E;
          background: repeating-linear-gradient(
            90deg,
            #FFE2EE 0px, #FFE2EE 6px,
            #FFD3E6 6px, #FFD3E6 12px
          );
        }

        .retro-sun {
          background: linear-gradient(180deg, #FFB370 0%, #FF5C9E 55%, #E84B8A 100%);
          -webkit-mask-image: repeating-linear-gradient(
            to bottom,
            black 0px, black 14px,
            transparent 14px, transparent 18px
          ), linear-gradient(black 55%, black 100%);
          mask-image: linear-gradient(to bottom, black 0 55%, transparent 55%),
            repeating-linear-gradient(to bottom, black 0px, black 86%, black 100%);
        }
        .sun-stripes {
          background: repeating-linear-gradient(
            to bottom,
            transparent 0px, transparent 12px,
            #FFF8F1 12px, #FFF8F1 16px
          );
          mask-image: linear-gradient(to bottom, transparent 0 45%, black 45%);
          -webkit-mask-image: linear-gradient(to bottom, transparent 0 45%, black 45%);
        }

        .horizon-grid {
          background-image:
            linear-gradient(rgba(255, 92, 158, 0.35) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 92, 158, 0.35) 1px, transparent 1px);
          background-size: 42px 28px;
          transform: perspective(320px) rotateX(58deg);
          transform-origin: top center;
        }

        .btn-solid {
          transition: background-color 160ms ease, transform 160ms ease, box-shadow 160ms ease;
        }
        .btn-solid:hover { transform: translate(-1px,-1px); box-shadow: 4px 4px 0 0 #33172E; }
        .btn-solid:active { transform: translate(1px,1px); box-shadow: 1px 1px 0 0 #33172E; }

        .feature-row { transition: background-color 140ms ease, padding-left 140ms ease; }
        .feature-row:hover { background: #FFE9F2; padding-left: 6px; }

        .glitch-hover { transition: color 120ms ease, text-shadow 120ms ease; }
        .glitch-hover:hover {
          color: #E8417F;
          text-shadow: 2px 0 0 rgba(127,227,201,0.9), -2px 0 0 rgba(199,166,255,0.9);
        }

        .marquee-track { display: flex; width: max-content; animation: none; }
      `,
        }}
      />

      <div className="scanlines" />

      {/* ---------- HEADER ---------- */}
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 pb-6 pt-7 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center border-2 border-[#33172E] bg-[#FF5C9E] shadow-[3px_3px_0_0_#33172E]">
            <Heart className="h-5 w-5 text-[#FFF8F1]" fill="#FFF8F1" />
          </div>
          <div className="leading-none">
            <span className="display text-2xl font-extrabold tracking-tight">tend</span>
            <span className="pixel ml-2 align-middle text-base text-[#9A4B7C]">.ai</span>
          </div>
        </div>

        <div className="hidden items-center gap-7 md:flex">
          {['Models', 'Caretakers', 'Docs', 'Pricing'].map((item) => (
            <a
              key={item}
              href="#"
              className={`glitch-hover text-sm font-medium ${item === 'Pricing' ? 'underline decoration-[#FF5C9E] decoration-2 underline-offset-4' : ''}`}
            >
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <span className="pixel hidden border-2 border-[#33172E] bg-[#FFE2A8] px-2 py-0.5 text-sm sm:inline-block">
            formerly GRADIENT LABS ▸ now tend
          </span>
          <button className="btn-solid border-2 border-[#33172E] bg-[#33172E] px-4 py-2 text-sm font-semibold text-[#FFF8F1]">
            Sign in
          </button>
        </div>
      </header>

      {/* ---------- BENTO GRID ---------- */}
      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-5 px-5 pb-20 lg:grid-cols-12 lg:px-8">
        {/* HERO — rebrand reveal */}
        <section className="card relative col-span-1 overflow-hidden lg:col-span-7 lg:row-span-2">
          <div className="titlebar flex items-center justify-between px-4 py-2">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 border-2 border-[#33172E] bg-[#FF5C9E]" />
              <span className="h-3 w-3 border-2 border-[#33172E] bg-[#FFB370]" />
              <span className="h-3 w-3 border-2 border-[#33172E] bg-[#7FE3C9]" />
            </div>
            <span className="pixel text-base text-[#9A4B7C]">rebrand_reveal.exe — 1996×2025</span>
          </div>

          <div className="relative px-7 pb-10 pt-9 sm:px-9">
            {/* retro sun */}
            <div className="pointer-events-none absolute -right-10 top-6 hidden sm:block">
              <div className="relative h-44 w-44 rounded-full bg-gradient-to-b from-[#FFB370] via-[#FF5C9E] to-[#E8417F] opacity-90">
                <div className="sun-stripes absolute inset-0 rounded-full" />
              </div>
            </div>

            <span className="pixel inline-block border-2 border-[#33172E] bg-[#C7A6FF] px-2 py-0.5 text-base">
              ★ NEW NAME · SAME PEOPLE WHO PICK UP THE PHONE
            </span>

            <h1 className="display mt-5 max-w-xl text-4xl font-extrabold leading-[1.04] tracking-tight sm:text-[3.4rem]">
              Gradient Labs grew up.
              <br />
              Meet <span className="relative inline-block bg-[#FF5C9E] px-2 text-[#FFF8F1]">tend</span> —
              ML infrastructure that looks after you.
            </h1>

            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-[#5C2E50]">
              We rebuilt our pricing the way we rebuilt our name: simpler, kinder, and honest.
              No surprise overages. No abandoned tickets. Every plan comes with a real human
              caretaker who knows your models by name.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button className="btn-solid flex items-center gap-2 border-2 border-[#33172E] bg-[#FF5C9E] px-5 py-3 text-sm font-bold text-[#FFF8F1]">
                Start tending free <ArrowRight className="h-4 w-4" />
              </button>
              <button className="btn-solid flex items-center gap-2 border-2 border-[#33172E] bg-[#FFF8F1] px-5 py-3 text-sm font-bold">
                <Phone className="h-4 w-4" /> Talk to a caretaker
              </button>
            </div>

            <p className="pixel mt-5 text-base text-[#9A4B7C]">
              ▸ existing Gradient Labs plans migrate free · prices frozen until 2027
            </p>
          </div>

          {/* horizon grid floor */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 overflow-hidden">
            <div className="horizon-grid h-48 w-[140%] -translate-x-[14%]" />
          </div>
        </section>

        {/* BILLING TOGGLE */}
        <section className="card col-span-1 lg:col-span-5">
          <div className="flex flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="pixel text-lg text-[#9A4B7C]">billing_mode.cfg</p>
              <h2 className="display text-xl font-bold">Pay how it feels right</h2>
              <p className="mt-1 text-sm text-[#5C2E50]">
                Annual saves ~20%. Switch anytime, no hard feelings.
              </p>
            </div>
            <div className="flex border-2 border-[#33172E] bg-[#FFF8F1] shadow-[3px_3px_0_0_#33172E]">
              {[
                { id: 'monthly', label: 'Monthly' },
                { id: 'annual', label: 'Annual −20%' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setBilling(opt.id)}
                  className={`px-4 py-2.5 text-sm font-bold transition-colors duration-150 ${
                    billing === opt.id
                      ? 'bg-[#33172E] text-[#FFF8F1]'
                      : 'bg-transparent text-[#33172E] hover:bg-[#FFE2EE]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* CARE STAT */}
        <section className="card col-span-1 lg:col-span-5">
          <div className="grid grid-cols-3 divide-x-2 divide-[#33172E]">
            {[
              { icon: Clock3, big: '3 min', small: 'median human reply' },
              { icon: MessageCircleHeart, big: '0', small: 'chatbots between you & us' },
              { icon: ShieldCheck, big: '99.98%', small: 'uptime, last 12 mo' },
            ].map((s, i) => (
              <div key={i} className="group px-4 py-5 transition-colors duration-150 hover:bg-[#FFE9F2]">
                <s.icon className="h-5 w-5 text-[#E8417F] transition-transform duration-150 group-hover:scale-110" />
                <p className="display mt-2 text-2xl font-extrabold">{s.big}</p>
                <p className="mt-0.5 text-xs leading-snug text-[#7A3D68]">{s.small}</p>
              </div>
            ))}
          </div>
        </section>

        {/* PLAN CARDS */}
        {PLANS.map((plan) => {
          const price = billing === 'annual' ? plan.annual : plan.monthly;
          const span = plan.featured ? 'lg:col-span-5' : plan.id === 'garden' ? 'lg:col-span-4' : 'lg:col-span-3';
          return (
            <section
              key={plan.id}
              className={`card relative col-span-1 flex flex-col ${span}`}
              style={plan.featured ? { background: '#FFF0F6' } : undefined}
            >
              {plan.featured && (
                <span className="pixel absolute -top-3 left-5 z-10 border-2 border-[#33172E] bg-[#FFB370] px-2 py-0.5 text-base">
                  ★ MOST LOVED
                </span>
              )}
              <div className="flex items-center justify-between border-b-2 border-[#33172E] px-5 py-3">
                <div className="flex items-center gap-2">
                  <span
                    className="flex h-8 w-8 items-center justify-center border-2 border-[#33172E]"
                    style={{ background: plan.accent }}
                  >
                    <plan.icon className="h-4 w-4 text-[#33172E]" />
                  </span>
                  <h3 className="display text-lg font-bold">{plan.name}</h3>
                </div>
                <span className="pixel text-base text-[#9A4B7C]">{plan.id}.plan</span>
              </div>

              <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
                <p className="text-sm text-[#7A3D68]">{plan.tagline}</p>
                <div className="mt-3 flex items-end gap-2">
                  <span className="display text-5xl font-extrabold tracking-tight">
                    {price === 0 ? '$0' : `$${price}`}
                  </span>
                  <span className="pb-1.5 text-sm text-[#7A3D68]">
                    / mo {billing === 'annual' && price > 0 ? '· billed yearly' : ''}
                  </span>
                </div>
                {billing === 'annual' && plan.monthly > 0 && (
                  <p className="pixel mt-1 text-base text-[#1E8E6C]">
                    ▾ was ${plan.monthly}/mo on monthly
                  </p>
                )}

                <ul className="mt-4 space-y-1">
                  {plan.features.map((f) => (
                    <li key={f} className="feature-row flex items-center gap-2 py-1.5 text-sm">
                      <Check className="h-4 w-4 shrink-0" style={{ color: '#E8417F' }} strokeWidth={3} />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  className="btn-solid mt-auto w-full border-2 border-[#33172E] px-4 py-3 pt-3 text-sm font-bold"
                  style={{
                    background: plan.featured ? '#FF5C9E' : '#FFF8F1',
                    color: plan.featured ? '#FFF8F1' : '#33172E',
                    marginTop: '1.25rem',
                  }}
                >
                  {plan.cta}
                </button>
              </div>
            </section>
          );
        })}

        {/* ENTERPRISE / GREENHOUSE */}
        <section className="card col-span-1 lg:col-span-6">
          <div className="flex h-full flex-col justify-between gap-5 px-6 py-6 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center border-2 border-[#33172E] bg-[#FFE2A8]">
                  <Building2 className="h-4 w-4" />
                </span>
                <h3 className="display text-xl font-bold">Greenhouse</h3>
                <span className="pixel border-2 border-[#33172E] bg-[#7FE3C9] px-1.5 text-base">ENTERPRISE</span>
              </div>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-[#5C2E50]">
                Private VPC deployment, custom SLAs, on-site model audits, and a named caretaker
                team that joins your standups. Pricing shaped around your season — not ours.
              </p>
            </div>
            <button className="btn-solid shrink-0 border-2 border-[#33172E] bg-[#33172E] px-5 py-3 text-sm font-bold text-[#FFF8F1]">
              Design my plan
            </button>
          </div>
        </section>

        {/* TESTIMONIAL */}
        <section className="card col-span-1 lg:col-span-3">
          <div className="flex h-full flex-col px-5 py-5">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 text-[#FFB370]" fill="#FFB370" />
              ))}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-[#33172E]">
              “Our model drifted at 2am before a launch. A human from tend called <em>us</em> first.
              I didn't know infra companies could feel like this.”
            </p>
            <div className="mt-auto flex items-center gap-3 pt-4">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=96&h=96&fit=crop"
                alt="Priya Raman"
                className="h-9 w-9 border-2 border-[#33172E] object-cover"
              />
              <div className="leading-tight">
                <p className="text-sm font-semibold">Priya Raman</p>
                <p className="pixel text-base text-[#9A4B7C]">Head of ML · Lumen Health</p>
              </div>
            </div>
          </div>
        </section>

        {/* GUARANTEE */}
        <section className="card col-span-1 bg-[#F2EAFF] lg:col-span-3" style={{ background: '#F4ECFF' }}>
          <div className="flex h-full flex-col px-5 py-5">
            <Sparkles className="h-5 w-5 text-[#8B5CF0]" />
            <h3 className="display mt-2 text-lg font-bold">The gentle guarantee</h3>
            <ul className="mt-2 space-y-2 text-sm text-[#4A2A55]">
              <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#8B5CF0]" strokeWidth={3} /> 60-day full refund, no forms</li>
              <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#8B5CF0]" strokeWidth={3} /> Overages capped, never billed silently</li>
              <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#8B5CF0]" strokeWidth={3} /> Your weights leave with you, always</li>
            </ul>
            <p className="pixel mt-auto pt-4 text-base text-[#7A57A8]">est. 2019 · renamed with love, 2025</p>
          </div>
        </section>
      </main>

      {/* ---------- FOOTER STRIP ---------- */}
      <footer className="border-t-2 border-[#33172E] bg-[#FFE2EE]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-4 lg:px-8">
          <p className="pixel text-base text-[#7A3D68]">
            ☎ caretakers online now · hello@tend.ai · webring: ◂ prev | random | next ▸
          </p>
          <p className="pixel text-base text-[#7A3D68]">© 2025 tend.ai — best viewed at any resolution, by anyone</p>
        </div>
      </footer>
    </div>
  );
}