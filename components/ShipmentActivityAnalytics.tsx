import Card from "@/components/ui/Card";
import SectionHeader from "@/components/ui/SectionHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import type { ShipmentActivityBreakdown } from "@/data/types";

type ShipmentActivityAnalyticsProps = {
  breakdown: ShipmentActivityBreakdown[];
};

export default function ShipmentActivityAnalytics({ breakdown }: ShipmentActivityAnalyticsProps) {
  const total = breakdown.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card title="Shipment activity" description="Operational state of the in-transit shipment base">
      <SectionHeader title="Activity mix" description="The network remains active, with a steady near-term delivery window for a meaningful share of shipments." />
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {breakdown.map((item) => {
          const width = (item.count / total) * 100;
          return (
            <div key={item.label} className="rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-white">{item.label}</p>
                <StatusBadge label={item.label} tone={item.label === "Active" ? "active" : item.label === "Idle" ? "idle" : "warning"} />
              </div>
              <p className="mt-4 text-3xl font-semibold text-white">{item.count}</p>
              <p className="mt-1 text-sm text-slate-400">{item.percentage}% of monitored shipments</p>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
                <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400" style={{ width: `${width}%` }} />
              </div>
              <p className="mt-3 text-sm text-slate-400">{item.description}</p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
