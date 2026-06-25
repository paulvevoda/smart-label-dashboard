import AppShell from "@/components/AppShell";
import DonutPlaceholder from "@/components/DonutPlaceholder";
import RecentActivityFeed from "@/components/RecentActivityFeed";
import Card from "@/components/ui/Card";
import KpiCard from "@/components/ui/KpiCard";
import StatusBadge from "@/components/ui/StatusBadge";
import { commandCenterSummary } from "@/data";

const kpis = [
  { label: "Labels Reporting", value: "94.2%", detail: "Across all monitored lanes", tone: "cyan" as const },
  { label: "Offline Labels", value: "18", detail: "Requires field intervention", tone: "amber" as const },
  { label: "Total Shipments", value: "2,184", detail: "Tracked in the network", tone: "emerald" as const },
  { label: "In Transit", value: "436", detail: "Moving through active corridors", tone: "cyan" as const },
  { label: "Active Alerts", value: "27", detail: "Needs operator review", tone: "rose" as const },
  { label: "Critical Alerts", value: "5", detail: "Immediate response required", tone: "rose" as const },
];

export default function Home() {
  const summary = commandCenterSummary;
  const kpiValues = [
    { label: "Labels Reporting", value: `${((summary.labelsReporting / summary.activeSmartLabels) * 100).toFixed(1)}%`, detail: "Across all monitored lanes", tone: "cyan" as const },
    { label: "Offline Labels", value: `${summary.offlineLabels}`, detail: "Requires field intervention", tone: "amber" as const },
    { label: "Total Shipments", value: `${summary.totalShipments}`, detail: "Tracked in the network", tone: "emerald" as const },
    { label: "In Transit", value: `${summary.inTransit}`, detail: "Moving through active corridors", tone: "cyan" as const },
    { label: "Active Alerts", value: `${summary.activeAlerts}`, detail: "Needs operator review", tone: "rose" as const },
    { label: "Critical Alerts", value: `${summary.criticalAlerts}`, detail: "Immediate response required", tone: "rose" as const },
  ];

  return (
    <AppShell
      title="Command Center"
      description="Executive overview of Smart Label network performance, risk, and movement."
    >
      <Card className="border-cyan-400/20 bg-slate-950/70">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-400">Global network pulse</p>
            <h3 className="mt-3 text-3xl font-semibold text-white">Active Smart Labels</h3>
            <p className="mt-3 max-w-2xl text-sm text-slate-400">
              The network is currently monitoring 18,492 intelligent labels with strong coverage across priority lanes and high-value shipments.
            </p>
          </div>
          <div className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-6 py-4 text-right">
            <p className="text-sm text-cyan-200">Network health</p>
            <p className="mt-1 text-4xl font-semibold text-white">{summary.activeSmartLabels}</p>
            <div className="mt-3 flex justify-end">
              <StatusBadge label="Active" tone="active" />
            </div>
          </div>
        </div>
      </Card>

      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {kpiValues.map((item) => (
          <KpiCard
            key={item.label}
            {...item}
            status={<StatusBadge label={item.label === "Critical Alerts" ? "Critical" : item.label === "Active Alerts" ? "Active" : item.label === "Offline Labels" ? "Offline" : "Normal"} tone={item.tone === "rose" ? "critical" : item.tone === "amber" ? "warning" : item.tone === "emerald" ? "active" : "normal"} />}
          />
        ))}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-3">
        <DonutPlaceholder title="Shipment Status" items={summary.shipmentStatus.map((entry) => ({ label: entry.label, value: entry.value, color: entry.label === "On Time" ? "#22d3ee" : entry.label === "Delayed" ? "#f59e0b" : "#fb7185" }))} />
        <DonutPlaceholder title="Battery Health" items={summary.batteryHealth.map((entry) => ({ label: entry.label, value: entry.value, color: entry.label === "Healthy" ? "#34d399" : entry.label === "Warning" ? "#f59e0b" : "#fb7185" }))} />
        <DonutPlaceholder title="Shipment Activity" items={summary.shipmentActivity.map((entry) => ({ label: entry.label, value: entry.value, color: entry.label === "Active" ? "#22d3ee" : entry.label === "Idle" ? "#64748b" : "#a78bfa" }))} />
      </section>

      <section className="mt-6">
        <RecentActivityFeed />
      </section>
    </AppShell>
  );
}
