import { useGetSkillAnalysis, useGetCompData, useGetCareerTrajectory, useGetPeerBenchmark, useListTargetRoles } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Radar, LineChart, TrendingUp, Users, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function Insights() {
  const { data: targets } = useListTargetRoles();
  const defaultTarget = targets?.[0]?.roleName;
  
  const [selectedRole, setSelectedRole] = useState<string | undefined>(undefined);
  
  const activeRole = selectedRole || defaultTarget;

  const { data: skillAnalysis, isLoading: loadingSkills } = useGetSkillAnalysis();
  const { data: compData, isLoading: loadingComp } = useGetCompData({ role: activeRole });
  const { data: trajectory, isLoading: loadingTrajectory } = useGetCareerTrajectory();
  const { data: benchmark, isLoading: loadingBenchmark } = useGetPeerBenchmark();

  const activeSkillAnalysis = skillAnalysis?.find(s => s.roleName === activeRole) || skillAnalysis?.[0];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold font-mono tracking-tight">MARKET INSIGHTS</h1>
          <p className="text-muted-foreground">Macro data analysis against your specific trajectory.</p>
        </div>
        
        {targets && targets.length > 0 && (
          <select 
            className="bg-card border p-2 text-sm font-medium font-mono focus:outline-none focus:ring-1 focus:ring-ring"
            value={activeRole || ""}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            {targets.map(t => (
              <option key={t.id} value={t.roleName}>{t.roleName}</option>
            ))}
          </select>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* SKILL GAP HEATMAP */}
        <Card className="flex flex-col">
          <CardHeader className="border-b bg-muted/10">
            <CardTitle className="text-base font-mono flex items-center">
              <Radar className="w-4 h-4 mr-2 text-primary" />
              SKILL GAP HEATMAP
            </CardTitle>
            <CardDescription>High-demand missing skills for {activeRole || "target roles"}</CardDescription>
          </CardHeader>
          <CardContent className="p-6 flex-1">
            {loadingSkills ? <Skeleton className="h-48 w-full" /> : activeSkillAnalysis ? (
              <div className="space-y-6">
                <div className="flex items-end justify-between border-b pb-4">
                  <div>
                    <div className="text-sm font-mono text-muted-foreground">Market Match</div>
                    <div className="text-3xl font-mono font-bold text-primary">{activeSkillAnalysis.matchPercentage}%</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-mono text-muted-foreground">Sample Size</div>
                    <div className="text-xl font-mono">{activeSkillAnalysis.totalJobsAnalyzed} jobs</div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-mono font-bold tracking-wider mb-3">CRITICAL GAPS TO FILL</h4>
                  <div className="space-y-3">
                    {activeSkillAnalysis.gapSkills.slice(0, 5).map(gap => (
                      <div key={gap.skill} className="flex items-center justify-between group">
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-amber-500 mr-2" />
                          <span className="font-medium text-sm">{gap.skill}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-xs text-muted-foreground font-mono">in {gap.inDemandCount}% of JD's</span>
                          <Progress value={gap.inDemandCount} className="w-20 h-1.5" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : <div className="text-center py-10 text-muted-foreground font-mono">No data available</div>}
          </CardContent>
        </Card>

        {/* COMP POSITIONING */}
        <Card className="flex flex-col">
          <CardHeader className="border-b bg-muted/10">
            <CardTitle className="text-base font-mono flex items-center">
              <LineChart className="w-4 h-4 mr-2 text-primary" />
              COMPENSATION BAND
            </CardTitle>
            <CardDescription>Market distribution for {activeRole || "target roles"}</CardDescription>
          </CardHeader>
          <CardContent className="p-6 flex-1">
            {loadingComp ? <Skeleton className="h-48 w-full" /> : compData ? (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground font-mono">Your Target Percentile</div>
                    <div className="text-4xl font-mono font-bold">P{compData.userPercentile}</div>
                  </div>
                  <Badge variant={compData.trend === 'up' ? 'default' : 'secondary'} className="font-mono px-3 py-1">
                    {compData.trend === 'up' ? '↑' : compData.trend === 'down' ? '↓' : '→'} {Math.abs(compData.trendPercent)}% YoY
                  </Badge>
                </div>

                <div className="pt-6 relative">
                  {/* Chart track */}
                  <div className="h-3 bg-muted w-full relative rounded-full overflow-hidden">
                    <div className="absolute top-0 bottom-0 bg-primary/20" style={{ left: '25%', right: '25%' }} />
                    <div className="absolute top-0 bottom-0 bg-primary/40" style={{ left: '50%', width: '2px' }} />
                  </div>
                  
                  {/* Markers */}
                  <div className="flex justify-between text-xs font-mono text-muted-foreground mt-3">
                    <div className="text-left -ml-4">
                      <div>P25</div>
                      <div className="font-bold text-foreground">${(compData.band.p25/1000).toFixed(0)}k</div>
                    </div>
                    <div className="text-center">
                      <div>MEDIAN</div>
                      <div className="font-bold text-foreground">${(compData.band.p50/1000).toFixed(0)}k</div>
                    </div>
                    <div className="text-right -mr-4">
                      <div>P75</div>
                      <div className="font-bold text-foreground">${(compData.band.p75/1000).toFixed(0)}k</div>
                    </div>
                  </div>

                  {/* User Pin */}
                  <div 
                    className="absolute top-0 -mt-2 -ml-2 flex flex-col items-center" 
                    style={{ left: `${compData.userPercentile}%` }}
                  >
                    <div className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded shadow-sm mb-1">YOU</div>
                    <div className="w-0.5 h-6 bg-primary" />
                  </div>
                </div>
                
                <p className="text-xs text-muted-foreground text-center font-mono">Sample Size: {compData.sampleSize} data points</p>
              </div>
            ) : <div className="text-center py-10 text-muted-foreground font-mono">No data available</div>}
          </CardContent>
        </Card>

        {/* CAREER TRAJECTORY */}
        <Card className="flex flex-col lg:col-span-2">
          <CardHeader className="border-b bg-muted/10">
            <CardTitle className="text-base font-mono flex items-center">
              <TrendingUp className="w-4 h-4 mr-2 text-primary" />
              PREDICTED TRAJECTORY
            </CardTitle>
            <CardDescription>Statistical career paths based on your current node</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {loadingTrajectory ? <Skeleton className="h-32 w-full" /> : trajectory ? (
              <div>
                <div className="mb-6 font-mono text-sm border-l-2 border-primary pl-4 py-1">
                  CURRENT NODE: <span className="font-bold text-foreground">{trajectory.currentTitle}</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {trajectory.nextRoles.map((role, idx) => (
                    <div key={idx} className="border bg-card p-5 relative group hover:border-primary/50 transition-colors">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-bold">{role.title}</h4>
                        <Badge variant="outline" className="font-mono bg-muted/50">{role.transitionRate}% PROB</Badge>
                      </div>
                      
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between border-b pb-2">
                          <span className="text-muted-foreground">Time to reach</span>
                          <span className="font-mono font-medium">~{role.typicalYearsToReach} yrs</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                          <span className="text-muted-foreground">Market Comp</span>
                          <span className="font-mono font-medium">{role.salaryRange}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground text-xs block mb-1">Required vectors:</span>
                          <div className="flex flex-wrap gap-1">
                            {role.skillsNeeded.map(s => (
                              <span key={s} className="text-xs bg-secondary px-1.5 py-0.5">{s}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : <div className="text-center py-10 text-muted-foreground font-mono">No data available</div>}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
