import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import RiskBadge from "@/components/ui/RiskBadge";
import StatusBadge from "@/components/ui/StatusBadge";
import type { Alert } from "@/data/types";

type ActiveAlertsPanelProps = {
  alerts: Alert[];
};

export default function ActiveAlertsPanel({ alerts }: ActiveAlertsPanelProps) {
  const activeAlerts = alerts.filter((alert) => alert.status === "Active");

  if (activeAlerts.length === 0) {
    return <EmptyState title="No active alerts for this shipment" description="The shipment is operating within current thresholds." />;
  }

  return (
    <Card title="Active alerts" description="Open issues requiring immediate operator review">
      <div className="space-y-3">
        {activeAlerts.map((alert) => (
          <div key={alert.id} className="rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-base font-semibold text-white">{alert.eventType}</p>
                <p className="mt-1 text-sm text-slate-400">{alert.timestamp}</p>
              </div>
              <div className="flex gap-2">
                <RiskBadge level={alert.severity as "Normal" | "Warning" | "Critical"} />
                <StatusBadge label={alert.status} tone="active" />
              </div>
            </div>
            <p className="mt-3 text-sm text-slate-300">{alert.recommendedAction}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
