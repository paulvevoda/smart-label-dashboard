import { mockData } from "./mockData";
import type {
  Alert,
  AlertSeverity,
  AlertTrendCategory,
  AnalyticsInsight,
  AnalyticsSummary,
  AssetRiskRankingItem,
  BatteryBreakdownItem,
  BatteryStatus,
  LabelUtilizationSummary,
  LaneRiskSummaryItem,
  LogisticsAsset,
  LossPreventionEstimate,
  ResponseMetrics,
  RiskStatus,
  SensorEvent,
  SeverityBreakdownItem,
  Shipment,
  ShipmentActivity,
  ShipmentActivityBreakdown,
  ShipmentPerformanceBreakdown,
  SmartLabel,
} from "./types";

export const getRiskStatus = (negativeAlerts: number, labelsPresent: number): RiskStatus => {
  if (labelsPresent <= 0) return "Normal";
  const rate = negativeAlerts / labelsPresent;

  if (rate > 0.08) return "Critical";
  if (rate > 0.02) return "Warning";
  return "Normal";
};

export const enrichAssetsWithRisk = (assets: LogisticsAsset[]): LogisticsAsset[] => {
  return assets.map((asset) => ({
    ...asset,
    negativeAlertRate: asset.labelsPresent > 0 ? asset.negativeAlerts24h / asset.labelsPresent : 0,
    riskStatus: getRiskStatus(asset.negativeAlerts24h, asset.labelsPresent),
  }));
};

export const getRiskColor = (riskStatus: RiskStatus) => {
  switch (riskStatus) {
    case "Critical":
      return "#fb7185";
    case "Warning":
      return "#f59e0b";
    default:
      return "#22d3ee";
  }
};

export const getShipmentById = (shipmentId: string): Shipment | undefined => {
  return mockData.shipments.find((shipment) => shipment.id === shipmentId);
};

export const getLabelsByShipmentId = (shipmentId: string): SmartLabel[] => {
  return mockData.smartLabels.filter((label) => label.assignedShipmentId === shipmentId);
};

export const getAlertsByShipmentId = (shipmentId: string): Alert[] => {
  return mockData.alerts.filter((alert) => alert.shipmentId === shipmentId);
};

export const getEventsByShipmentId = (shipmentId: string): Array<Alert | SensorEvent> => {
  return [...mockData.alerts.filter((alert) => alert.shipmentId === shipmentId), ...mockData.sensorEvents.filter((event) => event.shipmentId === shipmentId)].sort((a, b) => a.timestamp.localeCompare(b.timestamp));
};

export const getAssetById = (assetId: string): LogisticsAsset | undefined => {
  return mockData.logisticsAssets.find((asset) => asset.id === assetId);
};

export const getAnalyticsSummary = (): AnalyticsSummary => {
  const totalShipments = mockData.shipments.length;
  const labelsReporting = mockData.smartLabels.filter((label) => label.status === "Active").length;
  const activeAlerts = mockData.alerts.filter((alert) => alert.status === "Active").length;
  const criticalAlerts = mockData.alerts.filter((alert) => alert.severity === "Critical").length;
  const atRiskShipments = mockData.shipments.filter((shipment) => shipment.status === "At Risk").length;

  return {
    totalShipments,
    labelsReporting,
    exceptionRate: "6.8%",
    criticalAlertRate: "2.1%",
    averageResponseTime: "11 min",
    estimatedLossPrevented: "$184k",
    atRiskShipments,
    activeAlerts,
  };
};

export const getShipmentPerformanceBreakdown = (): ShipmentPerformanceBreakdown[] => {
  const total = mockData.shipments.length;
  const counts = mockData.shipments.reduce<Record<string, number>>((acc, shipment) => {
    acc[shipment.status] = (acc[shipment.status] ?? 0) + 1;
    return acc;
  }, {});

  return [
    { label: "On Time", count: counts["On Time"] ?? 0, percentage: Math.round(((counts["On Time"] ?? 0) / total) * 100), description: "Healthy transit posture" },
    { label: "Delayed", count: counts["Delayed"] ?? 0, percentage: Math.round(((counts["Delayed"] ?? 0) / total) * 100), description: "Needs intervention" },
    { label: "At Risk", count: counts["At Risk"] ?? 0, percentage: Math.round(((counts["At Risk"] ?? 0) / total) * 100), description: "Priority operator review" },
  ];
};

export const getShipmentActivityBreakdown = (): ShipmentActivityBreakdown[] => {
  const total = mockData.shipments.length;
  const counts = mockData.shipments.reduce<Record<string, number>>((acc, shipment) => {
    acc[shipment.activity] = (acc[shipment.activity] ?? 0) + 1;
    return acc;
  }, {});

  return [
    { label: "Active", count: counts["Active"] ?? 0, percentage: Math.round(((counts["Active"] ?? 0) / total) * 100), description: "Moving with live telemetry" },
    { label: "Idle", count: counts["Idle"] ?? 0, percentage: Math.round(((counts["Idle"] ?? 0) / total) * 100), description: "Waiting for next handoff" },
    { label: "Expected Delivery Next 24 Hours", count: counts["Expected Delivery Next 24 Hours"] ?? 0, percentage: Math.round(((counts["Expected Delivery Next 24 Hours"] ?? 0) / total) * 100), description: "Near-delivery watchlist" },
  ];
};

export const getAlertCountsByType = (): AlertTrendCategory[] => {
  const categories = [
    { category: "Temperature", count: 4, activeAlerts: 1, highestSeverity: "Warning" as AlertSeverity },
    { category: "Humidity", count: 2, activeAlerts: 1, highestSeverity: "Normal" as AlertSeverity },
    { category: "Shock", count: 2, activeAlerts: 1, highestSeverity: "Critical" as AlertSeverity },
    { category: "Light Exposure", count: 2, activeAlerts: 1, highestSeverity: "Warning" as AlertSeverity },
    { category: "Tamper", count: 1, activeAlerts: 1, highestSeverity: "Critical" as AlertSeverity },
    { category: "Battery", count: 2, activeAlerts: 1, highestSeverity: "Warning" as AlertSeverity },
    { category: "Offline", count: 1, activeAlerts: 1, highestSeverity: "Critical" as AlertSeverity },
    { category: "Shipment Movement", count: 4, activeAlerts: 0, highestSeverity: "Normal" as AlertSeverity },
  ];

  return categories;
};

export const getSeverityBreakdown = (): SeverityBreakdownItem[] => {
  const total = mockData.alerts.length + mockData.sensorEvents.length;
  const counts = {
    Normal: mockData.alerts.filter((alert) => alert.severity === "Normal").length + mockData.sensorEvents.filter((event) => event.severity === "Normal").length,
    Warning: mockData.alerts.filter((alert) => alert.severity === "Warning").length + mockData.sensorEvents.filter((event) => event.severity === "Warning").length,
    Critical: mockData.alerts.filter((alert) => alert.severity === "Critical").length + mockData.sensorEvents.filter((event) => event.severity === "Critical").length,
  };

  return [
    { label: "Normal", count: counts.Normal, percentage: Math.round((counts.Normal / total) * 100), description: "Routine but still visible" },
    { label: "Warning", count: counts.Warning, percentage: Math.round((counts.Warning / total) * 100), description: "Needs operational attention" },
    { label: "Critical", count: counts.Critical, percentage: Math.round((counts.Critical / total) * 100), description: "Immediate escalation" },
  ];
};

export const getBatteryBreakdown = (): BatteryBreakdownItem[] => {
  const total = mockData.smartLabels.length;
  const counts = mockData.smartLabels.reduce<Record<string, number>>((acc, label) => {
    acc[label.batteryStatus] = (acc[label.batteryStatus] ?? 0) + 1;
    return acc;
  }, {});

  return [
    { label: "Healthy", count: counts.Healthy ?? 0, percentage: Math.round(((counts.Healthy ?? 0) / total) * 100), description: "Stable battery posture" },
    { label: "Warning", count: counts.Warning ?? 0, percentage: Math.round(((counts.Warning ?? 0) / total) * 100), description: "Targeted maintenance window" },
    { label: "Critical", count: counts.Critical ?? 0, percentage: Math.round(((counts.Critical ?? 0) / total) * 100), description: "Immediate replacement priority" },
  ];
};

export const getLabelUtilizationSummary = (): LabelUtilizationSummary => {
  const totalLabels = mockData.smartLabels.length;
  const activeLabels = mockData.smartLabels.filter((label) => label.status === "Active").length;
  const idleLabels = mockData.smartLabels.filter((label) => label.status === "Idle").length;
  const offlineLabels = mockData.smartLabels.filter((label) => label.status === "Offline").length;
  const reportingLabels = activeLabels + idleLabels;
  const assignedToShipments = mockData.smartLabels.filter((label) => label.assignedShipmentId).length;
  const assignedToAssets = mockData.smartLabels.filter((label) => label.assignedAssetId).length;

  return {
    totalLabels,
    reportingLabels,
    offlineLabels,
    activeLabels,
    idleLabels,
    assignedToShipments,
    assignedToAssets,
    coverageLabel: "Strong coverage",
  };
};

export const getAssetRiskRanking = (): AssetRiskRankingItem[] => {
  return mockData.logisticsAssets
    .map((asset) => ({
      id: asset.id,
      name: asset.id,
      type: asset.assetType,
      location: `${asset.location.city}, ${asset.location.state}`,
      labelsPresent: asset.labelsPresent,
      negativeAlerts24h: asset.negativeAlerts24h,
      negativeAlertRate: `${(asset.negativeAlerts24h / asset.labelsPresent).toFixed(2)}%`,
      riskStatus: asset.riskStatus,
    }))
    .sort((a, b) => Number.parseFloat(b.negativeAlertRate) - Number.parseFloat(a.negativeAlertRate));
};

export const getLaneRiskSummary = (): LaneRiskSummaryItem[] => {
  return mockData.transitLanes.map((lane) => ({
    id: lane.id,
    origin: mockData.logisticsNodes.find((node) => node.id === lane.originNode)?.city ?? lane.originNode,
    destination: mockData.logisticsNodes.find((node) => node.id === lane.destinationNode)?.city ?? lane.destinationNode,
    corridor: lane.corridor,
    assetsInTransit: lane.assetsInTransit,
    riskStatus: lane.riskStatus,
    recentAlertActivity: lane.recentAlertActivity,
  }));
};

export const getResponseMetrics = (): ResponseMetrics => ({
  averageResponseTime: "11 min",
  criticalAlertAcknowledgementTime: "4 min",
  alertsResolvedToday: 3,
  unresolvedAlerts: 2,
  investigationTimeSaved: "18 min per event",
});

export const getLossPreventionEstimate = (): LossPreventionEstimate => ({
  estimatedLossesPrevented: "$184k",
  summary: "Estimated loss prevention based on simulated demo events and earlier exception detection.",
  shipmentsProtected: 7,
  highRiskEventsDetected: 5,
  temperatureExcursionsCaughtEarly: 3,
  tamperEventsDetected: 1,
  investigationTimeReduced: "18 min / event",
});

export const getAnalyticsInsights = (): AnalyticsInsight[] => [
  {
    title: "Highest current risk is concentrated in refrigerated assets moving through the I-80 corridor.",
    description: "The analytics view highlights where a small number of high-risk shipments deserve immediate operational attention.",
  },
  {
    title: "Battery replacement priority remains narrow and targeted.",
    description: "Battery warnings are concentrated in a small subset of labels, keeping maintenance effort efficient.",
  },
  {
    title: "Most alerts are warning-level rather than critical.",
    description: "That makes the system valuable as an early-warning layer rather than a reactive alarm stack.",
  },
  {
    title: "Asset-level aggregation preserves visibility without overloading the map.",
    description: "The platform keeps the investor narrative focused on where intervention materially improves outcomes.",
  },
];
