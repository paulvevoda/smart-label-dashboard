import KpiCard from "@/components/ui/KpiCard";
import RiskBadge from "@/components/ui/RiskBadge";
import StatusBadge from "@/components/ui/StatusBadge";
import type { Shipment, SmartLabel, LogisticsAsset } from "@/data/types";

type ShipmentSummaryCardsProps = {
  shipment: Shipment;
  asset: LogisticsAsset;
  labels: SmartLabel[];
  activeAlerts: number;
};

const shipmentTone = (status: Shipment["status"]): "cyan" | "amber" | "rose" => {
  if (status === "At Risk") return "rose";
  if (status === "Delayed") return "amber";
  return "cyan";
};

const batteryRisk = (labels: SmartLabel[]) => {
  if (labels.some((label) => label.batteryStatus === "Critical")) return "Critical";
  if (labels.some((label) => label.batteryStatus === "Warning")) return "Warning";
  return "Normal";
};

export default function ShipmentSummaryCards({ shipment, asset, labels, activeAlerts }: ShipmentSummaryCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <KpiCard
        label="Current Status"
        value={shipment.status}
        subtext={shipment.activity}
        tone={shipmentTone(shipment.status)}
        status={<StatusBadge label={shipment.status} tone={shipment.status === "On Time" ? "on-time" : shipment.status === "Delayed" ? "delayed" : "at-risk"} />}
      />
      <KpiCard label="Current Location" value={shipment.currentLocation} subtext={`${asset.location.city}, ${asset.location.state}`} tone="cyan" />
      <KpiCard label="ETA" value={shipment.eta} subtext={`Assigned to ${asset.assetType}`} tone="amber" />
      <KpiCard label="Assigned Asset" value={asset.id} subtext={asset.assetType} tone="cyan" />
      <KpiCard label="Assigned Smart Labels" value={`${labels.length}`} subtext={`${labels.filter((label) => label.status === "Active").length} active`} tone="emerald" />
      <KpiCard label="Active Alerts" value={`${activeAlerts}`} subtext={activeAlerts > 0 ? "Operator attention required" : "No open issues"} tone={activeAlerts > 0 ? "rose" : "emerald"} />
      <KpiCard label="Battery Risk" value={batteryRisk(labels)} subtext={`${labels.filter((label) => label.batteryStatus === "Healthy").length} healthy batteries`} tone={batteryRisk(labels) === "Critical" ? "rose" : batteryRisk(labels) === "Warning" ? "amber" : "emerald"} status={<RiskBadge level={batteryRisk(labels)} />} />
    </div>
  );
}
