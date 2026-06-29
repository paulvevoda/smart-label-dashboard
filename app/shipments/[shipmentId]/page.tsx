"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import AppShell from "@/components/AppShell";
import ActiveAlertsPanel from "@/components/ActiveAlertsPanel";
import AssignedLabelsList from "@/components/AssignedLabelsList";
import EnvironmentalReadings from "@/components/EnvironmentalReadings";
import RouteProgressCard from "@/components/RouteProgressCard";
import ShipmentEventHistory from "@/components/ShipmentEventHistory";
import ShipmentSummaryCards from "@/components/ShipmentSummaryCards";
import PageHeader from "@/components/ui/PageHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import EmptyState from "@/components/ui/EmptyState";
import { useDemoState } from "@/context/DemoStateContext";
import { mockData } from "@/data";
import { getSeverityFromThresholds } from "@/data/thresholdRules";

export default function ShipmentDetailPage() {
  const params = useParams<{ shipmentId: string }>();
  const shipmentId = params?.shipmentId;
  const { state } = useDemoState();

  const shipment = useMemo(() => mockData.shipments.find((entry) => entry.id === shipmentId), [shipmentId]);

  if (!shipment) {
    return (
      <AppShell title="Shipment detail" description="Drill into current shipment operations and label telemetry.">
        <div className="space-y-6">
          <PageHeader title="Shipment not found" description="The requested shipment is not available in the current smart-label demo dataset." />
          <EmptyState title="Shipment not found." description="Try another shipment ID from the Events page or refresh the mock dataset." />
        </div>
      </AppShell>
    );
  }

  const labels = mockData.smartLabels.filter((label) => label.assignedShipmentId === shipment.id);
  const asset = state.assets.find((entry) => entry.id === shipment.assignedAsset) ?? mockData.logisticsAssets.find((entry) => entry.id === shipment.assignedAsset);
  const alerts = state.alerts
    .filter((alert) => alert.shipmentId === shipment.id)
    .map((alert) => ({
      ...alert,
      severity: getSeverityFromThresholds(alert.eventType, state.sensorThresholds),
    }));
  const events = [
    ...state.alerts
      .filter((alert) => alert.shipmentId === shipment.id)
      .map((alert) => ({ ...alert, severity: getSeverityFromThresholds(alert.eventType, state.sensorThresholds) })),
    ...state.sensorEvents
      .filter((event) => event.shipmentId === shipment.id)
      .map((event) => ({ ...event, severity: getSeverityFromThresholds(event.eventType, state.sensorThresholds) })),
  ].sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  const progress = shipment.status === "On Time" ? 72 : shipment.status === "Delayed" ? 58 : 64;

  return (
    <AppShell title="Shipment detail" description="Drill into current shipment operations and label telemetry.">
      <div className="space-y-6">
        <PageHeader
          title={shipment.id}
          description={`${shipment.origin} → ${shipment.destination}`}
          actions={<StatusBadge label={shipment.status} tone={shipment.status === "On Time" ? "on-time" : shipment.status === "Delayed" ? "delayed" : "at-risk"} />}
        />

        <div className="flex flex-wrap items-center gap-3 rounded-[1.5rem] border border-white/10 bg-slate-900/70 px-5 py-4 text-sm text-slate-300 shadow-2xl shadow-black/20 backdrop-blur">
          <span className="text-slate-400">Customer</span>
          <span className="font-medium text-white">{shipment.customer}</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400">Current location</span>
          <span className="font-medium text-white">{shipment.currentLocation}</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400">Activity</span>
          <span className="font-medium text-white">{shipment.activity}</span>
        </div>

        {asset ? (
          <ShipmentSummaryCards shipment={shipment} asset={asset} labels={labels} activeAlerts={alerts.filter((alert) => alert.status === "Active").length} />
        ) : (
          <EmptyState title="Asset details unavailable" description="The linked logistics asset for this route was not found in the mock dataset." />
        )}

        <RouteProgressCard shipment={shipment} progress={progress} />

        <AssignedLabelsList labels={labels} />

        <EnvironmentalReadings labels={labels} />

        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <ActiveAlertsPanel alerts={alerts} />
          <ShipmentEventHistory events={events} />
        </div>
      </div>
    </AppShell>
  );
}
