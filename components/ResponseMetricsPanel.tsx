import Card from "@/components/ui/Card";
import StatusBadge from "@/components/ui/StatusBadge";
import type { ResponseMetrics } from "@/data/types";

type ResponseMetricsPanelProps = {
  metrics: ResponseMetrics;
};

export default function ResponseMetricsPanel({ metrics }: ResponseMetricsPanelProps) {
  return (
    <Card title="Response metrics" description="Operational response performance shown as demo analytics">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-4">
          <p className="text-sm text-slate-400">Average response time</p>
          <p className="mt-3 text-3xl font-semibold text-white">{metrics.averageResponseTime}</p>
        </div>
        <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-4">
          <p className="text-sm text-slate-400">Critical alert acknowledgement</p>
          <p className="mt-3 text-3xl font-semibold text-white">{metrics.criticalAlertAcknowledgementTime}</p>
        </div>
        <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-4">
          <p className="text-sm text-slate-400">Alerts resolved today</p>
          <p className="mt-3 text-3xl font-semibold text-white">{metrics.alertsResolvedToday}</p>
        </div>
        <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-4">
          <p className="text-sm text-slate-400">Unresolved alerts</p>
          <div className="mt-3"><StatusBadge label={metrics.unresolvedAlerts.toString()} tone="warning" /></div>
        </div>
      </div>
      <div className="mt-4 rounded-[1.25rem] border border-cyan-400/20 bg-cyan-500/10 p-4 text-sm text-cyan-100">
        Simulated demo estimate: {metrics.investigationTimeSaved} saved per investigation cycle.
      </div>
    </Card>
  );
}
