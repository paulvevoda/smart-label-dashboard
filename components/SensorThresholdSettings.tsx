"use client";

import Card from "@/components/ui/Card";
import SectionHeader from "@/components/ui/SectionHeader";
import type { SensorThresholds } from "@/data/types";

type SensorThresholdSettingsProps = {
  thresholds: SensorThresholds;
  onThresholdChange: (updates: Partial<SensorThresholds>) => void;
  onResetThresholds: () => void;
};

type ThresholdControl = {
  key: keyof SensorThresholds;
  label: string;
  helper: string;
  unit: string;
  step?: number;
};

const thresholdControls: ThresholdControl[] = [
  { key: "temperatureWarningC", label: "Temperature warning", helper: "Warning trigger for cold-chain drift", unit: "C", step: 0.1 },
  { key: "temperatureExceptionC", label: "Temperature exception", helper: "Exception trigger for high-temperature excursion", unit: "C", step: 0.1 },
  { key: "humidityWarningPct", label: "Humidity warning", helper: "Warning trigger for elevated humidity", unit: "%" },
  { key: "humidityExceptionPct", label: "Humidity exception", helper: "Exception trigger for severe humidity excursion", unit: "%" },
  { key: "shockWarningG", label: "Shock warning", helper: "Impact warning threshold", unit: "g", step: 0.1 },
  { key: "shockExceptionG", label: "Shock exception", helper: "Impact exception threshold", unit: "g", step: 0.1 },
  { key: "packageRemovedWarningHours", label: "Package removed warning", helper: "Open/removed duration warning", unit: "hrs" },
  { key: "packageRemovedExceptionHours", label: "Package removed exception", helper: "Open/removed duration exception", unit: "hrs" },
  { key: "routeDeviationWarningMiles", label: "Route deviation warning", helper: "Geofence variance warning", unit: "miles" },
  { key: "routeDeviationExceptionMiles", label: "Route deviation exception", helper: "Geofence variance exception", unit: "miles" },
  { key: "arrivalVarianceWarningMinutes", label: "Arrival variance warning", helper: "ETA variance warning", unit: "min" },
  { key: "arrivalVarianceExceptionMinutes", label: "Arrival variance exception", helper: "ETA variance exception", unit: "min" },
  { key: "batteryWarningPct", label: "Battery warning", helper: "Battery percent warning trigger", unit: "%" },
  { key: "batteryExceptionPct", label: "Battery exception", helper: "Battery percent exception trigger", unit: "%" },
  { key: "warningRatePct", label: "Warning rate rule", helper: "Warning percentage threshold for legend/risk logic", unit: "%" },
  { key: "exceptionRatePct", label: "Exception rate rule", helper: "Exception percentage threshold for legend/risk logic", unit: "%" },
];

export default function SensorThresholdSettings({ thresholds, onThresholdChange, onResetThresholds }: SensorThresholdSettingsProps) {
  return (
    <Card title="Sensor thresholds" description="Adjust demo alert thresholds used across shipments, map events, and sensor badges.">
      <SectionHeader title="Threshold profile" description="Values update live warning/exception posture across the workspace." />
      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        {thresholdControls.map((control) => (
          <div key={control.key} className="flex flex-col gap-3 rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-4">
            <div>
              <p className="text-base font-semibold text-white">{control.label}</p>
              <p className="mt-1 text-sm text-slate-400">{control.helper}</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                step={control.step ?? 1}
                value={thresholds[control.key]}
                onChange={(event) => {
                  const nextValue = Number(event.target.value);
                  onThresholdChange({ [control.key]: Number.isFinite(nextValue) ? Math.max(0, nextValue) : 0 });
                }}
                className="w-full rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2 text-sm text-white"
              />
              <span className="rounded-full border border-white/10 bg-slate-900 px-2 py-1 text-xs text-slate-300">{control.unit}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <button
          type="button"
          onClick={onResetThresholds}
          className="rounded-full border border-white/15 bg-slate-900 px-4 py-2 text-sm text-slate-200 transition hover:border-white/30"
        >
          Reset thresholds
        </button>
      </div>
    </Card>
  );
}
