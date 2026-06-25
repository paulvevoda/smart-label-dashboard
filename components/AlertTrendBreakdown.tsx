import Card from "@/components/ui/Card";
import RiskBadge from "@/components/ui/RiskBadge";
import StatusBadge from "@/components/ui/StatusBadge";
import type { AlertTrendCategory } from "@/data/types";

type AlertTrendBreakdownProps = {
  categories: AlertTrendCategory[];
};

export default function AlertTrendBreakdown({ categories }: AlertTrendBreakdownProps) {
  return (
    <Card title="Alert trends by type" description="Signal concentration by sensor and event category">
      <div className="grid gap-4 xl:grid-cols-2">
        {categories.map((item) => (
          <div key={item.category} className="rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-semibold text-white">{item.category}</p>
                <p className="mt-1 text-sm text-slate-400">{item.activeAlerts} active alerts</p>
              </div>
              <StatusBadge label={item.highestSeverity} tone={item.highestSeverity === "Critical" ? "critical" : item.highestSeverity === "Warning" ? "warning" : "normal"} />
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
              <span>Events: {item.count}</span>
              <span>Severity mix: <RiskBadge level={item.highestSeverity as "Normal" | "Warning" | "Critical"} /></span>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
              <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-rose-400" style={{ width: `${Math.min(item.count * 12, 100)}%` }} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
