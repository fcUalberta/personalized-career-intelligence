import { Link, useLocation } from "wouter";
import { LayoutDashboard, User, Target, Briefcase, BarChart2, Bell, HeartPulse } from "lucide-react";
import { cn } from "@/lib/utils";

const TICKER_ITEMS = [
  "Real-time job intelligence",
  "Live match scoring",
  "Comp benchmarking",
  "Skill gap analysis",
  "Market positioning",
  "Career trajectory",
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Profile", href: "/profile", icon: User },
    { name: "Target Roles", href: "/target-roles", icon: Target },
    { name: "Live Jobs", href: "/jobs", icon: Briefcase },
    { name: "Insights", href: "/insights", icon: BarChart2 },
    { name: "Alerts", href: "/alerts", icon: Bell },
  ];

  const routeLabel = location === "/"
    ? "Dashboard"
    : location.replace("/", "").replace(/-/g, " ");

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Film grain */}
      <div className="grain" aria-hidden="true" />

      {/* ── Sidebar — warm ink dark panel ── */}
      <div className="w-56 bg-sidebar flex flex-col shrink-0">

        {/* Brand — Fraunces wordmark + Karla smallcaps descriptor */}
        <div className="px-6 pt-7 pb-6" style={{ borderBottom: '1px solid rgba(242,234,217,0.10)' }}>
          <div className="flex items-center gap-2.5 mb-1.5">
            {/* Organic blob logo mark — Marrow & Loom style */}
            <div
              className="flex h-8 w-8 items-center justify-center shrink-0"
              style={{
                background: '#E2491F',
                borderRadius: '58% 42% 55% 45% / 48% 55% 45% 52%',
              }}
            >
              <HeartPulse size={14} color="#F2EAD9" strokeWidth={2.4} />
            </div>
            <span
              className="text-[18px] font-semibold leading-none tracking-tight text-sidebar-foreground"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            >
              Career Compass
            </span>
          </div>
          <p className="smallcaps pl-10" style={{ color: 'rgba(242,234,217,0.45)', fontSize: '0.72rem' }}>
            Intelligence · v0.1
          </p>
        </div>

        {/* Nav — numbered smallcaps */}
        <nav className="flex-1 py-3">
          {navigation.map((item, i) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-3 px-6 py-3 transition-all duration-200",
                  isActive ? "text-sidebar-foreground" : ""
                )}
                style={{
                  borderBottom: '1px solid rgba(242,234,217,0.06)',
                  color: isActive ? '#F2EAD9' : 'rgba(242,234,217,0.42)',
                }}
              >
                {isActive && (
                  <span
                    className="absolute left-0 top-1 bottom-1 w-[2px] rounded-full"
                    style={{ background: '#E2491F' }}
                  />
                )}
                <span className="smallcaps w-5 shrink-0 text-[0.68rem]"
                  style={{ color: isActive ? '#E2491F' : 'rgba(242,234,217,0.28)' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <Icon className="shrink-0 h-3.5 w-3.5" strokeWidth={1.5} />
                <span className="smallcaps text-[0.75rem]">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Status */}
        <div className="px-6 py-5" style={{ borderTop: '1px solid rgba(242,234,217,0.07)' }}>
          <div className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-50"
                style={{ background: '#E2491F' }} />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: '#E2491F' }} />
            </span>
            <span className="smallcaps text-[0.65rem]" style={{ color: 'rgba(242,234,217,0.35)' }}>
              Live data connected
            </span>
          </div>
        </div>
      </div>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Masthead */}
        <header
          className="flex items-center justify-between px-8 bg-card shrink-0"
          style={{ height: '3.5rem', borderBottom: '1px solid hsl(var(--border))' }}
        >
          <span className="smallcaps" style={{ color: 'rgba(42,31,22,0.55)' }}>{routeLabel}</span>
          <div className="flex items-center gap-3">
            <span className="smallcaps" style={{ color: 'rgba(42,31,22,0.35)', fontSize: '0.72rem' }}>
              {new Date().toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" })}
            </span>
            <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: '#E2491F' }} />
          </div>
        </header>

        {/* Ticker — rounded-full pill container (Marrow & Loom marquee footer style) */}
        <div className="px-8 py-3 shrink-0" style={{ borderBottom: '1px solid hsl(var(--border))' }}>
          <div
            className="overflow-hidden rounded-full py-2 px-1"
            style={{ border: '1px solid rgba(42,31,22,0.12)', background: 'hsl(var(--card))' }}
          >
            <div className="ticker-track flex w-max whitespace-nowrap">
              {[0, 1].map((rep) => (
                <span key={rep} className="flex items-center">
                  {TICKER_ITEMS.map((item, j) => (
                    <span key={`${rep}-${j}`} className="flex items-center gap-5 px-5">
                      <span className="smallcaps text-[0.72rem]" style={{ color: 'rgba(42,31,22,0.55)' }}>
                        {item}
                      </span>
                      <span style={{ color: '#E2491F', fontSize: '0.6rem' }}>✦</span>
                    </span>
                  ))}
                </span>
              ))}
            </div>
          </div>
        </div>

        <main className="flex-1 overflow-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
