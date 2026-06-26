import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import type { DemoState } from "@/data/types";

type DemoAlertControlsProps = {
  state: DemoState;
  onSimulateAlert: (assetId: string, eventType: DemoState["alerts"][number]["eventType"], severity: DemoState["alerts"][number]["severity"]) => void;
  onGenerateRandomActivity: () => void;
  onReset: () => void;
  onResolve: () => void;
};

const alertActions: Array<{ label: string; eventType: DemoState["alerts"][number]["eventType"]; severity: DemoState["alerts"][number]["severity"]; assetId: string }> = [
  { label: "Temperature Alert", eventType: "Temperature Alert", severity: "Warning", assetId: "TR-142" },
  { label: "Humidity Alert", eventType: "Humidity Alert", severity: "Normal", assetId: "TR-203" },
  { label: "Shock Event", eventType: "Shock Detected", severity: "Critical", assetId: "TR-142" },
  { label: "Light Exposure", eventType: "Light Exposure", severity: "Warning", assetId: "TR-203" },
  { label: "Tamper Event", eventType: "Tamper Detected", severity: "Critical", assetId: "TR-142" },
  { label: "Battery Warning", eventType: "Battery Warning", severity: "Warning", assetId: "TR-203" },
  { label: "Label Offline", eventType: "Label Offline", severity: "Critical", assetId: "TR-142" },
];

export default function DemoAlertControls({ state, onSimulateAlert, onGenerateRandomActivity, onReset, onResolve }: DemoAlertControlsProps) {
  return (
    <Card title="Alert simulation controls" description="Trigger pitch-ready operational situations and clear the active signal stack.">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {alertActions.map((action) => (
            <Button key={action.label} variant="secondary" onClick={() => onSimulateAlert(action.assetId, action.eventType, action.severity)}>{action.label}</Button>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="primary" onClick={onGenerateRandomActivity}>Generate random activity</Button>
          <Button variant="secondary" onClick={onResolve}>Resolve active alerts</Button>
          <Button variant="danger" onClick={onReset}>Reset demo</Button>
        </div>
      </div>
    </Card>
  );
}
