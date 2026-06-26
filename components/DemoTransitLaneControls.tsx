import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import type { DemoState, TransitLane } from "@/data/types";
import { demoLaneCatalog } from "@/data/demoState";

type DemoTransitLaneControlsProps = {
  state: DemoState;
  onAddLane: (lane: TransitLane) => void;
  onSetLaneRisk: (laneId: string, risk: DemoState["lanes"][number]["riskStatus"]) => void;
  onSimulateDelay: (laneId: string) => void;
};

export default function DemoTransitLaneControls({ state, onAddLane, onSetLaneRisk, onSimulateDelay }: DemoTransitLaneControlsProps) {
  return (
    <Card title="Transit lane controls" description="Adjust lane risk posture and simulate corridor disruption during the pitch.">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {demoLaneCatalog.map((lane, index) => (
            <Button key={lane.corridor} variant="secondary" onClick={() => onAddLane({
              id: `LANE-${state.lanes.length + index + 1}`,
              originNode: state.nodes[0]?.id ?? "NODE-1",
              destinationNode: state.nodes[1]?.id ?? "NODE-2",
              corridor: lane.corridor,
              assetsInTransit: 2 + (index % 3),
              riskStatus: "Normal",
              recentAlertActivity: [],
            })}>{lane.corridor}</Button>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {state.lanes.map((lane) => (
            <div key={lane.id} className="rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-4">
              <p className="text-base font-semibold text-white">{lane.corridor}</p>
              <p className="mt-1 text-sm text-slate-400">{lane.originNode} → {lane.destinationNode}</p>
              <div className="mt-4 space-y-3">
                <label className="block text-sm text-slate-300">
                  <span>Risk status</span>
                  <select value={lane.riskStatus} onChange={(event) => onSetLaneRisk(lane.id, event.target.value as TransitLane["riskStatus"])} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/80 px-3 py-2 text-white">
                    <option value="Normal">Normal</option>
                    <option value="Warning">Warning</option>
                    <option value="Critical">Critical</option>
                  </select>
                </label>
                <Button variant="secondary" onClick={() => onSimulateDelay(lane.id)}>Simulate shipment delay</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
