import Card from "@/components/ui/Card";
import StatusBadge from "@/components/ui/StatusBadge";
import type { SmartLabel } from "@/data/types";
import type { ComponentProps } from "react";

type EnvironmentalReadingsProps = {
  labels: SmartLabel[];
};

export default function EnvironmentalReadings({ labels }: EnvironmentalReadingsProps) {
  const readingCards: Array<{
    title: string;
    current: string;
    threshold: string;
    status: string;
    tone: ComponentProps<typeof StatusBadge>["tone"];
  }> = [
    { title: "Temperature", current: "7.2°C", threshold: "2°C–8°C", status: "Normal", tone: "normal" },
    { title: "Humidity", current: "58%", threshold: "45%–65%", status: "Normal", tone: "normal" },
    { title: "Shock", current: "2.8g", threshold: "≤5.0g", status: "Normal", tone: "normal" },
    { title: "Light exposure", current: "Low", threshold: "<4 hrs", status: "Normal", tone: "normal" },
    { title: "Tamper", current: "No tamper detected", threshold: "Seal intact", status: "Normal", tone: "normal" },
    {
      title: "Battery",
      current: `${labels[0]?.batteryPercentage ?? 80}%`,
      threshold: "≥40%",
      status: labels[0]?.batteryStatus ?? "Healthy",
      tone: labels[0]?.batteryStatus === "Critical" ? "critical" : labels[0]?.batteryStatus === "Warning" ? "warning" : "normal",
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
