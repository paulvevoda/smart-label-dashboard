"use client";

import Card from "@/components/ui/Card";
import StatusBadge from "@/components/ui/StatusBadge";
import { useDemoState } from "@/context/DemoStateContext";
import { getThresholdDisplay } from "@/data/thresholdRules";
import type { SmartLabel } from "@/data/types";
import type { ComponentProps } from "react";

type EnvironmentalReadingsProps = {
  labels: SmartLabel[];
};

export default function EnvironmentalReadings({ labels }: EnvironmentalReadingsProps) {
  const { state } = useDemoState();
  const thresholdDisplay = getThresholdDisplay(state.sensorThresholds);

  const temperatureValue = 7.2;
  const humidityValue = 58;
  const shockValue = 2.8;
  const packageRemovedDuration = 2;
  const batteryValue = labels[0]?.batteryPercentage ?? 80;

  const getToneFromCeiling = (value: number, warning: number, exception: number): ComponentProps<typeof StatusBadge>["tone"] => {
    if (value >= exception) return "critical";
    if (value >= warning) return "warning";
    return "normal";
  };

  const getToneFromFloor = (value: number, warningFloor: number, exceptionFloor: number): ComponentProps<typeof StatusBadge>["tone"] => {
    if (value <= exceptionFloor) return "critical";
    if (value <= warningFloor) return "warning";
    return "normal";
  };

  const readingCards: Array<{
    title: string;
    current: string;
    threshold: string;
    status: string;
    tone: ComponentProps<typeof StatusBadge>["tone"];
  }> = [
    {
      title: "Temperature",
      current: `${temperatureValue.toFixed(1)}C`,
      threshold: thresholdDisplay.temperature,
      status: temperatureValue >= state.sensorThresholds.temperatureExceptionC
        ? "Exception"
        : temperatureValue >= state.sensorThresholds.temperatureWarningC
          ? "Warning"
          : "Normal",
      tone: getToneFromCeiling(temperatureValue, state.sensorThresholds.temperatureWarningC, state.sensorThresholds.temperatureExceptionC),
    },
    {
      title: "Humidity",
      current: `${humidityValue}%`,
      threshold: thresholdDisplay.humidity,
      status: humidityValue >= state.sensorThresholds.humidityExceptionPct
        ? "Exception"
        : humidityValue >= state.sensorThresholds.humidityWarningPct
          ? "Warning"
          : "Normal",
      tone: getToneFromCeiling(humidityValue, state.sensorThresholds.humidityWarningPct, state.sensorThresholds.humidityExceptionPct),
    },
    {
      title: "Shock",
      current: `${shockValue.toFixed(1)}g`,
      threshold: thresholdDisplay.shock,
      status: shockValue >= state.sensorThresholds.shockExceptionG
        ? "Exception"
        : shockValue >= state.sensorThresholds.shockWarningG
          ? "Warning"
          : "Normal",
      tone: getToneFromCeiling(shockValue, state.sensorThresholds.shockWarningG, state.sensorThresholds.shockExceptionG),
    },
    {
      title: "Package removed",
      current: `${packageRemovedDuration}h window`,
      threshold: thresholdDisplay.packageRemoved,
      status: packageRemovedDuration >= state.sensorThresholds.packageRemovedExceptionHours
        ? "Exception"
        : packageRemovedDuration >= state.sensorThresholds.packageRemovedWarningHours
          ? "Warning"
          : "Normal",
      tone: getToneFromCeiling(packageRemovedDuration, state.sensorThresholds.packageRemovedWarningHours, state.sensorThresholds.packageRemovedExceptionHours),
    },
    { title: "Tamper", current: "No tamper detected", threshold: "Seal intact", status: "Normal", tone: "normal" },
    {
      title: "Battery",
      current: `${batteryValue}%`,
      threshold: thresholdDisplay.battery,
      status: labels[0]?.batteryStatus ?? "Healthy",
      tone: getToneFromFloor(batteryValue, state.sensorThresholds.batteryWarningPct, state.sensorThresholds.batteryExceptionPct),
    },
  ];

  return (
    <Card title="Environmental readings" description="Simulated telemetry for the current shipment segment">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {readingCards.map((readout) => (
          <div key={readout.title} className="rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-4">
            <div className="flex items-center justify-between gap-3">
              <h4 className="text-base font-semibold text-white">{readout.title}</h4>
              <StatusBadge label={readout.status} tone={readout.tone} />
            </div>
            <p className="mt-4 text-2xl font-semibold text-white">{readout.current}</p>
            <p className="mt-2 text-sm text-slate-400">Threshold: {readout.threshold}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
