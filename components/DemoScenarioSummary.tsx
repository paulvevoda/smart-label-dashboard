import KpiCard from "@/components/ui/KpiCard";
import StatusBadge from "@/components/ui/StatusBadge";
import type { DemoState } from "@/data/types";

type DemoScenarioSummaryProps = {
  state: DemoState;
};

export default function DemoScenarioSummary({ state }: DemoScenarioSummaryProps) {
  const kpis = [
    { label: "Total Smart Labels", value: state.activeSmartLabels.toLocaleString(), detail: "Across the simulated network", tone: "cyan" as const },
    { label: "Labels Reporting", value: state.labelsReporting.toLocaleString(), detail: "Active or idle reporting signals", tone: "emerald" as const },
    { label: "Offline Labels", value: state.offlineLabels.toLocaleString(), detail: "Requires intervention", tone: "amber" as const },
    { label: "Distribution Centers", value: state.nodes.length.toString(), detail: "Real network nodes", tone: "cyan" as const },
    { label: "Assets in Transit", value: state.assets.length.toString(), detail: "Operationally active assets", tone: "cyan" as const },
    { label: "Active Alerts", value: state.alerts.filter((alert) => alert.status === "Active").length.toString(), detail: "Current active issues", tone: "rose" as const },
    { label: "Critical Alerts", value: state.alerts.filter((alert) => alert.severity === "Critical").length.toString(), detail: "Immediate escalation", tone: "rose" as const },
    { label: "Estimated Loss Prevented", value: "$184k", detail: "Simulated savings", tone: "emerald" as const },
  ];

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {kpis.map((item) => (
        <KpiCard
          key={item.label}
          {...item}
          status={<StatusBadge label={item.label === "Critical Alerts" ? "Critical" : item.label === "Active Alerts" ? "Active" : item.label === "Offline Labels" ? "Offline" : "Normal"} tone={item.tone === "rose" ? "critical" : item.tone === "amber" ? "warning" : item.tone === "emerald" ? "active" : "normal"} />}
        />
      ))}
    </section>
  );
}
