import { mockData } from "./mockData";
import type { Alert, LogisticsAsset, RiskStatus, SensorEvent, Shipment, SmartLabel } from "./types";

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
