import KpiCard from "@/components/ui/KpiCard";
import StatusBadge from "@/components/ui/StatusBadge";
import type { AnalyticsSummary } from "@/data/types";

type AnalyticsSummaryCardsProps = {
  summary: AnalyticsSummary;
};

export default function AnalyticsSummaryCards({ summary }: AnalyticsSummaryCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <KpiCard label="Total Shipments Monitored" value={summary.totalShipments.toString()} subtext="Across active network lanes" tone="cyan" status={<StatusBadge label="Live" tone="active" />} />
      <KpiCard label="Labels Reporting" value={summary.labelsReporting.toString()} subtext="Connected to the network" tone="emerald" />
      <KpiCard label="Exception Rate" value={summary.exceptionRate} subtext="Across monitored shipments" tone="amber" trend={<span>Down 1.4% vs prior period</span>} />
      <KpiCard label="Critical Alert Rate" value={summary.criticalAlertRate} subtext="High-priority operational signals" tone="rose" />
      <KpiCard label="Average Response Time" value={summary.averageResponseTime} subtext="Simulated demo estimate" tone="cyan" />
      <KpiCard label="Estimated Loss Prevented" value={summary.estimatedLossPrevented} subtext="Based on simulated demo events" tone="emerald" />
      <KpiCard label="At-Risk Shipments" value={summary.atRiskShipments.toString()} subtext="Require operator review" tone="rose" />
      <KpiCard label="Active Alerts" value={summary.activeAlerts.toString()} subtext="Open issues in the network" tone="amber" />
    </div>
  );
}
