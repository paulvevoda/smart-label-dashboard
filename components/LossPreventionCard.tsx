import Card from "@/components/ui/Card";
import StatusBadge from "@/components/ui/StatusBadge";
import type { LossPreventionEstimate } from "@/data/types";

type LossPreventionCardProps = {
  estimate: LossPreventionEstimate;
};

export default function LossPreventionCard({ estimate }: LossPreventionCardProps) {
  return (
    <Card title="Estimated loss prevention" description="Simulated business impact from earlier intervention and exception detection">
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[1.25rem] border border-emerald-400/20 bg-emerald-500/10 p-5">
          <p className="text-sm text-emerald-200">Estimated losses prevented</p>
          <p className="mt-3 text-4xl font-semibold text-white">{estimate.estimatedLossesPrevented}</p>
          <p className="mt-3 text-sm text-emerald-100">{estimate.summary}</p>
        </div>
        <div className="space-y-3 rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Shipments protected</span>
            <span className="text-sm font-semibold text-white">{estimate.shipmentsProtected}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">High-risk events detected</span>
            <span className="text-sm font-semibold text-white">{estimate.highRiskEventsDetected}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Temperature excursions caught early</span>
            <span className="text-sm font-semibold text-white">{estimate.temperatureExcursionsCaughtEarly}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Tamper events detected</span>
            <span className="text-sm font-semibold text-white">{estimate.tamperEventsDetected}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Investigation time reduced</span>
            <span className="text-sm font-semibold text-white">{estimate.investigationTimeReduced}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
