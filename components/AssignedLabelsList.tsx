import Card from "@/components/ui/Card";
import RiskBadge from "@/components/ui/RiskBadge";
import StatusBadge from "@/components/ui/StatusBadge";
import EmptyState from "@/components/ui/EmptyState";
import type { SmartLabel } from "@/data/types";

type AssignedLabelsListProps = {
  labels: SmartLabel[];
};

export default function AssignedLabelsList({ labels }: AssignedLabelsListProps) {
  if (labels.length === 0) {
    return <EmptyState title="No smart labels assigned" description="There are no labels linked to this shipment in the current mock dataset." />;
  }

  return (
    <Card title="Assigned Smart Labels" description="Operational label inventory linked to the shipment">
      <div className="grid gap-4 xl:grid-cols-2">
        {labels.map((label) => (
          <div key={label.id} className="rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-base font-semibold text-white">{label.id}</p>
                <p className="mt-1 text-sm text-slate-400">{label.sensorPackage}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusBadge label={label.status} tone={label.status === "Active" ? "active" : label.status === "Idle" ? "idle" : "offline"} />
                <StatusBadge label={label.batteryStatus} tone={label.batteryStatus === "Healthy" ? "normal" : label.batteryStatus === "Warning" ? "warning" : "critical"} />
              </div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-sm text-slate-400">Battery</p>
                <p className="mt-1 text-sm text-white">{label.batteryPercentage}%</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Last communication</p>
                <p className="mt-1 text-sm text-white">{label.lastCommunication}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Assigned asset</p>
                <p className="mt-1 text-sm text-white">{label.assignedAssetId}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Risk</p>
                <div className="mt-1">
                  <RiskBadge level={label.batteryStatus === "Critical" ? "Critical" : label.batteryStatus === "Warning" ? "Warning" : "Normal"} />
                </div>
              </div>
            </div>
            {label.currentAlerts.length > 0 && (
              <div className="mt-4 rounded-2xl border border-amber-400/20 bg-amber-500/10 p-3">
                <p className="text-sm font-medium text-amber-200">Current alerts</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
                  {label.currentAlerts.map((alert) => (
                    <li key={alert}>{alert}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
