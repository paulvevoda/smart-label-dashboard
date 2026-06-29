"use client";

import { useMemo, useState } from "react";
import AppShell from "@/components/AppShell";
import EventSummaryCards from "@/components/EventSummaryCards";
import EventsControls from "@/components/EventsControls";
import EventsTable from "@/components/EventsTable";
import PageHeader from "@/components/ui/PageHeader";
import { useDemoState } from "@/context/DemoStateContext";
import { getSeverityFromThresholds } from "@/data/thresholdRules";
import type { AlertSeverity, AlertStatus, SensorEventType } from "@/data/types";

type EventRow = {
  id: string;
  timestamp: string;
  labelId: string;
  shipmentId: string;
  assetId: string;
  eventType: SensorEventType;
  severity: AlertSeverity;
  status: AlertStatus;
  description: string;
  customer?: string;
  currentLocation?: string;
  recommendedAction?: string;
};

export default function EventsPage() {
  const { state } = useDemoState();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All Events");
  const [sortBy, setSortBy] = useState<"timestamp" | "severity" | "status" | "eventType" | "customer">("timestamp");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const combinedEvents = useMemo<EventRow[]>(() => {
    const alerts: EventRow[] = state.alerts.map((alert) => ({
      ...alert,
      eventType: alert.eventType,
      severity: getSeverityFromThresholds(alert.eventType, state.sensorThresholds),
      status: alert.status,
      description: alert.recommendedAction,
      customer: alert.customer,
      currentLocation: alert.currentLocation,
      recommendedAction: alert.recommendedAction,
    }));
    const sensorEvents: EventRow[] = state.sensorEvents.map((event) => ({
      ...event,
      severity: getSeverityFromThresholds(event.eventType, state.sensorThresholds),
      description: event.description,
      currentLocation: "Network monitoring",
      recommendedAction: event.description,
    }));
    return [...alerts, ...sensorEvents];
  }, [state.alerts, state.sensorEvents, state.sensorThresholds]);

  const filteredEvents = useMemo<EventRow[]>(() => {
    const normalizedSearch = search.toLowerCase();
    const result = combinedEvents.filter((event) => {
      const matchesSearch = [
        event.id,
        event.labelId,
        event.shipmentId,
        event.assetId,
        event.customer ?? "",
        event.currentLocation ?? "",
        event.eventType,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch);

      const matchesFilter = (() => {
        if (filter === "All Events") return true;
        if (filter === "Active") return event.status === "Active";
        if (filter === "Resolved") return event.status === "Resolved";
        if (filter === "Warning") return event.severity === "Warning";
        if (filter === "Critical") return event.severity === "Critical";
        if (filter === "Temperature") return event.eventType === "Temperature Alert";
        if (filter === "Humidity") return event.eventType === "Humidity Alert";
        if (filter === "Shock") return event.eventType === "Shock Detected";
        if (filter === "Package Removed") return event.eventType === "Package Removed";
        if (filter === "Tamper") return event.eventType === "Tamper Detected";
        if (filter === "Battery") return event.eventType === "Battery Warning";
        if (filter === "Offline") return event.eventType === "Label Offline";
        return true;
      })();

      return matchesSearch && matchesFilter;
    });

    return result.sort((a, b) => {
      const direction = sortDirection === "asc" ? 1 : -1;
      if (sortBy === "timestamp") {
        return direction * a.timestamp.localeCompare(b.timestamp);
      }
      if (sortBy === "severity") {
        const severityOrder = { Critical: 3, Warning: 2, Normal: 1 } as const;
        return direction * (severityOrder[a.severity] - severityOrder[b.severity]);
      }
      if (sortBy === "status") {
        const statusOrder = { Active: 2, Resolved: 1 } as const;
        return direction * (statusOrder[a.status] - statusOrder[b.status]);
      }
      if (sortBy === "eventType") {
        return direction * a.eventType.localeCompare(b.eventType);
      }
      const customerA = a.customer ?? "";
      const customerB = b.customer ?? "";
      return direction * customerA.localeCompare(customerB);
    });
  }, [combinedEvents, filter, search, sortBy, sortDirection]);

  return (
    <AppShell
      title="Events"
      description="Monitor Smart Label sensor activity, alerts, and operational exceptions across the logistics network."
    >
      <div className="space-y-6">
        <PageHeader
          title="Events"
          description="Monitor Smart Label sensor activity, alerts, and operational exceptions across the logistics network."
        />

        <EventSummaryCards
          totalEvents={combinedEvents.length}
          activeAlerts={state.alerts.filter((alert) => alert.status === "Active").length}
          criticalEvents={combinedEvents.filter((event) => event.severity === "Critical").length}
          resolvedToday={state.alerts.filter((alert) => alert.status === "Resolved").length}
          batteryWarnings={combinedEvents.filter((event) => event.eventType === "Battery Warning").length}
          offlineLabels={state.offlineLabels}
        />

        <EventsControls
          search={search}
          setSearch={setSearch}
          filter={filter}
          setFilter={setFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortDirection={sortDirection}
          setSortDirection={setSortDirection}
        />

        <EventsTable events={filteredEvents} filters={filter} />
      </div>
    </AppShell>
  );
}
