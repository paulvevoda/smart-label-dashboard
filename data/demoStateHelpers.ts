import { demoNodeCatalog, demoPresets } from "./demoState";
import { getRiskStatus } from "./mockDataHelpers";
import type { Alert, AlertSeverity, DemoActionLog, DemoPresetName, DemoState, LogisticsAsset, LogisticsNode, TransitLane } from "./types";

export type BreakdownItem = {
  label: string;
  value: number;
  percentage: number;
};

const clampToNonNegativeInt = (value: number) => {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.round(value));
};

export const calculatePercent = (count: number, total: number) => {
  if (total <= 0) return 0;
  return Math.round((count / total) * 100);
};

const parseEtaHours = (eta: string) => {
  const hoursMatch = eta.match(/(\d+)\s*h/i);
  const minutesMatch = eta.match(/(\d+)\s*m/i);
  const hours = hoursMatch ? Number(hoursMatch[1]) : 0;
  const minutes = minutesMatch ? Number(minutesMatch[1]) : 0;

  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null;
  return hours + (minutes / 60);
};

const hasActiveAlertForAsset = (state: DemoState, assetId: string) => (
  state.alerts.some((alert) => alert.assetId === assetId && alert.status === "Active")
);

const hasActiveCriticalAlertForAsset = (state: DemoState, assetId: string) => (
  state.alerts.some((alert) => (
    alert.assetId === assetId
    && alert.status === "Active"
    && (alert.severity === "Critical" || alert.eventType === "Label Offline")
  ))
);

const hasWarningSignalForAsset = (state: DemoState, assetId: string) => (
  state.alerts.some((alert) => (
    alert.assetId === assetId
    && alert.status === "Active"
    && (alert.severity === "Warning" || alert.eventType === "Battery Warning")
  ))
);

const isAssetOnDelayedLane = (state: DemoState, asset: DemoState["assets"][number]) => {
  const destinationText = asset.destination.toLowerCase();
  const locationText = asset.location.city.toLowerCase();

  return state.lanes.some((lane) => {
    if (lane.riskStatus === "Normal") return false;

    const destinationNode = state.nodes.find((node) => node.id === lane.destinationNode);
    const originNode = state.nodes.find((node) => node.id === lane.originNode);
    const destinationMatches = destinationNode ? destinationText.includes(destinationNode.city.toLowerCase()) : false;
    const originMatches = originNode ? locationText.includes(originNode.city.toLowerCase()) : false;

    return destinationMatches || originMatches;
  });
};

const toBreakdown = (items: Array<{ label: string; value: number }>): BreakdownItem[] => {
  const total = items.reduce((sum, item) => sum + item.value, 0);
  return items.map((item) => ({
    ...item,
    percentage: calculatePercent(item.value, total),
  }));
};

export const getShipmentStatusBreakdown = (state: DemoState): BreakdownItem[] => {
  let onTime = 0;
  let delayed = 0;
  let atRisk = 0;

  state.assets.forEach((asset) => {
    const isAtRisk = asset.riskStatus === "Critical"
      || hasActiveCriticalAlertForAsset(state, asset.id)
      || asset.labelsOffline > 0;

    const isDelayed = !isAtRisk && (
      asset.riskStatus === "Warning"
      || hasWarningSignalForAsset(state, asset.id)
      || isAssetOnDelayedLane(state, asset)
    );

    if (isAtRisk) {
      atRisk += 1;
    } else if (isDelayed) {
      delayed += 1;
    } else {
      onTime += 1;
    }
  });

  return toBreakdown([
    { label: "On Time", value: onTime },
    { label: "Delayed", value: delayed },
    { label: "At Risk", value: atRisk },
  ]);
};

export const getBatteryHealthBreakdown = (state: DemoState): BreakdownItem[] => {
  const sampleCounts = state.assets.reduce((acc, asset) => {
    acc.healthy += clampToNonNegativeInt(asset.battery.healthy);
    acc.warning += clampToNonNegativeInt(asset.battery.warning);
    acc.critical += clampToNonNegativeInt(asset.battery.critical);
    return acc;
  }, { healthy: 0, warning: 0, critical: 0 });

  const sampleTotal = sampleCounts.healthy + sampleCounts.warning + sampleCounts.critical;
  const reportingLabels = clampToNonNegativeInt(state.labelsReporting);
  const offlineLabels = clampToNonNegativeInt(state.offlineLabels);

  let healthyCount = 0;
  let warningCount = 0;
  let criticalCount = 0;

  if (sampleTotal > 0 && reportingLabels > 0) {
    healthyCount = Math.round((sampleCounts.healthy / sampleTotal) * reportingLabels);
    warningCount = Math.round((sampleCounts.warning / sampleTotal) * reportingLabels);
    criticalCount = Math.max(0, reportingLabels - healthyCount - warningCount);
  }

  return toBreakdown([
    { label: "Healthy", value: healthyCount },
    { label: "Warning", value: warningCount },
    { label: "Critical", value: criticalCount },
    { label: "Offline", value: offlineLabels },
  ]);
};

export const getShipmentActivityBreakdown = (state: DemoState): BreakdownItem[] => {
  let active = 0;
  let idle = 0;
  let expectedDelivery = 0;

  state.assets.forEach((asset) => {
    const etaHours = parseEtaHours(asset.eta);
    const hasDeliveredEvent = state.sensorEvents.some((event) => (
      event.assetId === asset.id && event.eventType === "Shipment Delivered"
    )) || asset.recentEvents.some((event) => event === "Shipment Delivered");
    const isIdle = hasDeliveredEvent
      || asset.recentEvents.some((event) => event === "Shipment Arrived")
      || asset.labelsIdle > Math.max(2, Math.floor(asset.labelsPresent * 0.2));
    const expectedSoon = !isIdle
      && etaHours !== null
      && etaHours <= 24
      && asset.riskStatus === "Normal"
      && !hasActiveAlertForAsset(state, asset.id);

    if (isIdle) {
      idle += 1;
    } else if (expectedSoon) {
      expectedDelivery += 1;
    } else {
      active += 1;
    }
  });

  return toBreakdown([
    { label: "Active", value: active },
    { label: "Idle", value: idle },
    { label: "Expected Delivery Next 24 Hours", value: expectedDelivery },
  ]);
};

export const getCommandCenterSummary = (state: DemoState) => {
  const shipmentStatus = getShipmentStatusBreakdown(state);
  const batteryHealth = getBatteryHealthBreakdown(state);
  const shipmentActivity = getShipmentActivityBreakdown(state);

  return {
    activeSmartLabels: state.activeSmartLabels,
    labelsReporting: state.labelsReporting,
    offlineLabels: state.offlineLabels,
    totalShipments: state.assets.length,
    inTransit: shipmentActivity.find((item) => item.label === "Active")?.value ?? 0,
    activeAlerts: state.alerts.filter((alert) => alert.status === "Active").length,
    criticalAlerts: state.alerts.filter((alert) => alert.status === "Active" && alert.severity === "Critical").length,
    shipmentStatus,
    batteryHealth,
    shipmentActivity,
  };
};

export const applyDemoPreset = (state: DemoState, preset: DemoPresetName): DemoState => ({
  ...state,
  preset,
  activeSmartLabels: demoPresets[preset].activeSmartLabels,
  labelsReporting: demoPresets[preset].labelsReporting,
  offlineLabels: demoPresets[preset].offlineLabels,
  activityLog: [
    { id: `act-${Date.now()}`, title: `${demoPresets[preset].label} preset applied`, detail: `Demo network scaled to ${demoPresets[preset].activeSmartLabels.toLocaleString()} labels`, timestamp: "just now" },
    ...state.activityLog,
  ].slice(0, 8),
});

export const calculateDemoRisk = (negativeAlerts: number, labelsPresent: number) => getRiskStatus(negativeAlerts, labelsPresent);

export const simulateAlert = (state: DemoState, assetId: string, eventType: Alert["eventType"], severity: AlertSeverity): DemoState => {
  const asset = state.assets.find((entry) => entry.id === assetId);
  const labelId = asset?.labelId ?? "LBL-0000";
  const offlineDelta = eventType === "Label Offline" ? 1 : 0;
  const alert: Alert = {
    id: `AL-${state.alerts.length + 1}`,
    timestamp: "now",
    labelId,
    shipmentId: "SHP-1000",
    assetId,
    customer: asset?.customer ?? "Demo customer",
    eventType,
    severity,
    status: "Active",
    currentLocation: asset?.location.city ?? "Network",
    recommendedAction: `${eventType} requires review`,
  };

  return {
    ...state,
    labelsReporting: Math.max(0, state.labelsReporting - offlineDelta),
    offlineLabels: state.offlineLabels + offlineDelta,
    assets: state.assets.map((entry) => (
      entry.id === assetId
        ? {
          ...entry,
          labelsOffline: entry.labelsOffline + offlineDelta,
          riskStatus: severity === "Critical" ? "Critical" : entry.riskStatus,
        }
        : entry
    )),
    alerts: [alert, ...state.alerts].slice(0, 12),
    sensorEvents: [
      {
        id: `EV-${state.sensorEvents.length + 1}`,
        timestamp: "now",
        labelId,
        shipmentId: "SHP-1000",
        assetId,
        eventType,
        severity,
        status: "Active" as const,
        description: `${eventType} simulated for demo purposes`,
      },
      ...state.sensorEvents,
    ].slice(0, 12),
    activityLog: [
      { id: `act-${Date.now()}`, title: `${eventType} triggered`, detail: `${asset?.id ?? assetId} moved into active review`, timestamp: "just now" },
      ...state.activityLog,
    ].slice(0, 8),
  };
};

export const simulateBatteryWarning = (state: DemoState, assetId: string): DemoState => {
  const updatedAssets = state.assets.map((asset) => (asset.id === assetId ? { ...asset, battery: { ...asset.battery, warning: asset.battery.warning + 1, critical: Math.min(asset.battery.critical, asset.battery.warning) } } : asset));
  return {
    ...state,
    assets: updatedAssets,
    activityLog: [{ id: `act-${Date.now()}`, title: "Battery warning simulated", detail: `${assetId} battery posture shifted to warning`, timestamp: "just now" }, ...state.activityLog].slice(0, 8),
  };
};

export const simulateShipmentDelay = (state: DemoState, laneId: string): DemoState => {
  const updatedLanes = state.lanes.map((lane) => (lane.id === laneId ? { ...lane, corridor: `${lane.corridor} · delay simulated`, riskStatus: "Warning" as const } : lane));
  return {
    ...state,
    lanes: updatedLanes,
    activityLog: [{ id: `act-${Date.now()}`, title: "Shipment delay simulated", detail: `Lane ${laneId} reported a delay scenario`, timestamp: "just now" }, ...state.activityLog].slice(0, 8),
  };
};

export const generateRandomDemoActivity = (state: DemoState): DemoState => {
  const randomAsset = state.assets[Math.floor(Math.random() * state.assets.length)] ?? state.assets[0];
  const randomEvent = ["Temperature Alert", "Humidity Alert", "Shock Detected", "Battery Warning", "Label Offline"][Math.floor(Math.random() * 5)] as Alert["eventType"];
  return simulateAlert(state, randomAsset.id, randomEvent, randomEvent === "Battery Warning" ? "Warning" : randomEvent === "Label Offline" ? "Critical" : "Warning");
};

export const resetDemoState = (): DemoState => ({
  preset: "Enterprise",
  activeSmartLabels: 10000,
  labelsReporting: 9280,
  offlineLabels: 720,
  nodes: demoNodeCatalog.map((node, index) => ({
    id: `NODE-${index + 1}`,
    name: node.name,
    type: node.type,
    city: node.city,
    state: node.state,
    coordinates: node.coordinates,
    labelsPresent: 1200 + index * 120,
    activeAssets: 4 + (index % 3),
    activeAlerts: index % 3 === 0 ? 1 : 0,
  })),
  lanes: [
    { id: "LANE-1", originNode: "NODE-1", destinationNode: "NODE-6", corridor: "I-10 / Interstate cold chain corridor", assetsInTransit: 3, riskStatus: "Normal" as const, recentAlertActivity: [] },
    { id: "LANE-2", originNode: "NODE-2", destinationNode: "NODE-4", corridor: "I-5 / Pacific Northwest corridor", assetsInTransit: 2, riskStatus: "Warning" as const, recentAlertActivity: ["Humidity Alert"] },
    { id: "LANE-3", originNode: "NODE-4", destinationNode: "NODE-6", corridor: "I-80 / Sierra and intermountain corridor", assetsInTransit: 4, riskStatus: "Warning" as const, recentAlertActivity: ["Temperature Alert"] },
    { id: "LANE-4", originNode: "NODE-7", destinationNode: "NODE-9", corridor: "I-35 / South Central corridor", assetsInTransit: 2, riskStatus: "Normal" as const, recentAlertActivity: [] },
    { id: "LANE-5", originNode: "NODE-8", destinationNode: "NODE-10", corridor: "I-80 / Great Lakes freight corridor", assetsInTransit: 3, riskStatus: "Warning" as const, recentAlertActivity: ["Shipment Delay"] },
    { id: "LANE-6", originNode: "NODE-9", destinationNode: "NODE-11", corridor: "I-95 / Southeast container corridor", assetsInTransit: 2, riskStatus: "Normal" as const, recentAlertActivity: [] },
  ],
  assets: [
    { id: "TR-142", assetType: "Trailer", carrier: "Northstar Logistics", customer: "Apex Retail", location: { city: "Reno", state: "NV", coordinates: [39.5296, -119.8138] }, destination: "Salt Lake City", eta: "2h 10m", labelsPresent: 52, labelsActive: 44, labelsIdle: 6, labelsOffline: 2, negativeAlerts24h: 4, negativeAlertRate: 0.0769, riskStatus: "Warning" as const, battery: { healthy: 78, warning: 16, critical: 6 }, recentEvents: ["Temperature Alert"], labelId: "LBL-2048" },
    { id: "TR-203", assetType: "Truck", carrier: "HarborLine Freight", customer: "BluePeak Foods", location: { city: "Dallas", state: "TX", coordinates: [32.7767, -96.797] }, destination: "Atlanta", eta: "4h 25m", labelsPresent: 34, labelsActive: 31, labelsIdle: 2, labelsOffline: 1, negativeAlerts24h: 2, negativeAlertRate: 0.0588, riskStatus: "Warning" as const, battery: { healthy: 82, warning: 12, critical: 6 }, recentEvents: ["Humidity Alert"], labelId: "LBL-3184" },
    { id: "CT-311", assetType: "Container", carrier: "Portside Global", customer: "Northwind Pharma", location: { city: "Miami", state: "FL", coordinates: [25.7617, -80.1918] }, destination: "New York / New Jersey", eta: "8h 30m", labelsPresent: 41, labelsActive: 38, labelsIdle: 2, labelsOffline: 1, negativeAlerts24h: 1, negativeAlertRate: 0.0244, riskStatus: "Normal" as const, battery: { healthy: 91, warning: 7, critical: 2 }, recentEvents: ["Shipment Arrived"], labelId: "LBL-4210" },
    { id: "RC-512", assetType: "Rail Car", carrier: "Midwest Rail", customer: "Cedar Supply", location: { city: "Chicago", state: "IL", coordinates: [41.8781, -87.6298] }, destination: "Newark", eta: "6h 40m", labelsPresent: 48, labelsActive: 47, labelsIdle: 1, labelsOffline: 0, negativeAlerts24h: 0, negativeAlertRate: 0, riskStatus: "Normal" as const, battery: { healthy: 93, warning: 5, critical: 2 }, recentEvents: ["Shipment Departed"], labelId: "LBL-5521" },
  ],
  alerts: [
    { id: "AL-001", timestamp: "2 min ago", labelId: "LBL-2048", shipmentId: "SHP-1001", assetId: "TR-142", customer: "Apex Retail", eventType: "Temperature Alert", severity: "Warning", status: "Active", currentLocation: "Reno", recommendedAction: "Inspect cold-chain compliance" },
  ],
  sensorEvents: [
    { id: "EV-001", timestamp: "2 min ago", labelId: "LBL-2048", shipmentId: "SHP-1001", assetId: "TR-142", eventType: "Temperature Alert", severity: "Warning", status: "Active", description: "Cold chain threshold exceeded" },
  ],
  activityLog: [{ id: "act-reset", title: "Demo reset", detail: "Default network state restored", timestamp: "just now" }],
});

export const createDemoActivityLogEntry = (title: string, detail: string): DemoActionLog => ({ id: `act-${Date.now()}`, title, detail, timestamp: "just now" });
