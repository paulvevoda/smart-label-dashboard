"use client";

import { useMemo } from "react";
import AppShell from "@/components/AppShell";
import DonutPlaceholder from "@/components/DonutPlaceholder";
import RecentActivityFeed from "@/components/RecentActivityFeed";
import Card from "@/components/ui/Card";
import KpiCard from "@/components/ui/KpiCard";
import StatusBadge from "@/components/ui/StatusBadge";
import { useDemoState } from "@/context/DemoStateContext";
import { getCommandCenterSummary } from "@/data/demoStateHelpers";

export default function Home() {
  const { state } = useDemoState();
  const summary = useMemo(() => getCommandCenterSummary(state), [state]);
  const kpiValues = [
    { label: "Labels Reporting", value: `${summary.activeSmartLabels > 0 ? ((summary.labelsReporting / summary.activeSmartLabels) * 100).toFixed(1) : "0.0"}%`, detail: "Across all monitored lanes", tone: "cyan" as const },
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

      <section className="mt-6 grid auto-rows-fr gap-6 xl:grid-cols-3">
        <DonutPlaceholder
          title="Shipment Status"
          unitLabel="shipment"
          items={summary.shipmentStatus.map((entry) => ({
            label: entry.label,
            value: entry.value,
            percentage: entry.percentage,
            color: entry.label === "On Time" ? "#22d3ee" : entry.label === "Delayed" ? "#f59e0b" : "#fb7185",
          }))}
        />
        <DonutPlaceholder
          title="Battery Health"
          unitLabel="label"
          items={summary.batteryHealth.map((entry) => ({
            label: entry.label,
            value: entry.value,
            percentage: entry.percentage,
            color: entry.label === "Healthy" ? "#34d399" : entry.label === "Warning" ? "#f59e0b" : entry.label === "Critical" ? "#fb7185" : "#64748b",
          }))}
        />
        <DonutPlaceholder
          title="Shipment Activity"
          unitLabel="shipment"
          items={summary.shipmentActivity.map((entry) => ({
            label: entry.label,
            value: entry.value,
            percentage: entry.percentage,
            color: entry.label === "Active" ? "#22d3ee" : entry.label === "Idle" ? "#64748b" : "#a78bfa",
          }))}
        />
      </section>

      <section className="mt-6">
        <RecentActivityFeed />
      </section>
    </AppShell>
  );
}
