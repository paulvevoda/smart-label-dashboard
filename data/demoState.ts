import { mockData } from "./mockData";
import type { DemoPresetName, DemoState } from "./types";

const createInitialDemoState = (): DemoState => ({
  preset: "Enterprise",
  activeSmartLabels: mockData.smartLabels.length,
  labelsReporting: mockData.smartLabels.filter((label) => label.status === "Active" || label.status === "Idle").length,
  offlineLabels: mockData.smartLabels.filter((label) => label.status === "Offline").length,
  nodes: mockData.logisticsNodes.map((node) => ({ ...node })),
  lanes: mockData.transitLanes.map((lane) => ({ ...lane })),
  assets: mockData.logisticsAssets.map((asset) => ({ ...asset })),
  alerts: mockData.alerts.map((alert) => ({ ...alert })),
  sensorEvents: mockData.sensorEvents.map((event) => ({ ...event })),
  activityLog: [
    { id: "act-1", title: "Demo initialized", detail: "Enterprise network state loaded", timestamp: "just now" },
  ],
});

export const initialDemoState: DemoState = createInitialDemoState();

export const demoPresets: Record<DemoPresetName, { label: string; activeSmartLabels: number; labelsReporting: number; offlineLabels: number }> = {
  Pilot: { label: "Small Pilot", activeSmartLabels: 100, labelsReporting: 92, offlineLabels: 8 },
  Regional: { label: "Regional Rollout", activeSmartLabels: 1000, labelsReporting: 934, offlineLabels: 66 },
  Enterprise: { label: "Enterprise Network", activeSmartLabels: 10000, labelsReporting: 9280, offlineLabels: 720 },
  National: { label: "National Network", activeSmartLabels: 100000, labelsReporting: 94500, offlineLabels: 5500 },
};

export const demoNodeCatalog = [
  { name: "Los Angeles Hub", type: "Distribution Center" as const, city: "Los Angeles", state: "CA", coordinates: [34.0522, -118.2437] as [number, number] },
  { name: "Seattle Hub", type: "Distribution Center" as const, city: "Seattle", state: "WA", coordinates: [47.6062, -122.3321] as [number, number] },
  { name: "Portland Hub", type: "Warehouse" as const, city: "Portland", state: "OR", coordinates: [45.5152, -122.6784] as [number, number] },
  { name: "Sacramento Hub", type: "Regional Hub" as const, city: "Sacramento", state: "CA", coordinates: [38.5816, -121.4944] as [number, number] },
  { name: "Reno Hub", type: "Regional Hub" as const, city: "Reno", state: "NV", coordinates: [39.5296, -119.8138] as [number, number] },
  { name: "Salt Lake City Hub", type: "Distribution Center" as const, city: "Salt Lake City", state: "UT", coordinates: [40.7608, -111.891] as [number, number] },
  { name: "Dallas Hub", type: "Distribution Center" as const, city: "Dallas", state: "TX", coordinates: [32.7767, -96.797] as [number, number] },
  { name: "Chicago Hub", type: "Regional Hub" as const, city: "Chicago", state: "IL", coordinates: [41.8781, -87.6298] as [number, number] },
  { name: "Atlanta Hub", type: "Distribution Center" as const, city: "Atlanta", state: "GA", coordinates: [33.749, -84.388] as [number, number] },
  { name: "New York / New Jersey Hub", type: "Port" as const, city: "Newark", state: "NJ", coordinates: [40.7357, -74.1724] as [number, number] },
  { name: "Miami Hub", type: "Customer Facility" as const, city: "Miami", state: "FL", coordinates: [25.7617, -80.1918] as [number, number] },
];

export const demoLaneCatalog = [
  { corridor: "I-10 / Interstate cold chain corridor", origin: "Los Angeles Hub", destination: "Salt Lake City Hub" },
  { corridor: "I-5 / Pacific Northwest corridor", origin: "Seattle Hub", destination: "Sacramento Hub" },
  { corridor: "I-80 / Sierra and intermountain corridor", origin: "Sacramento Hub", destination: "Salt Lake City Hub" },
  { corridor: "I-35 / South Central corridor", origin: "Dallas Hub", destination: "Atlanta Hub" },
  { corridor: "I-80 / Great Lakes freight corridor", origin: "Chicago Hub", destination: "New York / New Jersey Hub" },
  { corridor: "I-95 / Southeast container corridor", origin: "Atlanta Hub", destination: "Miami Hub" },
];

export const demoAssetCatalog = [
  { id: "TR-142", assetType: "Trailer" as const, carrier: "Northstar Logistics", customer: "Apex Retail", location: "Reno", destination: "Salt Lake City", eta: "2h 10m" },
  { id: "TR-203", assetType: "Truck" as const, carrier: "HarborLine Freight", customer: "BluePeak Foods", location: "Dallas", destination: "Atlanta", eta: "4h 25m" },
  { id: "CT-311", assetType: "Container" as const, carrier: "Portside Global", customer: "Northwind Pharma", location: "Miami", destination: "New York / New Jersey", eta: "8h 30m" },
  { id: "RC-512", assetType: "Rail Car" as const, carrier: "Midwest Rail", customer: "Cedar Supply", location: "Chicago", destination: "Newark", eta: "6h 40m" },
];
