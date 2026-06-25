import Card from "@/components/ui/Card";
import RiskBadge from "@/components/ui/RiskBadge";
import StatusBadge from "@/components/ui/StatusBadge";
import type { LogisticsAsset } from "@/data/types";

type AssetDetailPanelProps = {
  asset: LogisticsAsset | null;
};

const formatRate = (value: number) => `${(value * 100).toFixed(1)}%`;

export default function AssetDetailPanel({ asset }: AssetDetailPanelProps) {
  if (!asset) {
    return (
      <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-black/20">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">Asset detail</p>
        <h3 className="mt-3 text-xl font-semibold text-white">Select a logistics asset</h3>
        <p className="mt-3 text-sm text-slate-400">
          Select a logistics asset to view Smart Label and alert details, current location, and recent events.
        </p>
      </div>
    );
  }

  return (
    <Card title="Asset insight" description={asset.id} className="p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">Asset detail</p>
          <h3 className="mt-2 text-xl font-semibold text-white">{asset.id}</h3>
        </div>
        <RiskBadge level={asset.riskStatus} />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
          <p className="text-sm text-slate-400">Asset type</p>
          <p className="mt-1 text-white">{asset.assetType}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
          <p className="text-sm text-slate-400">Carrier</p>
          <p className="mt-1 text-white">{asset.carrier}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
          <p className="text-sm text-slate-400">Current location</p>
          <p className="mt-1 text-white">{asset.location.city}, {asset.location.state}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
          <p className="text-sm text-slate-400">Destination</p>
          <p className="mt-1 text-white">{asset.destination}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
          <p className="text-sm text-slate-400">ETA</p>
          <p className="mt-1 text-white">{asset.eta}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
          <p className="text-sm text-slate-400">Negative alert rate</p>
          <p className="mt-1 text-white">{formatRate(asset.negativeAlertRate)}</p>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-sm font-semibold text-white">Label summary</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
            <p className="text-sm text-slate-400">Labels present</p>
            <p className="mt-1 text-white">{asset.labelsPresent}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
            <p className="text-sm text-slate-400">Labels active</p>
            <p className="mt-1 text-white">{asset.labelsActive}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
            <p className="text-sm text-slate-400">Labels idle</p>
            <p className="mt-1 text-white">{asset.labelsIdle}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
            <p className="text-sm text-slate-400">Labels offline</p>
            <p className="mt-1 text-white">{asset.labelsOffline}</p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-sm font-semibold text-white">Battery breakdown</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-emerald-200">
            <p className="text-sm">Healthy</p>
            <p className="mt-1 text-xl font-semibold">{asset.battery.healthy}%</p>
          </div>
          <div className="rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4 text-amber-200">
            <p className="text-sm">Warning</p>
            <p className="mt-1 text-xl font-semibold">{asset.battery.warning}%</p>
          </div>
          <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-4 text-rose-200">
            <p className="text-sm">Critical</p>
            <p className="mt-1 text-xl font-semibold">{asset.battery.critical}%</p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-sm font-semibold text-white">Recent asset events</p>
        <div className="mt-3 space-y-2">
          {asset.recentEvents.map((event) => (
            <div key={event} className="rounded-2xl border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-slate-300">
              {event}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
