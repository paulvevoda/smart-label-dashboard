import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import type { DemoPresetName, DemoState } from "@/data/types";

type DemoNetworkControlsProps = {
  state: DemoState;
  onPreset: (preset: DemoPresetName) => void;
  onLabelCountChange: (value: number) => void;
  onReportingChange: (value: number) => void;
  onOfflineChange: (value: number) => void;
  onClearActivity: () => void;
};

const presets: Array<{ name: DemoPresetName; label: string }> = [
  { name: "Pilot", label: "Pilot" },
  { name: "Regional", label: "Regional" },
  { name: "Enterprise", label: "Enterprise" },
  { name: "National", label: "National" },
];

export default function DemoNetworkControls({ state, onPreset, onLabelCountChange, onReportingChange, onOfflineChange, onClearActivity }: DemoNetworkControlsProps) {
  return (
    <Card title="Network population controls" description="Scale the demo network and adjust the live label posture for a presentation.">
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => (
            <Button key={preset.name} variant={state.preset === preset.name ? "primary" : "secondary"} onClick={() => onPreset(preset.name)}>
              {preset.label}
            </Button>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <label className="space-y-2 text-sm text-slate-300">
            <span>Total active labels</span>
            <input type="number" value={state.activeSmartLabels} onChange={(event) => onLabelCountChange(Number(event.target.value))} className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white" />
          </label>
          <label className="space-y-2 text-sm text-slate-300">
            <span>Labels reporting</span>
            <input type="number" value={state.labelsReporting} onChange={(event) => onReportingChange(Number(event.target.value))} className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white" />
          </label>
          <label className="space-y-2 text-sm text-slate-300">
            <span>Offline labels</span>
            <input type="number" value={state.offlineLabels} onChange={(event) => onOfflineChange(Number(event.target.value))} className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white" />
          </label>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={() => onClearActivity()}>Clear activity log</Button>
        </div>
      </div>
    </Card>
  );
}
