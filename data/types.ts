export type LabelStatus = "Active" | "Idle" | "Offline";
export type BatteryStatus = "Healthy" | "Warning" | "Critical";
export type AssetType = "Distribution Center" | "Warehouse" | "Trailer" | "Truck" | "Container" | "Rail Car";
export type NodeType = "Distribution Center" | "Warehouse" | "Port" | "Customer Facility" | "Regional Hub";
export type RiskStatus = "Normal" | "Warning" | "Critical";
export type ShipmentStatus = "On Time" | "Delayed" | "At Risk";
export type ShipmentActivity = "Active" | "Idle" | "Expected Delivery Next 24 Hours";
export type AlertSeverity = "Normal" | "Warning" | "Critical";
export type AlertStatus = "Active" | "Resolved";
export type SensorEventType =
  | "Temperature Alert"
  | "Humidity Alert"
  | "Shock Detected"
  | "Light Exposure"
  | "Tamper Detected"
  | "Battery Warning"
  | "Label Offline"
  | "Shipment Departed"
  | "Shipment Arrived"
  | "Shipment Delivered";

export type SmartLabel = {
  id: string;
  status: LabelStatus;
  batteryStatus: BatteryStatus;
  batteryPercentage: number;
  assignedAssetId: string;
  assignedShipmentId: string;
  lastCommunication: string;
  sensorPackage: string;
  currentAlerts: string[];
};

export type LogisticsAsset = {
  id: string;
  assetType: AssetType;
  carrier: string;
  customer: string;
  location: {
    city: string;
    state: string;
    coordinates: [number, number];
  };
  destination: string;
  eta: string;
  labelsPresent: number;
  labelsActive: number;
  labelsIdle: number;
  labelsOffline: number;
  negativeAlerts24h: number;
  negativeAlertRate: number;
  riskStatus: RiskStatus;
  battery: {
    healthy: number;
    warning: number;
    critical: number;
  };
  recentEvents: string[];
  labelId: string;
};

export type LogisticsNode = {
  id: string;
  name: string;
  type: NodeType;
  city: string;
  state: string;
  coordinates: [number, number];
  labelsPresent: number;
  activeAssets: number;
  activeAlerts: number;
};

export type TransitLane = {
  id: string;
  originNode: string;
  destinationNode: string;
  corridor: string;
  assetsInTransit: number;
  riskStatus: RiskStatus;
  recentAlertActivity: string[];
};

export type Shipment = {
  id: string;
  customer: string;
  origin: string;
  destination: string;
  status: ShipmentStatus;
  activity: ShipmentActivity;
  assignedLabels: number;
  assignedAsset: string;
  eta: string;
  currentLocation: string;
  recentEvents: string[];
};

export type Alert = {
  id: string;
  timestamp: string;
  labelId: string;
  shipmentId: string;
  assetId: string;
  customer: string;
  eventType: SensorEventType;
  severity: AlertSeverity;
  status: AlertStatus;
  currentLocation: string;
  recommendedAction: string;
};

export type SensorEvent = {
  id: string;
  timestamp: string;
  labelId: string;
  shipmentId: string;
  assetId: string;
  eventType: SensorEventType;
  severity: AlertSeverity;
  status: AlertStatus;
  description: string;
};

export type CommandCenterSummary = {
  activeSmartLabels: number;
  labelsReporting: number;
  offlineLabels: number;
  totalShipments: number;
  inTransit: number;
  activeAlerts: number;
  criticalAlerts: number;
  shipmentStatus: Array<{ label: ShipmentStatus; value: number }>;
  batteryHealth: Array<{ label: BatteryStatus; value: number }>;
  shipmentActivity: Array<{ label: ShipmentActivity; value: number }>;
  recentActivityFeed: Array<{ title: string; detail: string; time: string }>;
};
