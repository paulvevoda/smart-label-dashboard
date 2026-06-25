import Card from "@/components/ui/Card";
import StatusBadge from "@/components/ui/StatusBadge";
import type { Shipment } from "@/data/types";

type RouteProgressCardProps = {
  shipment: Shipment;
  progress: number;
};

export default function RouteProgressCard({ shipment, progress }: RouteProgressCardProps) {
  return (
    <Card title="Route progress" description="Current transit posture and outbound milestone">
      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Progress</p>
              <p className="mt-1 text-4xl font-semibold text-white">{progress}%</p>
            </div>
            <StatusBadge label={shipment.activity} tone={shipment.activity === "Active" ? "active" : shipment.activity === "Idle" ? "idle" : "warning"} />
          </div>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-800">
            <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-cyan-500 to-emerald-400" style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
            <span>{shipment.origin}</span>
            <span>{shipment.currentLocation}</span>
            <span>{shipment.destination}</span>
          </div>
        </div>
        <div className="space-y-3 rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-sm text-slate-400">Origin</span>
            <span className="text-sm text-white">{shipment.origin}</span>
          </div>
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-sm text-slate-400">Current location</span>
            <span className="text-sm text-white">{shipment.currentLocation}</span>
          </div>
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-sm text-slate-400">Destination</span>
            <span className="text-sm text-white">{shipment.destination}</span>
          </div>
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-sm text-slate-400">ETA</span>
            <span className="text-sm text-white">{shipment.eta}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Current activity</span>
            <span className="text-sm text-white">{shipment.activity}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
