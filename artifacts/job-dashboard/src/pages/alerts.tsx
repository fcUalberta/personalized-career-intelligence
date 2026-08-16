import { useListAlerts, useMarkAlertRead, getListAlertsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, Check, TrendingUp, AlertTriangle, Briefcase, Zap } from "lucide-react";

export default function Alerts() {
  const queryClient = useQueryClient();
  const { data: alerts, isLoading } = useListAlerts();
  const markRead = useMarkAlertRead();

  const handleMarkRead = (id: number) => {
    markRead.mutate({ data: { id } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListAlertsQueryKey() });
      }
    });
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'job_match': return <Briefcase className="h-5 w-5 text-emerald-500" />;
      case 'comp_change': return <TrendingUp className="h-5 w-5 text-primary" />;
      case 'skill_gap': return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'trajectory': return <Zap className="h-5 w-5 text-blue-500" />;
      default: return <Bell className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="smallcaps text-[12px] mb-3" style={{ color: '#E2491F' }}>Section V — Alerts & nudges</p>
          <h1 className="serif font-light leading-[0.96] tracking-[-0.02em]" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)' }}>System<br /><span className="font-semibold">Alerts.</span></h1>
          <p className="text-muted-foreground">Event log for matched data triggers.</p>
        </div>
        <Badge variant="outline" className="font-mono text-sm py-1">
          {alerts?.filter(a => !a.isRead).length || 0} UNREAD
        </Badge>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : alerts && alerts.length > 0 ? (
            <div className="divide-y divide-border">
              {alerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className={`p-5 flex gap-4 transition-colors ${alert.isRead ? 'bg-background opacity-70' : 'bg-muted/10'}`}
                >
                  <div className="mt-1">
                    {getIcon(alert.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <div className="font-mono text-xs font-bold tracking-widest text-muted-foreground flex items-center gap-2">
                        {alert.type.replace('_', ' ').toUpperCase()}
                        {alert.targetRole && <span className="bg-secondary px-1.5 py-0.5 rounded-sm">{alert.targetRole}</span>}
                        {!alert.isRead && <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>}
                      </div>
                      <span className="text-xs text-muted-foreground font-mono">{new Date(alert.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className={`text-sm md:text-base ${alert.isRead ? 'text-muted-foreground' : 'font-medium text-foreground'}`}>
                      {alert.message}
                    </p>
                  </div>
                  <div className="pl-4 flex items-center">
                    {!alert.isRead && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleMarkRead(alert.id)}
                        disabled={markRead.isPending}
                        title="Mark as read"
                        className="hover:bg-primary hover:text-primary-foreground"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center flex flex-col items-center justify-center text-muted-foreground">
              <Bell className="w-12 h-12 mb-4 opacity-20" />
              <p className="font-mono">NO SYSTEM ALERTS</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
