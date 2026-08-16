import { Link, useLocation } from "wouter";
import { LayoutDashboard, User, Target, Briefcase, BarChart2, Bell, Compass } from "lucide-react";
import { cn } from "@/lib/utils";

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

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <div className="w-60 border-r border-sidebar-border bg-sidebar flex flex-col shrink-0">

        {/* Brand */}
        <div className="h-16 flex items-center gap-3 px-5 border-b border-sidebar-border">
          <Compass className="h-4 w-4 text-primary shrink-0" strokeWidth={1.5} />
          <span
            className="text-xl leading-none tracking-wide text-primary"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontWeight: 500 }}
          >
            Career Compass
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-6 flex flex-col gap-0.5 px-3">
          {navigation.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-3 px-3 py-2.5 text-sm rounded-[var(--radius)] transition-all duration-150",
                  isActive
                    ? "bg-sidebar-accent text-primary"
                    : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/60"
                )}
              >
                {/* Gold left accent bar for active */}
                {isActive && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full bg-primary" />
                )}
                <Icon
                  className={cn("shrink-0 h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")}
                  strokeWidth={1.5}
                />
                <span className={cn("font-medium", isActive ? "text-primary" : "")}>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Status */}
        <div className="px-5 py-4 border-t border-sidebar-border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-60"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent"></span>
            </span>
            Live data connected
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header className="h-14 border-b border-border bg-card/50 backdrop-blur-sm flex items-center px-8 justify-between shrink-0">
          <div className="text-xs font-mono text-muted-foreground tracking-widest uppercase">
            {location === "/" ? "Dashboard" : location.replace("/", "").replace(/-/g, " ")}
          </div>
          <div className="text-xs font-mono text-muted-foreground/60">
            {new Date().toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" })}
          </div>
        </header>

        <main className="flex-1 overflow-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
