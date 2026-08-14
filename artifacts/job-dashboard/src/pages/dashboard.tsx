import { useGetDashboardSummary, useGetJobMatches } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Target, Bell, Zap, TrendingUp, Building2, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const { data: summary, isLoading: isLoadingSummary } = useGetDashboardSummary();
  const { data: matches, isLoading: isLoadingMatches } = useGetJobMatches({ minMatch: 70 });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-mono tracking-tight">COMMAND CENTER</h1>
        <p className="text-muted-foreground">Real-time intelligence for your career operation.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard 
          title="NEW MATCHES" 
          value={isLoadingSummary ? null : summary?.newJobMatchesThisWeek} 
          icon={<Zap className="h-4 w-4 text-primary" />} 
          label="This week"
        />
        <StatCard 
          title="PEAK MATCH" 
          value={isLoadingSummary ? null : `${summary?.topMatchScore}%`} 
          icon={<Target className="h-4 w-4 text-emerald-500" />}
          label={summary?.topTargetRole || "No target"}
        />
        <StatCard 
          title="ACTIVE TARGETS" 
          value={isLoadingSummary ? null : summary?.activeTargetRoles} 
          icon={<Briefcase className="h-4 w-4 text-blue-500" />}
          label="Tracked roles"
        />
        <StatCard 
          title="UNREAD ALERTS" 
          value={isLoadingSummary ? null : summary?.unreadAlerts} 
          icon={<Bell className="h-4 w-4 text-amber-500" />}
          label="Requires attention"
          highlight={summary?.unreadAlerts ? summary.unreadAlerts > 0 : false}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
              <div className="space-y-1">
                <CardTitle className="text-base font-mono">LIVE MATCH FEED</CardTitle>
                <CardDescription>Top opportunities matching your profile & targets</CardDescription>
              </div>
              <Badge variant="outline" className="font-mono">{matches?.length || 0} MATCHES</Badge>
            </CardHeader>
            <CardContent className="p-0">
              {isLoadingMatches ? (
                <div className="p-6 space-y-4">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : matches && matches.length > 0 ? (
                <div className="divide-y divide-border">
                  {matches.slice(0, 5).map((m) => (
                    <div key={m.job.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                      <div>
                        <h4 className="font-medium">{m.job.title}</h4>
                        <div className="flex items-center text-sm text-muted-foreground mt-1 space-x-3">
                          <span className="flex items-center"><Building2 className="h-3 w-3 mr-1" />{m.job.company}</span>
                          <span>•</span>
                          <span>{m.job.location}</span>
                          {m.job.salary && (
                            <>
                              <span>•</span>
                              <span className="font-mono text-foreground">${(m.job.salary/1000).toFixed(0)}k{m.job.salaryMax ? ` - ${(m.job.salaryMax/1000).toFixed(0)}k` : ''}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <Badge variant={m.matchScore >= 90 ? 'accent' : 'secondary'} className="font-mono text-sm">
                          {m.matchScore}% MATCH
                        </Badge>
                        <span className="text-xs text-muted-foreground mt-2">{m.job.postedAt}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground border-t border-border">
                  No matches found. Update your profile or target roles.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-mono flex items-center">
                <TrendingUp className="h-4 w-4 mr-2 text-primary" />
                MARKET POSITION
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingSummary ? (
                <Skeleton className="h-32 w-full" />
              ) : summary?.avgCompPercentile ? (
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground">Average Comp Percentile</div>
                  <div className="text-4xl font-mono font-bold">P{summary.avgCompPercentile}</div>
                  <div className="w-full bg-secondary h-2 mt-4 relative">
                    <div 
                      className="absolute top-0 left-0 h-full bg-primary" 
                      style={{ width: `${summary.avgCompPercentile}%` }} 
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Based on your targeted roles and minimum compensation requirements.
                  </p>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">Insufficient data. Add target roles with comp floors to see positioning.</div>
              )}
            </CardContent>
          </Card>
          
          <Card className={!summary?.profileComplete ? 'border-amber-500/50 bg-amber-500/5' : ''}>
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-mono">SYSTEM STATUS</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm font-mono">
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Profile</span>
                  {summary?.profileComplete ? <span className="text-emerald-500">COMPLETE</span> : <span className="text-amber-500">INCOMPLETE</span>}
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Target Roles</span>
                  <span className={summary?.activeTargetRoles && summary.activeTargetRoles > 0 ? "text-emerald-500" : "text-amber-500"}>
                    {summary?.activeTargetRoles || 0} TRACKED
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, label, highlight }: { title: string, value: any, icon: React.ReactNode, label?: string, highlight?: boolean }) {
  return (
    <Card className={cn(highlight && "border-amber-500")}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <p className="text-xs font-mono font-medium text-muted-foreground tracking-wider">{title}</p>
          {icon}
        </div>
        <div className="mt-2">
          <div className="text-2xl font-bold font-mono">
            {value === null || value === undefined ? <Skeleton className="h-8 w-16" /> : value}
          </div>
          {label && (
            <p className="text-xs text-muted-foreground mt-1 truncate">{label}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
