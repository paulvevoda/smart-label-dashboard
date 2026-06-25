import Card from "@/components/ui/Card";
import StatusBadge from "@/components/ui/StatusBadge";
import type { BatteryBreakdownItem } from "@/data/types";

type BatteryUtilizationAnalyticsProps = {
  items: BatteryBreakdownItem[];
};

export default function BatteryUtilizationAnalytics({ items }: BatteryUtilizationAnalyticsProps) {
  return (
    <Card title="Battery utilization analytics" description="Battery health across the current smart-label fleet">
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((item) => (
          <div key={item.label} className="rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-4">
            <div className="flex items-center justify-between">
              <p className="text-base font-semibold text-white">{item.label}</p>
              <StatusBadge label={item.label} tone={item.label === "Healthy" ? "normal" : item.label === "Warning" ? "warning" : "critical"} />
            </div>
            <p className="mt-4 text-3xl font-semibold text-white">{item.count}</p>
            <p className="mt-1 text-sm text-slate-400">{item.percentage}% of labels</p>
            <p className="mt-3 text-sm text-slate-400">{item.description}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
