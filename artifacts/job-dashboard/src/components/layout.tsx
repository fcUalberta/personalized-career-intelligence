import { Link, useLocation } from "wouter";
import { LayoutDashboard, User, Target, Briefcase, BarChart2, Bell, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

const TICKER = "CAREER COMPASS — REAL-TIME INTELLIGENCE FOR YOUR CAREER — LIVE JOB MATCHES — COMP BENCHMARKING — SKILL GAP ANALYSIS — MARKET POSITIONING — ";

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

      {/* ── Sidebar — warm chocolate dark panel (Voxa left column) ── */}
      <div className="w-56 bg-sidebar flex flex-col shrink-0" style={{ borderRight: '1px solid rgba(216,203,178,0.14)' }}>

        {/* Brand — "Voxa" style: serif wordmark + smallcaps descriptor */}
        <div className="px-7 pt-7 pb-6" style={{ borderBottom: '1px solid rgba(216,203,178,0.14)' }}>
          <div className="flex items-baseline gap-2.5">
            <span
              className="text-[22px] font-semibold leading-none tracking-tight text-sidebar-foreground"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            >
              Career Compass
            </span>
          </div>
          <p className="smallcaps text-[11px] mt-1.5" style={{ color: '#b3a285' }}>
            Career Intelligence · v0.1
          </p>
        </div>

        {/* Nav — numbered list style, smallcaps labels */}
        <nav className="flex-1 py-2">
          {navigation.map((item, i) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-3 px-7 py-3.5 transition-all duration-200",
                  isActive
                    ? "text-sidebar-foreground"
                    : "hover:text-sidebar-foreground"
                )}
                style={{
                  borderBottom: '1px solid rgba(216,203,178,0.08)',
                  color: isActive ? '#f2ead9' : '#6e5b44',
                  paddingLeft: isActive ? '32px' : undefined,
                }}
              >
                {/* clay left accent for active */}
                {isActive && (
                  <span
                    className="absolute left-0 top-0 bottom-0 w-[2px]"
                    style={{ background: '#c0703f' }}
                  />
                )}
                <span className="smallcaps text-[11px] w-5 shrink-0" style={{ color: isActive ? '#c0703f' : '#4a3e30' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <Icon
                  className="shrink-0 h-3.5 w-3.5"
                  strokeWidth={1.5}
                  style={{ color: isActive ? '#f2ead9' : '#6e5b44' }}
                />
                <span className="smallcaps text-[12px]">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Status */}
        <div className="px-7 py-5" style={{ borderTop: '1px solid rgba(216,203,178,0.10)' }}>
          <div className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-50" style={{ background: '#c0703f' }} />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: '#c0703f' }} />
            </span>
            <span className="smallcaps text-[10px]" style={{ color: '#4a3e30' }}>Live data connected</span>
          </div>
        </div>
      </div>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Masthead — editorial column header */}
        <header
          className="flex items-stretch bg-card shrink-0"
          style={{ height: '3.5rem', borderBottom: '1px solid hsl(var(--border))' }}
        >
          <div
            className="flex items-center px-8"
            style={{ borderRight: '1px solid hsl(var(--border))' }}
          >
            <span className="smallcaps text-[12px]" style={{ color: '#6e5b44' }}>{routeLabel}</span>
          </div>
          <div className="flex-1 flex items-center px-8">
            <span className="smallcaps text-[11px]" style={{ color: '#b3a285' }}>
              Career Intelligence Platform
            </span>
          </div>
          <div
            className="flex items-center gap-3 px-8"
            style={{ borderLeft: '1px solid hsl(var(--border))' }}
          >
            <span className="smallcaps text-[11px]" style={{ color: '#b3a285' }}>
              {new Date().toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" })}
            </span>
            <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: '#c0703f' }} />
          </div>
        </header>

        {/* Ticker — dark bar with cream smallcaps text */}
        <div
          className="w-full overflow-hidden shrink-0 py-2"
          style={{ borderBottom: '1px solid hsl(var(--border))', background: '#211a14' }}
        >
          <div className="ticker-track flex w-max whitespace-nowrap">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="smallcaps text-[10px] px-8"
                style={{ color: '#b3a285' }}
              >
                {TICKER}
              </span>
            ))}
          </div>
        </div>

        <main className="flex-1 overflow-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
