import Card from "@/components/ui/Card";
import SectionHeader from "@/components/ui/SectionHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import type { LabelUtilizationSummary } from "@/data/types";

type LabelUtilizationAnalyticsProps = {
  summary: LabelUtilizationSummary;
};

export default function LabelUtilizationAnalytics({ summary }: LabelUtilizationAnalyticsProps) {
  return (
    <Card title="Label utilization analytics" description="How Smart Labels are being deployed across the network">
      <SectionHeader title="Core utilization" description="Labels are the product surface area, and the network shows strong active coverage with focused exceptions." />
      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-4">
          <p className="text-sm text-slate-400">Total labels</p>
          <p className="mt-3 text-3xl font-semibold text-white">{summary.totalLabels}</p>
        </div>
        <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-4">
          <p className="text-sm text-slate-400">Reporting labels</p>
          <p className="mt-3 text-3xl font-semibold text-white">{summary.reportingLabels}</p>
        </div>
        <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-4">
          <p className="text-sm text-slate-400">Offline labels</p>
          <p className="mt-3 text-3xl font-semibold text-white">{summary.offlineLabels}</p>
        </div>
        <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-4">
          <p className="text-sm text-slate-400">Active labels</p>
          <p className="mt-3 text-3xl font-semibold text-white">{summary.activeLabels}</p>
        </div>
        <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-4">
          <p className="text-sm text-slate-400">Idle labels</p>
          <p className="mt-3 text-3xl font-semibold text-white">{summary.idleLabels}</p>
        </div>
        <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-4">
          <p className="text-sm text-slate-400">Assigned to shipments</p>
          <p className="mt-3 text-3xl font-semibold text-white">{summary.assignedToShipments}</p>
        </div>
        <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-4">
          <p className="text-sm text-slate-400">Assigned to assets</p>
          <p className="mt-3 text-3xl font-semibold text-white">{summary.assignedToAssets}</p>
        </div>
        <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-4">
          <p className="text-sm text-slate-400">Coverage posture</p>
          <div className="mt-3"><StatusBadge label={summary.coverageLabel} tone="active" /></div>
        </div>
      </div>
    </Card>
  );
}
