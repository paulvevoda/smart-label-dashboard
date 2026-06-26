import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import type { DemoState, LogisticsNode, NodeType } from "@/data/types";
import { demoNodeCatalog } from "@/data/demoState";

type DemoNodeControlsProps = {
  state: DemoState;
  onAddNode: (node: LogisticsNode) => void;
  onSetNodeLabels: (nodeId: string, labelsPresent: number) => void;
  onToggleNodeAlert: (nodeId: string) => void;
};

const nodeTypes: NodeType[] = ["Distribution Center", "Warehouse", "Port", "Customer Facility", "Regional Hub"];

export default function DemoNodeControls({ state, onAddNode, onSetNodeLabels, onToggleNodeAlert }: DemoNodeControlsProps) {
  return (
    <Card title="Node controls" description="Add or adjust demo nodes from a predefined U.S. city catalog.">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {demoNodeCatalog.map((node) => (
            <Button key={node.name} variant="secondary" onClick={() => onAddNode({ id: `NODE-${state.nodes.length + 1}`, name: node.name, type: node.type, city: node.city, state: node.state, coordinates: node.coordinates, labelsPresent: 1200, activeAssets: 3, activeAlerts: 0 })}>
              Add {node.name}
            </Button>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {state.nodes.map((node) => (
            <div key={node.id} className="rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-4">
              <p className="text-base font-semibold text-white">{node.name}</p>
              <p className="mt-1 text-sm text-slate-400">{node.city}, {node.state}</p>
              <div className="mt-4 space-y-3">
                <label className="block text-sm text-slate-300">
                  <span>Node type</span>
                  <select className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/80 px-3 py-2 text-white">
                    {nodeTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                  </select>
                </label>
                <label className="block text-sm text-slate-300">
                  <span>Labels present</span>
                  <input type="number" value={node.labelsPresent} onChange={(event) => onSetNodeLabels(node.id, Number(event.target.value))} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/80 px-3 py-2 text-white" />
                </label>
                <Button variant={node.activeAlerts > 0 ? "danger" : "secondary"} onClick={() => onToggleNodeAlert(node.id)}>{node.activeAlerts > 0 ? "Resolve node alert" : "Simulate alert"}</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
