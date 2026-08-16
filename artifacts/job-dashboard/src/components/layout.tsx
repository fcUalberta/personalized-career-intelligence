import { Link, useLocation } from "wouter";
import { LayoutDashboard, User, Target, Briefcase, BarChart2, Bell, Zap, ArrowUpRight } from "lucide-react";
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

      {/* ===== Sidebar — dark editorial column ===== */}
      <div className="w-56 border-r border-sidebar-border bg-sidebar flex flex-col shrink-0">

        {/* Brand */}
        <div className="h-14 flex items-center gap-2.5 px-5 border-b border-sidebar-border">
          <Zap className="h-3.5 w-3.5 fill-primary text-primary shrink-0" strokeWidth={1.5} />
          <span
            className="text-[13px] font-bold tracking-[0.18em] uppercase text-sidebar-foreground leading-none"
            style={{ fontFamily: "'Archivo Expanded', 'Archivo', sans-serif" }}
          >
            Career Compass
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 flex flex-col">
          {navigation.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-3 px-5 py-3 text-[11px] font-mono uppercase tracking-[0.14em] transition-colors duration-150 border-b border-sidebar-border/40",
                  isActive
                    ? "bg-sidebar-accent text-primary"
                    : "text-sidebar-foreground/55 hover:text-sidebar-foreground hover:bg-sidebar-accent/70"
                )}
              >
                {isActive && (
                  <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-primary" />
                )}
                <Icon
                  className={cn("shrink-0 h-3.5 w-3.5", isActive ? "text-primary" : "text-sidebar-foreground/40")}
                  strokeWidth={1.5}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Status */}
        <div className="px-5 py-4 border-t border-sidebar-border/40">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.16em] text-sidebar-foreground/35">
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-50" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
            </span>
            Live data connected
          </div>
        </div>
      </div>

      {/* ===== Main ===== */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Masthead */}
        <header className="flex items-stretch border-b border-border bg-card shrink-0" style={{ height: "3.5rem" }}>
          <div className="flex items-center px-6 border-r border-border">
            <span
              className="text-[11px] font-mono uppercase tracking-[0.2em] text-muted-foreground"
            >
              {routeLabel}
            </span>
          </div>
          <div className="flex-1 flex items-center px-6">
            <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground/50">
              Career Intelligence Platform
            </span>
          </div>
          <div className="flex items-center gap-4 px-6 border-l border-border">
            <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground/50">
              {new Date().toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" })}
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          </div>
        </header>

        {/* Ticker */}
        <div className="w-full overflow-hidden border-b border-border bg-foreground py-2 text-background shrink-0">
          <div className="ticker-track flex w-max whitespace-nowrap">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="text-[10px] uppercase tracking-[0.22em] px-8 opacity-80"
                style={{ fontFamily: "'Archivo Expanded', 'Archivo', sans-serif", fontWeight: 600 }}
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
