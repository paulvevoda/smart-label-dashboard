"use client";

import AppShell from "@/components/AppShell";
import DonutPlaceholder from "@/components/DonutPlaceholder";
import RecentActivityFeed from "@/components/RecentActivityFeed";
import Card from "@/components/ui/Card";
import KpiCard from "@/components/ui/KpiCard";
import StatusBadge from "@/components/ui/StatusBadge";
import { useDemoState } from "@/context/DemoStateContext";

export default function Home() {
  const { state } = useDemoState();
  const summary = {
    activeSmartLabels: state.activeSmartLabels,
    labelsReporting: state.labelsReporting,
    offlineLabels: state.offlineLabels,
    totalShipments: state.assets.length,
    inTransit: state.assets.length,
    activeAlerts: state.alerts.filter((alert) => alert.status === "Active").length,
    criticalAlerts: state.alerts.filter((alert) => alert.severity === "Critical").length,
    shipmentStatus: [
      { label: "On Time", value: Math.max(1, state.assets.length - 2) },
      { label: "Delayed", value: 1 },
      { label: "At Risk", value: Math.max(0, state.alerts.filter((alert) => alert.severity === "Critical").length) },
    ],
    batteryHealth: [
      { label: "Healthy", value: state.assets.filter((asset) => asset.riskStatus === "Normal").length },
      { label: "Warning", value: state.assets.filter((asset) => asset.riskStatus === "Warning").length },
      { label: "Critical", value: state.assets.filter((asset) => asset.riskStatus === "Critical").length },
    ],
    shipmentActivity: [
      { label: "Active", value: state.assets.length },
      { label: "Idle", value: 0 },
      { label: "Expected Delivery Next 24 Hours", value: Math.max(0, state.lanes.length - 2) },
    ],
  };
  const kpiValues = [
    { label: "Labels Reporting", value: `${((summary.labelsReporting / summary.activeSmartLabels) * 100).toFixed(1)}%`, detail: "Across all monitored lanes", tone: "cyan" as const },
    { label: "Offline Labels", value: `${summary.offlineLabels}`, detail: "Requires field intervention", tone: "amber" as const },
    { label: "Total Shipments", value: `${summary.totalShipments}`, detail: "Tracked in the network", tone: "emerald" as const },
    { label: "In Transit", value: `${summary.inTransit}`, detail: "Moving through active corridors", tone: "cyan" as const },
    { label: "Active Alerts", value: `${summary.activeAlerts}`, detail: "Needs operator review", tone: "rose" as const },
    { label: "Critical Alerts", value: `${summary.criticalAlerts}`, detail: "Immediate response required", tone: "rose" as const },
  ];
  const networkMessage = summary.activeAlerts === 0
    ? "The network is operating within expected tolerances and is ready for a clean investor walkthrough."
    : `The network is currently managing ${summary.activeAlerts} active exception${summary.activeAlerts === 1 ? "" : "s"} across critical lanes.`;

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
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              {summary.activeSmartLabels.toLocaleString()} intelligent labels are currently monitored across the demo network, with strong coverage over priority lanes and high-value shipments.
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">{networkMessage}</p>
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
