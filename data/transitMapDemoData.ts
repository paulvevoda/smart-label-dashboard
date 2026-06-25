export type AssetType = "Distribution Center" | "Trailer" | "Truck" | "Container" | "Rail Car";
export type RiskStatus = "Normal" | "Warning" | "Critical";

export type TransitAsset = {
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

const getRiskStatus = (negativeAlerts: number, labelsPresent: number): RiskStatus => {
  if (labelsPresent === 0) return "Normal";
  const rate = negativeAlerts / labelsPresent;

  if (rate > 0.08) return "Critical";
  if (rate > 0.02) return "Warning";
  return "Normal";
};

const baseAssets = [
  {
    id: "DC-LA-01",
    assetType: "Distribution Center" as const,
    carrier: "Northstar Logistics",
    customer: "Apex Retail",
    location: { city: "Los Angeles", state: "CA", coordinates: [34.0522, -118.2437] as [number, number] },
    destination: "Ontario Crossdock",
    eta: "1h 10m",
    labelsPresent: 148,
    labelsActive: 126,
    labelsIdle: 14,
    labelsOffline: 8,
    negativeAlerts24h: 9,
    battery: { healthy: 82, warning: 12, critical: 6 },
    recentEvents: ["Temperature Alert", "Shipment Departed", "Battery Warning"],
    labelId: "LBL-2048",
  },
  {
    id: "TR-SEA-12",
    assetType: "Trailer" as const,
    carrier: "HarborLine Freight",
    customer: "BluePeak Foods",
    location: { city: "Seattle", state: "WA", coordinates: [47.6062, -122.3321] as [number, number] },
    destination: "Boise Distribution Hub",
    eta: "3h 45m",
    labelsPresent: 94,
    labelsActive: 81,
    labelsIdle: 10,
    labelsOffline: 3,
    negativeAlerts24h: 2,
    battery: { healthy: 74, warning: 17, critical: 9 },
    recentEvents: ["Humidity Alert", "Shipment Arrived"],
    labelId: "LBL-3184",
  },
  {
    id: "TR-RNO-07",
    assetType: "Trailer" as const,
    carrier: "Silver Mesa Transport",
    customer: "Northwind Pharma",
    location: { city: "Reno", state: "NV", coordinates: [39.5296, -119.8138] as [number, number] },
    destination: "Salt Lake City",
    eta: "2h 05m",
    labelsPresent: 132,
    labelsActive: 104,
    labelsIdle: 18,
    labelsOffline: 10,
    negativeAlerts24h: 11,
    battery: { healthy: 61, warning: 24, critical: 15 },
    recentEvents: ["Shock Detected", "Tamper Detected", "Label Offline"],
    labelId: "LBL-4210",
  },
  {
    id: "TR-SLC-14",
    assetType: "Trailer" as const,
    carrier: "Summit Express",
    customer: "Vertex Medical",
    location: { city: "Salt Lake City", state: "UT", coordinates: [40.7608, -111.8910] as [number, number] },
    destination: "Denver Yard",
    eta: "4h 20m",
    labelsPresent: 111,
    labelsActive: 92,
    labelsIdle: 13,
    labelsOffline: 6,
    negativeAlerts24h: 4,
    battery: { healthy: 77, warning: 16, critical: 7 },
    recentEvents: ["Temperature Alert", "Shipment Departed"],
    labelId: "LBL-3822",
  },
  {
    id: "TR-DFW-28",
    assetType: "Truck" as const,
    carrier: "Redline Fleet",
    customer: "Crest Foods",
    location: { city: "Dallas", state: "TX", coordinates: [32.7767, -96.7970] as [number, number] },
    destination: "Atlanta Hub",
    eta: "6h 00m",
    labelsPresent: 86,
    labelsActive: 74,
    labelsIdle: 8,
    labelsOffline: 4,
    negativeAlerts24h: 3,
    battery: { healthy: 69, warning: 19, critical: 12 },
    recentEvents: ["Light Exposure", "Battery Warning"],
    labelId: "LBL-1937",
  },
  {
    id: "RC-CHI-04",
    assetType: "Rail Car" as const,
    carrier: "Midwest Rail",
    customer: "Cedar Supply",
    location: { city: "Chicago", state: "IL", coordinates: [41.8781, -87.6298] as [number, number] },
    destination: "Newark Yard",
    eta: "8h 15m",
    labelsPresent: 267,
    labelsActive: 234,
    labelsIdle: 22,
    labelsOffline: 11,
    negativeAlerts24h: 6,
    battery: { healthy: 88, warning: 10, critical: 2 },
    recentEvents: ["Shipment Arrived", "Humidity Alert"],
    labelId: "LBL-5521",
  },
  {
    id: "DC-ATL-02",
    assetType: "Distribution Center" as const,
    carrier: "Atlas Trade",
    customer: "Mosaic Health",
    location: { city: "Atlanta", state: "GA", coordinates: [33.7490, -84.3880] as [number, number] },
    destination: "Miami Port",
    eta: "5h 40m",
    labelsPresent: 201,
    labelsActive: 183,
    labelsIdle: 12,
    labelsOffline: 6,
    negativeAlerts24h: 1,
    battery: { healthy: 91, warning: 6, critical: 3 },
    recentEvents: ["Temperature Alert", "Shipment Departed"],
    labelId: "LBL-6677",
  },
  {
    id: "CT-NYC-09",
    assetType: "Container" as const,
    carrier: "Portside Global",
    customer: "Northwind Pharma",
    location: { city: "New York", state: "NJ", coordinates: [40.7128, -74.0060] as [number, number] },
    destination: "Boston Market",
    eta: "2h 30m",
    labelsPresent: 157,
    labelsActive: 128,
    labelsIdle: 21,
    labelsOffline: 8,
    negativeAlerts24h: 5,
    battery: { healthy: 73, warning: 18, critical: 9 },
    recentEvents: ["Tamper Detected", "Shock Detected"],
    labelId: "LBL-4309",
  },
  {
    id: "PT-MIA-11",
    assetType: "Container" as const,
    carrier: "Coastal Connect",
    customer: "Apex Retail",
    location: { city: "Miami", state: "FL", coordinates: [25.7617, -80.1918] as [number, number] },
    destination: "Orlando Fulfillment",
    eta: "1h 20m",
    labelsPresent: 119,
    labelsActive: 102,
    labelsIdle: 10,
    labelsOffline: 7,
    negativeAlerts24h: 8,
    battery: { healthy: 66, warning: 23, critical: 11 },
    recentEvents: ["Light Exposure", "Label Offline", "Shipment Arrived"],
    labelId: "LBL-5820",
  },
].map((asset) => {
  const negativeAlertRate = asset.labelsPresent > 0 ? asset.negativeAlerts24h / asset.labelsPresent : 0;

  return {
    ...asset,
    negativeAlertRate,
    riskStatus: getRiskStatus(asset.negativeAlerts24h, asset.labelsPresent),
  };
});

export const transitAssets = baseAssets;

export const transitLanes = [
  { from: "Los Angeles", to: "Salt Lake City", coordinates: [[34.0522, -118.2437], [40.7608, -111.8910]] as [number, number][] },
  { from: "Seattle", to: "Reno", coordinates: [[47.6062, -122.3321], [39.5296, -119.8138]] as [number, number][] },
  { from: "Reno", to: "Salt Lake City", coordinates: [[39.5296, -119.8138], [40.7608, -111.8910]] as [number, number][] },
  { from: "Dallas", to: "Atlanta", coordinates: [[32.7767, -96.7970], [33.7490, -84.3880]] as [number, number][] },
  { from: "Chicago", to: "New York", coordinates: [[41.8781, -87.6298], [40.7128, -74.0060]] as [number, number][] },
  { from: "Atlanta", to: "Miami", coordinates: [[33.7490, -84.3880], [25.7617, -80.1918]] as [number, number][] },
];

export const riskColors: Record<RiskStatus, string> = {
  Normal: "#22d3ee",
  Warning: "#f59e0b",
  Critical: "#fb7185",
};
