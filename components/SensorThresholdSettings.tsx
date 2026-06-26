import Card from "@/components/ui/Card";
import SectionHeader from "@/components/ui/SectionHeader";
import type { SensorThresholdSetting } from "@/data/types";

type SensorThresholdSettingsProps = {
  thresholds: SensorThresholdSetting[];
};

export default function SensorThresholdSettings({ thresholds }: SensorThresholdSettingsProps) {
  return (
    <Card title="Sensor thresholds" description="Operational thresholds used to shape alert logic and escalation">
      <SectionHeader title="Threshold profile" description="Values are demo-safe and intended to reflect a production-style config surface." />
      <div className="mt-5 space-y-3">
        {thresholds.map((threshold) => (
          <div key={threshold.label} className="flex flex-col gap-3 rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-base font-semibold text-white">{threshold.label}</p>
              <p className="mt-1 text-sm text-slate-400">{threshold.description}</p>
            </div>
            <div className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-200">
              {threshold.value}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
