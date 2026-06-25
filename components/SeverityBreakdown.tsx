import Card from "@/components/ui/Card";
import RiskBadge from "@/components/ui/RiskBadge";
import StatusBadge from "@/components/ui/StatusBadge";
import type { SeverityBreakdownItem } from "@/data/types";

type SeverityBreakdownProps = {
  items: SeverityBreakdownItem[];
};

export default function SeverityBreakdown({ items }: SeverityBreakdownProps) {
  return (
    <Card title="Severity breakdown" description="Alert concentration by operational severity">
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((item) => (
          <div key={item.label} className="rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-4">
            <div className="flex items-center justify-between">
              <p className="text-base font-semibold text-white">{item.label}</p>
              <RiskBadge level={item.label as "Normal" | "Warning" | "Critical"} />
            </div>
            <p className="mt-4 text-3xl font-semibold text-white">{item.count}</p>
            <p className="mt-1 text-sm text-slate-400">{item.percentage}% of alerts</p>
            <p className="mt-3 text-sm text-slate-400">{item.description}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
