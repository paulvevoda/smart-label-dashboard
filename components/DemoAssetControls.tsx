import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import type { DemoState, LogisticsAsset } from "@/data/types";
import { demoAssetCatalog } from "@/data/demoState";

type DemoAssetControlsProps = {
  state: DemoState;
  onAddAsset: (asset: LogisticsAsset) => void;
  onSetAssetLocation: (assetId: string, location: LogisticsAsset["location"]) => void;
  onSetAssetBattery: (assetId: string, battery: LogisticsAsset["battery"]) => void;
  onSimulateAlert: (assetId: string) => void;
  onSimulateBatteryWarning: (assetId: string) => void;
};

export default function DemoAssetControls({ state, onAddAsset, onSetAssetLocation, onSetAssetBattery, onSimulateAlert, onSimulateBatteryWarning }: DemoAssetControlsProps) {
  return (
    <Card title="Asset controls" description="Reposition assets, adjust battery posture, and trigger asset-level demo events.">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {demoAssetCatalog.map((asset) => (
            <Button key={asset.id} variant="secondary" onClick={() => onAddAsset({
              id: asset.id,
              assetType: asset.assetType,
              carrier: asset.carrier,
              customer: asset.customer,
              location: { city: asset.location, state: "CA", coordinates: [39.5, -98.35] },
              destination: asset.destination,
              eta: asset.eta,
              labelsPresent: 40,
              labelsActive: 36,
              labelsIdle: 3,
              labelsOffline: 1,
              negativeAlerts24h: 1,
              negativeAlertRate: 0.025,
              riskStatus: "Normal",
              battery: { healthy: 84, warning: 12, critical: 4 },
              recentEvents: ["Shipment Departed"],
              labelId: `LBL-${Math.floor(1000 + Math.random() * 9000)}`,
            })}>{asset.id}</Button>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {state.assets.map((asset) => (
            <div key={asset.id} className="rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-4">
              <p className="text-base font-semibold text-white">{asset.id}</p>
              <p className="mt-1 text-sm text-slate-400">{asset.assetType} · {asset.carrier}</p>
              <div className="mt-4 space-y-3">
                <label className="block text-sm text-slate-300">
                  <span>Location</span>
                  <input value={asset.location.city} onChange={(event) => onSetAssetLocation(asset.id, { ...asset.location, city: event.target.value })} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/80 px-3 py-2 text-white" />
                </label>
                <label className="block text-sm text-slate-300">
                  <span>Battery mix</span>
                  <input value={asset.battery.healthy} onChange={(event) => onSetAssetBattery(asset.id, { ...asset.battery, healthy: Number(event.target.value) })} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/80 px-3 py-2 text-white" />
                </label>
                <div className="flex flex-wrap gap-2">
                  <Button variant="secondary" onClick={() => onSimulateAlert(asset.id)}>Trigger alert</Button>
                  <Button variant="secondary" onClick={() => onSimulateBatteryWarning(asset.id)}>Battery warning</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
