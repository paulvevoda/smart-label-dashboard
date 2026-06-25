import Card from "@/components/ui/Card";
import SectionHeader from "@/components/ui/SectionHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import type { ShipmentPerformanceBreakdown } from "@/data/types";

type ShipmentPerformanceAnalyticsProps = {
  breakdown: ShipmentPerformanceBreakdown[];
};

export default function ShipmentPerformanceAnalytics({ breakdown }: ShipmentPerformanceAnalyticsProps) {
  const total = breakdown.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card title="Shipment performance" description="Operational health across the monitored shipment portfolio">
      <SectionHeader title="Status mix" description="Most monitored shipments are operating normally, with risk concentrated in a small but important subset." />
      <div className="mt-5 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-5">
          <div className="grid gap-3">
            {breakdown.map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-slate-900/70 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">{item.label}</p>
                    <p className="mt-1 text-xs text-slate-400">{item.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-white">{item.count}</p>
                    <p className="text-sm text-slate-400">{item.percentage}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-5">
          <div className="space-y-4">
            {breakdown.map((item) => {
              const width = Math.max((item.count / total) * 100, 8);
              return (
                <div key={`${item.label}-bar`}>
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white">{item.label}</span>
                      <StatusBadge label={item.label} tone={item.label === "On Time" ? "on-time" : item.label === "Delayed" ? "delayed" : "at-risk"} />
                    </div>
                    <span className="text-sm text-slate-400">{item.count} · {item.percentage}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-cyan-500 to-emerald-400" style={{ width: `${width}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}
