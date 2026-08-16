import { Link, useLocation } from "wouter";
import { LayoutDashboard, User, Target, Briefcase, BarChart, Bell, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navigation = [
    { name: "Overview", href: "/", icon: LayoutDashboard },
    { name: "Job Seeker Profile", href: "/profile", icon: User },
    { name: "Target Roles", href: "/target-roles", icon: Target },
    { name: "Live Jobs", href: "/jobs", icon: Briefcase },
    { name: "Insights", href: "/insights", icon: BarChart },
    { name: "Alerts", href: "/alerts", icon: Bell },
  ];

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <div className="w-64 border-r border-border bg-card flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-border bg-muted/10">
          <Zap className="h-5 w-5 text-primary mr-2" />
          <span className="font-mono font-bold text-lg tracking-tight uppercase">Career Compass</span>
        </div>
        
        <nav className="flex-1 py-4 flex flex-col gap-1 px-3">
          {navigation.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium transition-colors border",
                  isActive
                    ? "bg-primary/10 text-primary border-primary/20"
                    : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground hover:border-border"
                )}
              >
                <Icon className={cn("mr-3 flex-shrink-0 h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center text-xs text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></div>
            System Online
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-border bg-card flex items-center px-8 justify-between">
          <div className="text-sm text-muted-foreground font-mono">
            {location.toUpperCase() || "/DASHBOARD"}
          </div>
          <div className="flex items-center gap-4">
            <div className="text-xs font-mono text-muted-foreground text-right">
              <div>V 0.1.0</div>
              <div>{new Date().toISOString().split('T')[0]}</div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto bg-background p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
