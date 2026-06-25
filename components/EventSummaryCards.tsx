import KpiCard from "@/components/ui/KpiCard";
import StatusBadge from "@/components/ui/StatusBadge";

type EventSummaryCardsProps = {
  totalEvents: number;
  activeAlerts: number;
  criticalEvents: number;
  resolvedToday: number;
  batteryWarnings: number;
  offlineLabels: number;
};

export default function EventSummaryCards({
  totalEvents,
  activeAlerts,
  criticalEvents,
  resolvedToday,
  batteryWarnings,
  offlineLabels,
}: EventSummaryCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <KpiCard label="Total Events" value={`${totalEvents}`} subtext="Sensor and alert entries" tone="cyan" status={<StatusBadge label="Live" tone="active" />} />
      <KpiCard label="Active Alerts" value={`${activeAlerts}`} subtext="Operator attention required" tone="amber" status={<StatusBadge label="Watch" tone="warning" />} />
      <KpiCard label="Critical Events" value={`${criticalEvents}`} subtext="Immediate escalation" tone="rose" status={<StatusBadge label="Critical" tone="critical" />} />
      <KpiCard label="Resolved Today" value={`${resolvedToday}`} subtext="Cleared in the last 24 hours" tone="emerald" status={<StatusBadge label="Resolved" tone="resolved" />} />
      <KpiCard label="Battery Warnings" value={`${batteryWarnings}`} subtext="Labels needing service" tone="amber" status={<StatusBadge label="Warning" tone="warning" />} />
      <KpiCard label="Offline Labels" value={`${offlineLabels}`} subtext="Disconnected from network" tone="rose" status={<StatusBadge label="Offline" tone="offline" />} />
    </div>
  );
}
