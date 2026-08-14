import { useState } from "react";
import { useGetJobMatches, useListTargetRoles } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, Building2, MapPin, DollarSign, Target } from "lucide-react";
import { Select } from "@/components/ui/select"; // We'll just use a native select for simplicity since we didn't build a complex one

export default function Jobs() {
  const [targetRoleId, setTargetRoleId] = useState<number | undefined>(undefined);
  const [minMatch, setMinMatch] = useState<number>(50);

  const { data: targets } = useListTargetRoles();
  const { data: matches, isLoading } = useGetJobMatches({ 
    targetRoleId, 
    minMatch 
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold font-mono tracking-tight">LIVE JOB FEED</h1>
          <p className="text-muted-foreground">Scored and filtered against your profile vector.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 bg-card p-2 border rounded-none shadow-sm">
          <div className="flex items-center space-x-2 px-2">
            <Target className="w-4 h-4 text-muted-foreground" />
            <select 
              className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer"
              value={targetRoleId || ""}
              onChange={(e) => setTargetRoleId(e.target.value ? Number(e.target.value) : undefined)}
            >
              <option value="">All Targets</option>
              {targets?.map(t => (
                <option key={t.id} value={t.id}>{t.roleName}</option>
              ))}
            </select>
          </div>
          <div className="w-px h-6 bg-border"></div>
          <div className="flex items-center space-x-2 px-2 text-sm font-medium">
            <span className="text-muted-foreground font-mono">Min Match:</span>
            <select
              className="bg-transparent font-mono focus:outline-none cursor-pointer"
              value={minMatch}
              onChange={(e) => setMinMatch(Number(e.target.value))}
            >
              <option value={0}>0%</option>
              <option value={50}>50%</option>
              <option value={70}>70%</option>
              <option value={80}>80%</option>
              <option value={90}>90%</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          <>
            <Card><CardContent className="p-6"><Skeleton className="h-24 w-full" /></CardContent></Card>
            <Card><CardContent className="p-6"><Skeleton className="h-24 w-full" /></CardContent></Card>
          </>
        ) : matches && matches.length > 0 ? (
          matches.map((match) => (
            <Card key={match.job.id} className="overflow-hidden hover:border-primary/50 transition-colors group">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-48 bg-muted/30 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-border">
                  <div className="text-4xl font-mono font-bold tracking-tighter mb-2" style={{ color: `hsl(${120 * (match.matchScore/100)} 70% 45%)` }}>
                    {match.matchScore}%
                  </div>
                  <div className="text-xs font-mono tracking-wider text-muted-foreground mb-4">MATCH SCORE</div>
                  <Progress value={match.matchScore} className="h-1 w-full max-w-[120px]" />
                </div>
                
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold">{match.job.title}</h3>
                      <a href={match.job.url} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors flex items-center text-sm font-medium">
                        APPLY <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4 font-mono">
                      <span className="flex items-center"><Building2 className="w-4 h-4 mr-1" />{match.job.company}</span>
                      <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" />{match.job.location}</span>
                      {match.job.salary && (
                        <span className="flex items-center text-foreground font-semibold">
                          <DollarSign className="w-4 h-4 mr-1 text-primary" />
                          {(match.job.salary/1000).toFixed(0)}k {match.job.salaryMax ? `- ${(match.job.salaryMax/1000).toFixed(0)}k` : ''}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {match.matchedSkills.length > 0 && (
                      <div className="flex items-start gap-2">
                        <span className="text-xs font-mono font-bold text-emerald-600 mt-1 w-20 flex-shrink-0">MATCHED</span>
                        <div className="flex flex-wrap gap-1">
                          {match.matchedSkills.map(skill => (
                            <Badge key={skill} variant="secondary" className="bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 font-normal">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {match.missingSkills.length > 0 && (
                      <div className="flex items-start gap-2">
                        <span className="text-xs font-mono font-bold text-amber-600 mt-1 w-20 flex-shrink-0">GAP</span>
                        <div className="flex flex-wrap gap-1">
                          {match.missingSkills.map(skill => (
                            <Badge key={skill} variant="outline" className="border-amber-500/30 text-amber-700 font-normal">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground font-mono">
              NO MATCHES FOUND FOR CURRENT PARAMETERS.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
