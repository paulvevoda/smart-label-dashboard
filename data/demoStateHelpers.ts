import { demoNodeCatalog, demoPresets } from "./demoState";
import { getRiskStatus } from "./mockDataHelpers";
import type { Alert, AlertSeverity, DemoActionLog, DemoPresetName, DemoState, LogisticsAsset, LogisticsNode, TransitLane } from "./types";

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
