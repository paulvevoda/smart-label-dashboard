import Card from "@/components/ui/Card";
import StatusBadge from "@/components/ui/StatusBadge";
import type { LaneRiskSummaryItem } from "@/data/types";

type LaneRiskAnalyticsProps = {
  lanes: LaneRiskSummaryItem[];
};

export default function LaneRiskAnalytics({ lanes }: LaneRiskAnalyticsProps) {
  return (
    <Card title="Lane / corridor risk analytics" description="Transit corridor concentration of recent exceptions and risk">
      <div className="grid gap-4 xl:grid-cols-2">
        {lanes.map((lane) => (
          <div key={lane.id} className="rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-base font-semibold text-white">{lane.corridor}</p>
                <p className="mt-1 text-sm text-slate-400">{lane.origin} → {lane.destination}</p>
              </div>
              <StatusBadge label={lane.riskStatus} tone={lane.riskStatus === "Critical" ? "critical" : lane.riskStatus === "Warning" ? "warning" : "normal"} />
            </div>
            <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-400">
              <span>Assets in transit: {lane.assetsInTransit}</span>
              <span>Recent alerts: {lane.recentAlertActivity.length}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {lane.recentAlertActivity.map((activity) => (
                <span key={activity} className="rounded-full border border-white/10 bg-slate-900/70 px-3 py-1 text-xs text-slate-300">
                  {activity}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
