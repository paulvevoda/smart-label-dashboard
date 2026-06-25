import Card from "@/components/ui/Card";
import RiskBadge from "@/components/ui/RiskBadge";
import type { AssetRiskRankingItem } from "@/data/types";

type AssetRiskRankingProps = {
  items: AssetRiskRankingItem[];
};

export default function AssetRiskRanking({ items }: AssetRiskRankingProps) {
  return (
    <Card title="Carrier / asset risk ranking" description="Highest-priority locations for operational intervention">
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={item.id} className="flex flex-col gap-3 rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-500/10 text-sm font-semibold text-cyan-200">
                {index + 1}
              </div>
              <div>
                <p className="text-base font-semibold text-white">{item.name}</p>
                <p className="mt-1 text-sm text-slate-400">{item.type} · {item.location}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-slate-400">
              <span>Labels: {item.labelsPresent}</span>
              <span>Alerts: {item.negativeAlerts24h}</span>
              <span>Rate: {item.negativeAlertRate}</span>
              <RiskBadge level={item.riskStatus} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
