'use client';

import dynamic from "next/dynamic";
import { divIcon } from "leaflet";
import { useEffect, useMemo, useState } from "react";
import "leaflet/dist/leaflet.css";

import AssetDetailPanel from "@/components/AssetDetailPanel";
import MapRiskLegend from "@/components/MapRiskLegend";
import TransitMapControls from "@/components/TransitMapControls";
import Card from "@/components/ui/Card";
import { useDemoState } from "@/context/DemoStateContext";
import type { LogisticsAsset, LogisticsNode } from "@/data/types";

const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Polyline = dynamic(() => import("react-leaflet").then((mod) => mod.Polyline), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });

type Coordinate = [number, number];
type RouteNodeType = "Origin" | "Destination" | "Hub";
type RouteWaypoint = {
  name: string;
  coordinate: Coordinate;
  nodeType?: RouteNodeType;
};
type RouteMilestone = {
  key: string;
  coordinate: Coordinate;
  label: string;
  type: RouteNodeType;
  shipments: string[];
};
type RouteProfile = {
  laneId: string;
  waypoints: RouteWaypoint[];
};
type VehicleMode = "truck" | "rail" | "ocean" | "air";

const LOS_ANGELES_RAIL_YARD_COORDINATE: Coordinate = [34.0286, -118.227];

const SEATTLE_CHICAGO_ASSET_ID = "TR-SEA-CHI-90";
const CHICAGO_ATLANTA_ASSET_ID = "TR-CHI-ATL-65";
const SEATTLE_RENO_ASSET_ID = "TR-SEA-RNO-395";
const CHICAGO_NEWARK_ASSET_ID = "TR-CHI-EWR-80";
const NYC_NEWARK_ASSET_ID = "TR-NYC-EWR-95";
const NYC_BOSTON_ASSET_ID = "TR-NYC-BOS-95";
const LOS_ANGELES_ATLANTA_RAIL_ASSET_ID = "RC-LA-ATL-40";
const LOS_ANGELES_SHANGHAI_OCEAN_ASSET_ID = "CT-LA-SHA-88";
const ATLANTA_FRANKFURT_AIR_ASSET_ID = "CT-ATL-FRA-74";
const PORT_LA_RAIL_YARD_ASSET_ID = "TR-PLA-LAX-110";
const ATLANTA_HARTSFIELD_JACKSON_ASSET_ID = "TR-ATL-ATL-285";

const controlledRouteIdByAssetId: Record<string, string> = {
  "TR-SEA-12": "seattle-boise",
  [SEATTLE_CHICAGO_ASSET_ID]: "seattle-chicago",
  [CHICAGO_ATLANTA_ASSET_ID]: "chicago-atlanta",
  [SEATTLE_RENO_ASSET_ID]: "seattle-reno",
  [CHICAGO_NEWARK_ASSET_ID]: "chicago-newark",
  [NYC_NEWARK_ASSET_ID]: "nyc-newark",
  [NYC_BOSTON_ASSET_ID]: "nyc-boston",
  [LOS_ANGELES_ATLANTA_RAIL_ASSET_ID]: "los-angeles-atlanta-rail",
  [LOS_ANGELES_SHANGHAI_OCEAN_ASSET_ID]: "los-angeles-shanghai-ocean",
  [ATLANTA_FRANKFURT_AIR_ASSET_ID]: "atlanta-frankfurt-air",
  [PORT_LA_RAIL_YARD_ASSET_ID]: "port-la-rail-yard",
  [ATLANTA_HARTSFIELD_JACKSON_ASSET_ID]: "atlanta-hartsfield-jackson",
};

const railLaneIds = new Set(["los-angeles-atlanta-rail"]);
const oceanLaneIds = new Set(["los-angeles-shanghai-ocean"]);
const airLaneIds = new Set(["atlanta-frankfurt-air"]);

const isDisabledLocalLaneAsset = (asset: LogisticsAsset) => {
  const originText = `${asset.location.city}, ${asset.location.state}`.toLowerCase();
  const destinationText = asset.destination.toLowerCase();

  return asset.id === "DC-LA-01"
    || (originText.includes("los angeles") && destinationText.includes("ontario"));
};

const isMiamiConnectedAsset = (asset: LogisticsAsset) => {
  const originText = `${asset.location.city}, ${asset.location.state}`.toLowerCase();
  const destinationText = asset.destination.toLowerCase();

  return originText.includes("miami") || destinationText.includes("miami");
};

const isDisabledCityConnectedAsset = (asset: LogisticsAsset) => {
  const originText = `${asset.location.city}, ${asset.location.state}`.toLowerCase();
  const destinationText = asset.destination.toLowerCase();

  const blockedCityTokens = ["dallas", "salt lake city", "slc", "denver"];

  return blockedCityTokens.some((token) => originText.includes(token) || destinationText.includes(token));
};

const isDuplicateChicagoNewarkAsset = (asset: LogisticsAsset) => {
  if (asset.id === CHICAGO_NEWARK_ASSET_ID) return false;

  const originText = `${asset.location.city}, ${asset.location.state}`.toLowerCase();
  const destinationText = asset.destination.toLowerCase();

  return originText.includes("chicago") && destinationText.includes("newark");
};

const isDuplicateNycBostonAsset = (asset: LogisticsAsset) => {
  if (asset.id === NYC_BOSTON_ASSET_ID) return false;

  const originText = `${asset.location.city}, ${asset.location.state}`.toLowerCase();
  const destinationText = asset.destination.toLowerCase();

  const isNycOrigin = originText.includes("new york") || originText.includes("nyc");
  const isBostonDestination = destinationText.includes("boston");

  return isNycOrigin && isBostonDestination;
};

const seattleToChicagoDemoAsset: LogisticsAsset = {
  id: SEATTLE_CHICAGO_ASSET_ID,
  assetType: "Truck",
  carrier: "Northstar Logistics",
  customer: "Apex Retail",
  location: { city: "Seattle", state: "WA", coordinates: [47.6062, -122.3321] },
  destination: "Chicago, IL",
  eta: "18h 40m",
  labelsPresent: 76,
  labelsActive: 68,
  labelsIdle: 5,
  labelsOffline: 3,
  negativeAlerts24h: 2,
  negativeAlertRate: 0.0263,
  riskStatus: "Warning",
  battery: { healthy: 72, warning: 18, critical: 10 },
  recentEvents: ["Battery Warning", "Shipment Departed"],
  labelId: "LBL-9090",
};

const chicagoToAtlantaDemoAsset: LogisticsAsset = {
  id: CHICAGO_ATLANTA_ASSET_ID,
  assetType: "Truck",
  carrier: "HarborLine Freight",
  customer: "BluePeak Foods",
  location: { city: "Chicago", state: "IL", coordinates: [41.8781, -87.6298] },
  destination: "Atlanta, GA",
  eta: "12h 20m",
  labelsPresent: 64,
  labelsActive: 57,
  labelsIdle: 4,
  labelsOffline: 3,
  negativeAlerts24h: 3,
  negativeAlertRate: 0.0469,
  riskStatus: "Warning",
  battery: { healthy: 69, warning: 22, critical: 9 },
  recentEvents: ["Delay Hold", "Shipment Departed"],
  labelId: "LBL-9165",
};

const seattleToRenoDemoAsset: LogisticsAsset = {
  id: SEATTLE_RENO_ASSET_ID,
  assetType: "Truck",
  carrier: "Summit Express",
  customer: "Northwind Pharma",
  location: { city: "Seattle", state: "WA", coordinates: [47.6062, -122.3321] },
  destination: "Reno, NV",
  eta: "14h 05m",
  labelsPresent: 58,
  labelsActive: 52,
  labelsIdle: 4,
  labelsOffline: 2,
  negativeAlerts24h: 1,
  negativeAlertRate: 0.0172,
  riskStatus: "Normal",
  battery: { healthy: 79, warning: 15, critical: 6 },
  recentEvents: ["Shipment Departed"],
  labelId: "LBL-9395",
};

const chicagoToNewarkDemoAsset: LogisticsAsset = {
  id: CHICAGO_NEWARK_ASSET_ID,
  assetType: "Truck",
  carrier: "Midwest Rail Freight",
  customer: "Cedar Supply",
  location: { city: "Chicago", state: "IL", coordinates: [41.8781, -87.6298] },
  destination: "Newark, NJ",
  eta: "15h 10m",
  labelsPresent: 71,
  labelsActive: 61,
  labelsIdle: 6,
  labelsOffline: 4,
  negativeAlerts24h: 2,
  negativeAlertRate: 0.0282,
  riskStatus: "Warning",
  battery: { healthy: 74, warning: 18, critical: 8 },
  recentEvents: ["Battery Warning", "Shipment Departed"],
  labelId: "LBL-8080",
};

const nycToNewarkDemoAsset: LogisticsAsset = {
  id: NYC_NEWARK_ASSET_ID,
  assetType: "Truck",
  carrier: "Portside Global",
  customer: "Northwind Pharma",
  location: { city: "New York", state: "NY", coordinates: [40.7128, -74.006] },
  destination: "Newark, NJ",
  eta: "1h 35m",
  labelsPresent: 39,
  labelsActive: 34,
  labelsIdle: 3,
  labelsOffline: 2,
  negativeAlerts24h: 1,
  negativeAlertRate: 0.0256,
  riskStatus: "Warning",
  battery: { healthy: 68, warning: 24, critical: 8 },
  recentEvents: ["Route Deviation", "Shipment Departed"],
  labelId: "LBL-9595",
};

const nycToBostonDemoAsset: LogisticsAsset = {
  id: NYC_BOSTON_ASSET_ID,
  assetType: "Truck",
  carrier: "Northeast Freight",
  customer: "Vertex Medical",
  location: { city: "New York", state: "NY", coordinates: [40.7128, -74.006] },
  destination: "Boston, MA",
  eta: "4h 45m",
  labelsPresent: 44,
  labelsActive: 39,
  labelsIdle: 3,
  labelsOffline: 2,
  negativeAlerts24h: 1,
  negativeAlertRate: 0.0227,
  riskStatus: "Normal",
  battery: { healthy: 76, warning: 17, critical: 7 },
  recentEvents: ["Shipment Departed"],
  labelId: "LBL-9895",
};

const losAngelesToAtlantaRailDemoAsset: LogisticsAsset = {
  id: LOS_ANGELES_ATLANTA_RAIL_ASSET_ID,
  assetType: "Rail Car",
  carrier: "Union Corridor Rail",
  customer: "Apex Retail",
  location: { city: "Los Angeles Rail Yard", state: "CA", coordinates: LOS_ANGELES_RAIL_YARD_COORDINATE },
  destination: "Atlanta, GA",
  eta: "29h 40m",
  labelsPresent: 118,
  labelsActive: 102,
  labelsIdle: 9,
  labelsOffline: 7,
  negativeAlerts24h: 5,
  negativeAlertRate: 0.0424,
  riskStatus: "Warning",
  battery: { healthy: 67, warning: 21, critical: 12 },
  recentEvents: ["Shock Detected", "Shipment Departed"],
  labelId: "LBL-4040",
};

const losAngelesToShanghaiOceanDemoAsset: LogisticsAsset = {
  id: LOS_ANGELES_SHANGHAI_OCEAN_ASSET_ID,
  assetType: "Container",
  carrier: "Pacific Meridian Lines",
  customer: "BluePeak Foods",
  location: { city: "Los Angeles", state: "CA", coordinates: [33.7405, -118.2775] },
  destination: "Shanghai, China",
  eta: "52h 30m",
  labelsPresent: 132,
  labelsActive: 115,
  labelsIdle: 10,
  labelsOffline: 7,
  negativeAlerts24h: 4,
  negativeAlertRate: 0.0303,
  riskStatus: "Warning",
  battery: { healthy: 71, warning: 19, critical: 10 },
  recentEvents: ["Temperature Alert", "Shipment Departed"],
  labelId: "LBL-5888",
};

const atlantaToFrankfurtAirDemoAsset: LogisticsAsset = {
  id: ATLANTA_FRANKFURT_AIR_ASSET_ID,
  assetType: "Container",
  carrier: "SkyBridge Cargo",
  customer: "Apex Retail",
  location: { city: "Atlanta", state: "GA", coordinates: [33.6407, -84.4277] },
  destination: "Frankfurt, Germany",
  eta: "9h 15m",
  labelsPresent: 88,
  labelsActive: 76,
  labelsIdle: 7,
  labelsOffline: 5,
  negativeAlerts24h: 2,
  negativeAlertRate: 0.0227,
  riskStatus: "Warning",
  battery: { healthy: 73, warning: 18, critical: 9 },
  recentEvents: ["Delay Hold", "Shipment Departed"],
  labelId: "LBL-7474",
};

const portOfLaToLaRailYardDemoAsset: LogisticsAsset = {
  id: PORT_LA_RAIL_YARD_ASSET_ID,
  assetType: "Truck",
  carrier: "Pacific Drayage Co.",
  customer: "Northwind Pharma",
  location: { city: "Port of Los Angeles", state: "CA", coordinates: [33.7405, -118.2775] },
  destination: "Los Angeles Rail Yard, CA",
  eta: "1h 10m",
  labelsPresent: 36,
  labelsActive: 31,
  labelsIdle: 3,
  labelsOffline: 2,
  negativeAlerts24h: 1,
  negativeAlertRate: 0.0278,
  riskStatus: "Warning",
  battery: { healthy: 77, warning: 16, critical: 7 },
  recentEvents: ["Route Deviation", "Shipment Departed"],
  labelId: "LBL-1110",
};

const atlantaToHartsfieldJacksonDemoAsset: LogisticsAsset = {
  id: ATLANTA_HARTSFIELD_JACKSON_ASSET_ID,
  assetType: "Truck",
  carrier: "Peachtree Freight",
  customer: "BluePeak Foods",
  location: { city: "Atlanta", state: "GA", coordinates: [33.749, -84.388] },
  destination: "Hartsfield-Jackson Atlanta International Airport, GA",
  eta: "1h 05m",
  labelsPresent: 29,
  labelsActive: 25,
  labelsIdle: 2,
  labelsOffline: 2,
  negativeAlerts24h: 1,
  negativeAlertRate: 0.0345,
  riskStatus: "Warning",
  battery: { healthy: 74, warning: 18, critical: 8 },
  recentEvents: ["Delay Hold", "Shipment Departed"],
  labelId: "LBL-4285",
};

const seattleToBoiseRoute: RouteWaypoint[] = [
  { name: "Seattle, WA", coordinate: [47.6062, -122.3321], nodeType: "Origin" },
  { name: "Snoqualmie Pass, WA", coordinate: [47.3923, -121.4001] },
  { name: "Ellensburg, WA", coordinate: [46.9965, -120.5478] },
  { name: "Yakima, WA", coordinate: [46.6021, -120.5059] },
  { name: "Tri-Cities, WA", coordinate: [46.2112, -119.1372], nodeType: "Hub" },
  { name: "Pendleton, OR", coordinate: [45.6721, -118.7886], nodeType: "Hub" },
  { name: "La Grande, OR", coordinate: [45.3246, -118.0877] },
  { name: "Baker City, OR", coordinate: [44.7749, -117.8344] },
  { name: "Ontario, OR", coordinate: [44.0266, -116.9629] },
  { name: "Boise, ID", coordinate: [43.615, -116.2023], nodeType: "Destination" },
];

const seattleToChicagoRoute: RouteWaypoint[] = [
  { name: "Seattle, WA", coordinate: [47.6062, -122.3321], nodeType: "Origin" },
  { name: "Snoqualmie Pass, WA", coordinate: [47.3923, -121.4001] },
  { name: "Ellensburg, WA", coordinate: [46.9965, -120.5478] },
  { name: "Moses Lake, WA", coordinate: [47.1301, -119.2781] },
  { name: "Spokane, WA", coordinate: [47.6588, -117.426], nodeType: "Hub" },
  { name: "Coeur d'Alene, ID", coordinate: [47.6777, -116.7805] },
  { name: "Missoula, MT", coordinate: [46.8721, -113.994] },
  { name: "Butte, MT", coordinate: [46.0038, -112.5348] },
  { name: "Bozeman, MT", coordinate: [45.677, -111.0429] },
  { name: "Billings, MT", coordinate: [45.7833, -108.5007], nodeType: "Hub" },
  { name: "Sheridan, WY", coordinate: [44.7972, -106.9562] },
  { name: "Rapid City, SD", coordinate: [44.0805, -103.231] },
  { name: "Sioux Falls, SD", coordinate: [43.5446, -96.7311], nodeType: "Hub" },
  { name: "Albert Lea, MN", coordinate: [43.648, -93.3683] },
  { name: "La Crosse, WI", coordinate: [43.8138, -91.2519] },
  { name: "Madison, WI", coordinate: [43.0731, -89.4012], nodeType: "Hub" },
  { name: "Rockford, IL", coordinate: [42.2711, -89.0937] },
  { name: "Chicago, IL", coordinate: [41.8781, -87.6298], nodeType: "Destination" },
];

const chicagoToAtlantaRoute: RouteWaypoint[] = [
  { name: "Chicago, IL", coordinate: [41.8781, -87.6298], nodeType: "Origin" },
  { name: "Merrillville, IN", coordinate: [41.4828, -87.3328] },
  { name: "Lafayette, IN", coordinate: [40.4167, -86.8753] },
  { name: "Indianapolis, IN", coordinate: [39.7684, -86.1581] },
  { name: "Columbus, IN", coordinate: [39.2014, -85.9214] },
  { name: "Louisville, KY", coordinate: [38.2527, -85.7585] },
  { name: "Bowling Green, KY", coordinate: [36.9685, -86.4808] },
  { name: "Nashville, TN", coordinate: [36.1627, -86.7816], nodeType: "Hub" },
  { name: "Murfreesboro, TN", coordinate: [35.8456, -86.3903] },
  { name: "Chattanooga, TN", coordinate: [35.0456, -85.3097], nodeType: "Hub" },
  { name: "Dalton, GA", coordinate: [34.7698, -84.9702] },
  { name: "Marietta, GA", coordinate: [33.9526, -84.5499] },
  { name: "Atlanta, GA", coordinate: [33.749, -84.388], nodeType: "Destination" },
];

const seattleToRenoRoute: RouteWaypoint[] = [
  { name: "Seattle, WA", coordinate: [47.6062, -122.3321], nodeType: "Origin" },
  { name: "Tacoma, WA", coordinate: [47.2529, -122.4443] },
  { name: "Portland, OR", coordinate: [45.5152, -122.6784], nodeType: "Hub" },
  { name: "Salem, OR", coordinate: [44.9429, -123.0351] },
  { name: "Eugene, OR", coordinate: [44.0521, -123.0868] },
  { name: "Roseburg, OR", coordinate: [43.2165, -123.3417] },
  { name: "Medford, OR", coordinate: [42.3265, -122.8756], nodeType: "Hub" },
  { name: "Ashland, OR", coordinate: [42.1946, -122.7095] },
  { name: "Weed, CA", coordinate: [41.4226, -122.3861] },
  { name: "Mount Shasta, CA", coordinate: [41.3099, -122.3106] },
  { name: "Burney, CA", coordinate: [40.8824, -121.6608] },
  { name: "Susanville, CA", coordinate: [40.4163, -120.653] },
  { name: "Hallelujah Junction, CA", coordinate: [39.7774, -120.0388] },
  { name: "Reno, NV", coordinate: [39.5296, -119.8138], nodeType: "Destination" },
];

const chicagoToNewarkRoute: RouteWaypoint[] = [
  { name: "Chicago, IL", coordinate: [41.8781, -87.6298], nodeType: "Origin" },
  { name: "South Holland, IL", coordinate: [41.6009, -87.6067] },
  { name: "Gary, IN", coordinate: [41.5934, -87.3464] },
  { name: "Merrillville, IN", coordinate: [41.4828, -87.3328] },
  { name: "South Bend, IN", coordinate: [41.6764, -86.252] },
  { name: "Elkhart, IN", coordinate: [41.6819, -85.9767] },
  { name: "Toledo, OH", coordinate: [41.6528, -83.5379] },
  { name: "Elyria, OH", coordinate: [41.3684, -82.1076] },
  { name: "Cleveland South, OH", coordinate: [41.39, -81.76], nodeType: "Hub" },
  { name: "Youngstown, OH", coordinate: [41.0998, -80.6495] },
  { name: "Mercer, PA", coordinate: [41.227, -80.2392] },
  { name: "Clarion, PA", coordinate: [41.2148, -79.3853] },
  { name: "DuBois, PA", coordinate: [41.1192, -78.76] },
  { name: "Lock Haven, PA", coordinate: [41.137, -77.4469] },
  { name: "Bloomsburg, PA", coordinate: [41.0037, -76.4549] },
  { name: "Hazleton, PA", coordinate: [40.9584, -75.9746] },
  { name: "Stroudsburg, PA", coordinate: [40.9868, -75.1946] },
  { name: "Parsippany, NJ", coordinate: [40.8579, -74.425], nodeType: "Hub" },
  { name: "Newark, NJ", coordinate: [40.7357, -74.1724], nodeType: "Destination" },
];

const nycToNewarkRoute: RouteWaypoint[] = [
  { name: "New York City, NY", coordinate: [40.7128, -74.006], nodeType: "Origin" },
  { name: "Upper Manhattan, NY", coordinate: [40.8501, -73.9354] },
  { name: "George Washington Bridge, NY/NJ", coordinate: [40.8517, -73.9527], nodeType: "Hub" },
  { name: "Fort Lee, NJ", coordinate: [40.8509, -73.9701] },
  { name: "Secaucus, NJ", coordinate: [40.7895, -74.0565], nodeType: "Hub" },
  { name: "Kearny, NJ", coordinate: [40.7684, -74.1454] },
  { name: "Newark, NJ", coordinate: [40.7357, -74.1724], nodeType: "Destination" },
];

const nycToBostonRoute: RouteWaypoint[] = [
  { name: "New York City, NY", coordinate: [40.7128, -74.006], nodeType: "Origin" },
  { name: "Bronx, NY", coordinate: [40.8448, -73.8648] },
  { name: "Stamford, CT", coordinate: [41.0534, -73.5387] },
  { name: "New Haven, CT", coordinate: [41.3083, -72.9279], nodeType: "Hub" },
  { name: "New London, CT", coordinate: [41.3557, -72.0995] },
  { name: "Providence, RI", coordinate: [41.824, -71.4128], nodeType: "Hub" },
  { name: "Boston, MA", coordinate: [42.3601, -71.0589], nodeType: "Destination" },
];

const losAngelesToAtlantaRailRoute: RouteWaypoint[] = [
  { name: "Los Angeles Rail Yard, CA", coordinate: LOS_ANGELES_RAIL_YARD_COORDINATE },
  { name: "San Bernardino, CA", coordinate: [34.1083, -117.2898] },
  { name: "Barstow, CA", coordinate: [34.8958, -117.0173] },
  { name: "Needles, CA", coordinate: [34.8481, -114.6141] },
  { name: "Kingman, AZ", coordinate: [35.1894, -114.053] },
  { name: "Flagstaff, AZ", coordinate: [35.1983, -111.6513] },
  { name: "Gallup, NM", coordinate: [35.5281, -108.7426] },
  { name: "Albuquerque, NM", coordinate: [35.0844, -106.6504] },
  { name: "Clovis, NM", coordinate: [34.4048, -103.2052] },
  { name: "Amarillo, TX", coordinate: [35.222, -101.8313] },
  { name: "Oklahoma City, OK", coordinate: [35.4676, -97.5164] },
  { name: "Fort Smith, AR", coordinate: [35.3859, -94.3985] },
  { name: "Memphis, TN", coordinate: [35.1495, -90.049], nodeType: "Hub" },
  { name: "Birmingham, AL", coordinate: [33.5186, -86.8104], nodeType: "Hub" },
  { name: "Atlanta, GA", coordinate: [33.749, -84.388], nodeType: "Destination" },
];

const losAngelesToShanghaiOceanRoute: RouteWaypoint[] = [
  { name: "Port of Los Angeles, CA", coordinate: [33.7405, -118.2775], nodeType: "Origin" },
  { name: "San Pedro Bay, CA", coordinate: [33.65, -118.25] },
  { name: "Pacific Departure Lane", coordinate: [34.2, -125] },
  { name: "Eastern North Pacific", coordinate: [40, -145] },
  { name: "North Pacific Arc", coordinate: [47.5, -165] },
  { name: "Date Line Shipping Lane", coordinate: [51, -179.5], nodeType: "Hub" },
  { name: "Western North Pacific", coordinate: [50, -193] },
  { name: "Outer Kuril Offshore", coordinate: [47, -207] },
  { name: "Pacific East of Hokkaido", coordinate: [44.8, -211.5] },
  { name: "Kushiro Offshore", coordinate: [42.9, -214.5] },
  { name: "Erimo Offshore", coordinate: [41.9, -216.3] },
  { name: "Tsugaru Strait East Approach", coordinate: [41.65, -218.3] },
  { name: "Tsugaru Strait Transit", coordinate: [41.5, -219.65] },
  { name: "Tsugaru Strait West Exit", coordinate: [41.15, -221.1] },
  { name: "Sea of Japan Offshore Turn", coordinate: [40.4, -223] },
  { name: "Offshore West of Northern Honshu", coordinate: [39, -224.8] },
  { name: "Offshore West of Central Honshu", coordinate: [37.2, -226.3] },
  { name: "Offshore West of Western Honshu", coordinate: [35.5, -228.1] },
  { name: "Korea Strait Approach", coordinate: [34.3, -230] },
  { name: "Korea Strait Transit", coordinate: [33.8, -231.2] },
  { name: "West of Kyushu Offshore", coordinate: [32.5, -232.5] },
  { name: "East China Sea Approach", coordinate: [31.3, -234.8] },
  { name: "Yangshan Port, China", coordinate: [30.6267, -237.9333] },
  { name: "Shanghai, China", coordinate: [31.2304, -238.5263], nodeType: "Destination" },
];

const atlantaToFrankfurtAirRoute: RouteWaypoint[] = [
  { name: "Atlanta Hartsfield-Jackson, GA", coordinate: [33.6407, -84.4277], nodeType: "Origin" },
  { name: "Greenville-Spartanburg Area, SC", coordinate: [34.8957, -82.2189] },
  { name: "Charlotte Area, NC", coordinate: [35.2144, -80.9473] },
  { name: "Richmond Area, VA", coordinate: [37.5407, -77.436] },
  { name: "New York Oceanic Departure Area", coordinate: [40.7, -72.5] },
  { name: "Newfoundland Approach", coordinate: [47.5, -55] },
  { name: "North Atlantic Track West", coordinate: [51, -45] },
  { name: "North Atlantic Track Midpoint", coordinate: [53, -35] },
  { name: "North Atlantic Track East", coordinate: [52.5, -25] },
  { name: "Ireland Approach", coordinate: [52.5, -10] },
  { name: "Irish Sea / UK Crossing", coordinate: [52, -3] },
  { name: "Belgium / Western Europe Approach", coordinate: [50.9, 4.5] },
  { name: "Frankfurt Airport, Germany", coordinate: [50.0379, 8.5622], nodeType: "Destination" },
];

const portOfLaToLaRailYardRoute: RouteWaypoint[] = [
  { name: "Port of Los Angeles, CA", coordinate: [33.7405, -118.2775], nodeType: "Origin" },
  { name: "Terminal Island / Harbor Area, CA", coordinate: [33.7469, -118.2639] },
  { name: "I-110 Freight Corridor, CA", coordinate: [33.85, -118.28] },
  { name: "Vernon / Commerce Freight Area, CA", coordinate: [34.0039, -118.2301] },
  { name: "Los Angeles Rail Yard, CA", coordinate: LOS_ANGELES_RAIL_YARD_COORDINATE, nodeType: "Destination" },
];

const atlantaToHartsfieldJacksonRoute: RouteWaypoint[] = [
  { name: "Atlanta, GA", coordinate: [33.749, -84.388], nodeType: "Origin" },
  { name: "Downtown Connector, Atlanta, GA", coordinate: [33.735, -84.39] },
  { name: "South Atlanta Freight Corridor, GA", coordinate: [33.7, -84.395] },
  { name: "Airport Cargo Approach, GA", coordinate: [33.66, -84.41] },
  { name: "Hartsfield-Jackson Atlanta International Airport, GA", coordinate: [33.6407, -84.4277], nodeType: "Destination" },
];

const controlledRoutesByLaneId: Record<string, RouteWaypoint[]> = {
  "seattle-boise": seattleToBoiseRoute,
  "seattle-chicago": seattleToChicagoRoute,
  "chicago-atlanta": chicagoToAtlantaRoute,
  "seattle-reno": seattleToRenoRoute,
  "chicago-newark": chicagoToNewarkRoute,
  "nyc-newark": nycToNewarkRoute,
  "nyc-boston": nycToBostonRoute,
  "los-angeles-atlanta-rail": losAngelesToAtlantaRailRoute,
  "los-angeles-shanghai-ocean": losAngelesToShanghaiOceanRoute,
  "atlanta-frankfurt-air": atlantaToFrankfurtAirRoute,
  "port-la-rail-yard": portOfLaToLaRailYardRoute,
  "atlanta-hartsfield-jackson": atlantaToHartsfieldJacksonRoute,
};

const DESTINATION_COORDINATES: Record<string, Coordinate> = {
  "Ontario Crossdock": [34.0633, -117.6509],
  "Boise Distribution Hub": [43.615, -116.2023],
  "Atlanta Hub": [33.749, -84.388],
  "New York / New Jersey": [40.7357, -74.1724],
  "Newark, NJ": [40.7357, -74.1724],
  "Newark": [40.7357, -74.1724],
  "Newark Yard": [40.7357, -74.1724],
  "New York City, NY": [40.7128, -74.006],
  "Boston Market": [42.3601, -71.0589],
  "Chicago, IL": [41.8781, -87.6298],
  "Atlanta, GA": [33.749, -84.388],
  "Reno, NV": [39.5296, -119.8138],
  "Boston, MA": [42.3601, -71.0589],
  "Orlando Fulfillment": [28.5383, -81.3792],
  "Shanghai, China": [31.2304, 121.4737],
  "Frankfurt, Germany": [50.1109, 8.6821],
  "Los Angeles Rail Yard, CA": LOS_ANGELES_RAIL_YARD_COORDINATE,
  "Hartsfield-Jackson Atlanta International Airport, GA": [33.6407, -84.4277],
};

const getRouteStyle = (riskStatus: LogisticsAsset["riskStatus"], hasIssue: boolean, mode: VehicleMode) => {
  const modeDash = mode === "rail"
    ? "11 6"
    : mode === "ocean"
      ? "1 8 12 8"
      : mode === "air"
        ? "1 12"
      : "";
  const modeLineCap: "round" | "butt" = (mode === "ocean" || mode === "air") ? "round" : "butt";

  if (riskStatus === "Critical" || hasIssue) {
    return { color: "#fb7185", weight: 4, opacity: 0.95, dashArray: modeDash, lineCap: modeLineCap };
  }

  if (riskStatus === "Warning") {
    return {
      color: "#f59e0b",
      weight: 3.2,
      opacity: 0.8,
      dashArray: mode === "truck" ? "8 6" : modeDash,
      lineCap: mode === "truck" ? "butt" : modeLineCap,
    };
  }

  return { color: "#38bdf8", weight: 3, opacity: 0.75, dashArray: modeDash, lineCap: modeLineCap };
};

const getLaneStyle = (riskStatus: LogisticsAsset["riskStatus"]) => {
  if (riskStatus === "Critical") return { color: "#fb7185", weight: 2.2, opacity: 0.35, dashArray: "7 7" };
  if (riskStatus === "Warning") return { color: "#f59e0b", weight: 2, opacity: 0.32, dashArray: "7 7" };
  return { color: "#94a3b8", weight: 1.8, opacity: 0.3, dashArray: "6 8" };
};

const getRouteNodeIcon = (type: RouteNodeType) => {
  const styleByType: Record<RouteNodeType, { bg: string; border: string }> = {
    Origin: { bg: "#22d3ee", border: "rgba(34,211,238,0.35)" },
    Destination: { bg: "#34d399", border: "rgba(52,211,153,0.35)" },
    Hub: { bg: "#a78bfa", border: "rgba(167,139,250,0.35)" },
  };
  const style = styleByType[type];

  return divIcon({
    html: `<div style="display:flex;align-items:center;justify-content:center;width:14px;height:14px;border-radius:9999px;border:2px solid ${style.border};background:${style.bg};box-shadow:0 0 0 3px rgba(2,6,23,0.55);"></div>`,
    className: "border-0 bg-transparent",
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    popupAnchor: [0, -8],
  });
};

const getMarkerSymbol = (asset: LogisticsAsset) => {
  const recentEvents = asset.recentEvents.join(" ").toLowerCase();

  if (recentEvents.includes("temperature") || recentEvents.includes("humidity")) return "T";
  if (recentEvents.includes("shock") || recentEvents.includes("tamper")) return "S";
  if (recentEvents.includes("light")) return "L";
  if (recentEvents.includes("battery")) return "B";
  if (recentEvents.includes("delay") || recentEvents.includes("hold")) return "D";
  if (recentEvents.includes("deviat") || recentEvents.includes("route")) return "R";
  return "•";
};

const getTruckStatus = (asset: LogisticsAsset) => {
  if (asset.recentEvents.some((event) => event.toLowerCase().includes("delivered"))) return "Delivered";
  if (asset.riskStatus === "Critical") return "Exception";
  if (asset.riskStatus === "Warning") return "Warning";
  return "On Track";
};

const getActiveAlertSummary = (asset: LogisticsAsset) => {
  const critical = asset.recentEvents.find((event) => /tamper|offline|shock/i.test(event));
  const warning = asset.recentEvents.find((event) => /temperature|humidity|light|battery|delay|hold|route/i.test(event));
  return critical ?? warning ?? "No active exception";
};

const getBatteryPosture = (asset: LogisticsAsset) => {
  if (asset.battery.critical >= asset.battery.warning && asset.battery.critical >= asset.battery.healthy) return "Critical";
  if (asset.battery.warning >= asset.battery.healthy) return "Warning";
  return "Healthy";
};

const getVehicleIcon = (asset: LogisticsAsset, isSelected: boolean, mode: VehicleMode) => {
  const color = getTruckStatus(asset) === "Exception"
    ? "#fb7185"
    : getTruckStatus(asset) === "Warning"
      ? "#f59e0b"
      : getTruckStatus(asset) === "Delivered"
        ? "#34d399"
        : "#22d3ee";

  const symbol = getMarkerSymbol(asset);
  const hasExceptionBadge = symbol !== "•";
  const badgeColor = asset.riskStatus === "Critical"
    ? "#fb7185"
    : asset.riskStatus === "Warning"
      ? "#f59e0b"
      : "#64748b";

  const glyph = mode === "rail"
    ? `<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" focusable="false" style="display:block;fill:#020617;">
        <path d="M5 4h14c1.1 0 2 .9 2 2v7c0 1.3-.8 2.5-2 3l1.5 2v1h-2.4l-1.6-2h-9.1l-1.6 2H3.4v-1L5 16c-1.2-.5-2-1.7-2-3V6c0-1.1.9-2 2-2zm0 4v3h14V8H5zm3 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm8 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/>
      </svg>`
    : mode === "ocean"
      ? `<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" focusable="false" style="display:block;fill:#020617;">
        <path d="M3 15.8h18c0 2.6-2.2 4.2-4.4 4.2-1.2 0-2.2-.4-3.1-1.2-.9.8-2 1.2-3.2 1.2-1.2 0-2.3-.4-3.2-1.2-.9.8-1.9 1.2-3.1 1.2C5.2 20 3 18.4 3 15.8zm3.1-1.6L7.8 8h8.4l1.7 6.2H6.1zM10 5h4.4c.7 0 1.3.6 1.3 1.3V7H8.7V6.3C8.7 5.6 9.3 5 10 5z"/>
      </svg>`
      : mode === "air"
        ? `<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" focusable="false" style="display:block;fill:#020617;">
          <path d="M11.3 2.4h1.4c.6 0 1 .4 1.1.9l.5 2.1h1.2c.7 0 1.3.6 1.3 1.3v1.2h4.8c.6 0 1 .4 1 1v1.5c0 .6-.4 1-1 1h-4.3l-2.4 2.6h-1.9v1.2h3.5c.6 0 1 .4 1 1v1.1c0 .6-.4 1-1 1h-3.6l-.4 2.2c-.1.5-.5.9-1.1.9h-1c-.5 0-1-.4-1.1-.9l-.4-2.2H7.2c-.6 0-1-.4-1-1v-1.1c0-.6.4-1 1-1h3.5V14h-1.9l-2.4-2.6H2.1c-.6 0-1-.4-1-1V8.9c0-.6.4-1 1-1h4.8V6.7c0-.7.6-1.3 1.3-1.3h1.2l.5-2.1c.1-.5.5-.9 1.1-.9zm-.8 5v1.2h3V7.4h-3zm-3.1 3.2 1.8 1.8h5.6l1.8-1.8H7.4zm4.6 3.6v2.1h.6v-2.1H12zm-3.2 3.7v.5h6.4v-.5H8.8z"/>
          <ellipse cx="8" cy="13.6" rx="1.2" ry="1.5" />
          <ellipse cx="16" cy="13.6" rx="1.2" ry="1.5" />
          <rect x="10.9" y="19.2" width="2.2" height="2" rx="0.5" />
      </svg>`
      : `<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" focusable="false" style="display:block;fill:#020617;">
        <path d="M3 7h11v7h1.6c.7 0 1.3.3 1.7.8l2.7 3.2V21h-1.8a2.7 2.7 0 0 1-5.4 0H9.2a2.7 2.7 0 0 1-5.4 0H2v-3h1V7zm12 2v5h4.2l-2-2.4c-.2-.4-.6-.6-1-.6H15zM6.5 20a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4zm9 0a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4z"/>
      </svg>`;

  return divIcon({
    html: `
      <div style="position:relative;display:flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:9999px;border:2px solid rgba(255,255,255,0.95);background:${color};box-shadow:${isSelected ? "0 0 0 7px rgba(34,211,238,0.26)" : "0 0 0 4px rgba(2,6,23,0.42)"};">
        ${glyph}
        ${hasExceptionBadge ? `<span style="position:absolute;right:-7px;top:50%;transform:translateY(-50%);display:flex;align-items:center;justify-content:center;width:18px;height:18px;border-radius:9999px;border:2px solid rgba(255,255,255,0.95);background:${badgeColor};color:#020617;font-size:10px;font-weight:800;line-height:1;">${symbol}</span>` : ""}
      </div>
    `,
    className: "border-0 bg-transparent",
    iconSize: [44, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -18],
  });
};

const parseEtaHours = (eta: string) => {
  const hoursMatch = eta.match(/(\d+)\s*h/i);
  const minutesMatch = eta.match(/(\d+)\s*m/i);
  const hours = hoursMatch ? Number(hoursMatch[1]) : 0;
  const minutes = minutesMatch ? Number(minutesMatch[1]) : 0;
  return Math.max(0.5, hours + (minutes / 60));
};

const hashId = (input: string) => {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = ((hash << 5) - hash) + input.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
};

const resolveDestinationCoordinate = (asset: LogisticsAsset, nodes: LogisticsNode[]): Coordinate => {
  const destinationText = asset.destination.toLowerCase();
  const matchedNode = nodes.find((node) => destinationText.includes(node.city.toLowerCase()));
  if (matchedNode) return matchedNode.coordinates;
  return DESTINATION_COORDINATES[asset.destination] ?? asset.location.coordinates;
};

const getRouteLaneIdForAsset = (asset: LogisticsAsset) => {
  // Controlled route lookup: asset.id -> controlledRoutesByLaneId[routeId]
  const explicitRouteId = controlledRouteIdByAssetId[asset.id];
  if (explicitRouteId) return explicitRouteId;

  const originCity = asset.location.city.toLowerCase();
  const destinationText = asset.destination.toLowerCase();

  if (originCity.includes("seattle") && destinationText.includes("boise")) {
    return "seattle-boise";
  }

  if (originCity.includes("seattle") && destinationText.includes("chicago")) {
    return "seattle-chicago";
  }

  return null;
};

const getRouteProfileForAsset = (asset: LogisticsAsset, nodes: LogisticsNode[]): RouteProfile => {
  const routeLaneId = getRouteLaneIdForAsset(asset);
  if (routeLaneId && controlledRoutesByLaneId[routeLaneId]) {
    return {
      laneId: routeLaneId,
      waypoints: controlledRoutesByLaneId[routeLaneId],
    };
  }

  const destination = resolveDestinationCoordinate(asset, nodes);
  return {
    laneId: `direct-${asset.id}`,
    waypoints: [
      { name: `${asset.location.city}, ${asset.location.state}`, coordinate: asset.location.coordinates, nodeType: "Origin" },
      { name: asset.destination, coordinate: destination, nodeType: "Destination" },
    ],
  };
};

const distanceBetween = (a: Coordinate, b: Coordinate) => {
  const dx = b[1] - a[1];
  const dy = b[0] - a[0];
  return Math.sqrt((dx * dx) + (dy * dy));
};

const interpolatePointAlongRoute = (points: Coordinate[], progress: number): { coordinate: Coordinate; legLabel: string } => {
  if (points.length <= 1) return { coordinate: points[0] ?? [39.5, -98.35], legLabel: "Route unavailable" };

  const boundedProgress = Math.min(0.99, Math.max(0, progress));
  const segments = points.slice(0, -1).map((point, index) => {
    const next = points[index + 1];
    return {
      start: point,
      end: next,
      distance: distanceBetween(point, next),
      index,
    };
  });

  const totalDistance = segments.reduce((sum, segment) => sum + segment.distance, 0);
  if (totalDistance <= 0) return { coordinate: points[0], legLabel: "Starting segment" };

  let target = boundedProgress * totalDistance;
  for (const segment of segments) {
    if (target <= segment.distance) {
      const ratio = segment.distance === 0 ? 0 : target / segment.distance;
      const coordinate: Coordinate = [
        Number((segment.start[0] + ((segment.end[0] - segment.start[0]) * ratio)).toFixed(5)),
        Number((segment.start[1] + ((segment.end[1] - segment.start[1]) * ratio)).toFixed(5)),
      ];
      return {
        coordinate,
        legLabel: `Leg ${segment.index + 1} of ${segments.length}`,
      };
    }
    target -= segment.distance;
  }

  return { coordinate: points[points.length - 1], legLabel: `Leg ${segments.length} of ${segments.length}` };
};

const computeProgress = (asset: LogisticsAsset, tick: number) => {
  const seed = hashId(asset.id);
  const baseProgress = (seed % 42) / 100;
  const etaHours = parseEtaHours(asset.eta);
  const speed = Math.max(0.0035, Math.min(0.014, 0.018 / etaHours));
  const advanced = (baseProgress + (tick * speed)) % 1;

  if (getTruckStatus(asset) === "Delivered") return 1;
  if (getTruckStatus(asset) === "Exception") return Math.min(0.92, advanced);
  return Math.min(0.98, Math.max(0.05, advanced));
};

export default function TransitMap() {
  const { state } = useDemoState();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [criticalOnly, setCriticalOnly] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(state.assets[0]?.id ?? null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTick((value) => value + 1);
    }, 2800);

    return () => window.clearInterval(interval);
  }, []);

  const mapAssets = useMemo(() => {
    const baseAssets = state.assets.filter((asset) => (
      !isDisabledLocalLaneAsset(asset)
      && !isMiamiConnectedAsset(asset)
      && !isDisabledCityConnectedAsset(asset)
      && !isDuplicateChicagoNewarkAsset(asset)
      && !isDuplicateNycBostonAsset(asset)
    ));

    const withSeattleChicago = baseAssets.some((asset) => asset.id === SEATTLE_CHICAGO_ASSET_ID)
      ? baseAssets
      : [...baseAssets, seattleToChicagoDemoAsset];

    const withChicagoAtlanta = withSeattleChicago.some((asset) => asset.id === CHICAGO_ATLANTA_ASSET_ID)
      ? withSeattleChicago
      : [...withSeattleChicago, chicagoToAtlantaDemoAsset];

    const withSeattleReno = withChicagoAtlanta.some((asset) => asset.id === SEATTLE_RENO_ASSET_ID)
      ? withChicagoAtlanta
      : [...withChicagoAtlanta, seattleToRenoDemoAsset];

    const withChicagoNewark = withSeattleReno.some((asset) => asset.id === CHICAGO_NEWARK_ASSET_ID)
      ? withSeattleReno
      : [...withSeattleReno, chicagoToNewarkDemoAsset];

    const withNycNewark = withChicagoNewark.some((asset) => asset.id === NYC_NEWARK_ASSET_ID)
      ? withChicagoNewark
      : [...withChicagoNewark, nycToNewarkDemoAsset];

    const withNycBoston = withNycNewark.some((asset) => asset.id === NYC_BOSTON_ASSET_ID)
      ? withNycNewark
      : [...withNycNewark, nycToBostonDemoAsset];

    const withLosAngelesAtlantaRail = withNycBoston.some((asset) => asset.id === LOS_ANGELES_ATLANTA_RAIL_ASSET_ID)
      ? withNycBoston
      : [...withNycBoston, losAngelesToAtlantaRailDemoAsset];

    const withLosAngelesShanghaiOcean = withLosAngelesAtlantaRail.some((asset) => asset.id === LOS_ANGELES_SHANGHAI_OCEAN_ASSET_ID)
      ? withLosAngelesAtlantaRail
      : [...withLosAngelesAtlantaRail, losAngelesToShanghaiOceanDemoAsset];

    const withAtlantaFrankfurtAir = withLosAngelesShanghaiOcean.some((asset) => asset.id === ATLANTA_FRANKFURT_AIR_ASSET_ID)
      ? withLosAngelesShanghaiOcean
      : [...withLosAngelesShanghaiOcean, atlantaToFrankfurtAirDemoAsset];

    const withPortLaRailYard = withAtlantaFrankfurtAir.some((asset) => asset.id === PORT_LA_RAIL_YARD_ASSET_ID)
      ? withAtlantaFrankfurtAir
      : [...withAtlantaFrankfurtAir, portOfLaToLaRailYardDemoAsset];

    const withAtlantaHartsfieldJackson = withPortLaRailYard.some((asset) => asset.id === ATLANTA_HARTSFIELD_JACKSON_ASSET_ID)
      ? withPortLaRailYard
      : [...withPortLaRailYard, atlantaToHartsfieldJacksonDemoAsset];

    return withAtlantaHartsfieldJackson;
  }, [state.assets]);

  const filteredAssets = useMemo(() => {
    return mapAssets.filter((asset) => {
      const matchesSearch = [asset.id, asset.labelId, asset.customer, asset.location.city, asset.location.state, asset.carrier]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesType =
        filter === "All" ||
        (filter === "Distribution Centers" && asset.assetType === "Distribution Center") ||
        (filter === "Trailers" && asset.assetType === "Trailer") ||
        (filter === "Trucks" && asset.assetType === "Truck") ||
        (filter === "Containers" && asset.assetType === "Container") ||
        (filter === "Rail Cars" && asset.assetType === "Rail Car");

      const matchesCritical = !criticalOnly || asset.riskStatus === "Critical";

      return matchesSearch && matchesType && matchesCritical;
    });
  }, [criticalOnly, filter, mapAssets, search]);

  const selectedAsset = filteredAssets.find((asset) => asset.id === selectedAssetId) ?? null;

  const routeSnapshots = useMemo(() => filteredAssets.map((asset) => {
    const routeProfile = getRouteProfileForAsset(asset, state.nodes);
    const waypoints = routeProfile.waypoints.map((waypoint) => waypoint.coordinate);
    const progress = computeProgress(asset, tick);
    const point = interpolatePointAlongRoute(waypoints, progress);
    const destination = waypoints[waypoints.length - 1] ?? asset.location.coordinates;

    return {
      asset,
      laneId: routeProfile.laneId,
      mode: railLaneIds.has(routeProfile.laneId)
        ? "rail" as const
        : oceanLaneIds.has(routeProfile.laneId)
          ? "ocean" as const
          : airLaneIds.has(routeProfile.laneId)
            ? "air" as const
            : "truck" as const,
      routeWaypoints: routeProfile.waypoints,
      waypoints,
      progress,
      truckCoordinate: point.coordinate,
      currentLeg: point.legLabel,
      destination,
    };
  }), [filteredAssets, state.nodes, tick]);

  const routeMilestones = useMemo(() => {
    const milestoneMap = new Map<string, RouteMilestone>();

    routeSnapshots.forEach(({ asset, laneId, routeWaypoints }) => {
      routeWaypoints.forEach((waypoint, index) => {
        if (!waypoint.nodeType || waypoint.nodeType === "Hub") return;
        const coordinate = waypoint.coordinate;
        const roundedKey = `${coordinate[0].toFixed(2)}:${coordinate[1].toFixed(2)}`;
        const key = `${laneId}:${roundedKey}:${waypoint.nodeType}:${index}`;
        if (milestoneMap.has(key)) {
          const existing = milestoneMap.get(key);
          if (existing && !existing.shipments.includes(asset.id)) {
            existing.shipments.push(asset.id);
          }
          return;
        }

        milestoneMap.set(key, {
          key,
          coordinate,
          label: waypoint.name,
          type: waypoint.nodeType,
          shipments: [asset.id],
        });
      });
    });

    return Array.from(milestoneMap.values());
  }, [routeSnapshots, state.nodes]);

  return (
    <div className="space-y-6">
      <TransitMapControls
        search={search}
        setSearch={setSearch}
        filter={filter}
        setFilter={setFilter}
        criticalOnly={criticalOnly}
        setCriticalOnly={setCriticalOnly}
      />

      <div className="grid gap-6 xl:grid-cols-[1.7fr_0.9fr]">
        <Card className="p-3">
          <div className="h-[620px] w-full overflow-hidden rounded-[1.5rem]">
            <MapContainer center={[39.5, -98.35]} zoom={4} scrollWheelZoom className="h-full w-full">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {routeSnapshots.map(({ asset, waypoints, laneId, mode }) => (
                <Polyline
                  key={`route-${asset.id}`}
                  positions={waypoints}
                  pathOptions={getRouteStyle(asset.riskStatus, getMarkerSymbol(asset) !== "•", mode)}
                  eventHandlers={{ click: () => setSelectedAssetId(asset.id) }}
                >
                  <Popup>
                    <div className="min-w-[220px] text-sm text-slate-700">
                      <p className="font-semibold text-slate-900">Lane {laneId}</p>
                      <p className="mt-1 text-slate-600">Shipment {asset.id}</p>
                      <p className="mt-2 text-slate-600">Route posture: {getTruckStatus(asset)}</p>
                    </div>
                  </Popup>
                </Polyline>
              ))}

              {routeMilestones.map((milestone) => (
                <Marker
                  key={`node-${milestone.key}`}
                  position={milestone.coordinate}
                  icon={getRouteNodeIcon(milestone.type)}
                  zIndexOffset={350}
                >
                  <Popup>
                    <div className="min-w-[210px] text-sm text-slate-700">
                      <p className="font-semibold text-slate-900">{milestone.label}</p>
                      <p className="mt-1 text-slate-600">{milestone.type} milestone</p>
                      <p className="mt-2 text-slate-600">Shipment links: {milestone.shipments.join(", ")}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}

              {routeSnapshots.map(({ asset, destination, progress, currentLeg, truckCoordinate, mode }) => (
                <Marker
                  key={`truck-${asset.id}`}
                  position={truckCoordinate}
                  icon={getVehicleIcon(asset, selectedAssetId === asset.id, mode)}
                  eventHandlers={{ click: () => setSelectedAssetId(asset.id) }}
                  zIndexOffset={selectedAssetId === asset.id ? 1000 : 700}
                >
                  <Popup>
                    <div className="min-w-[240px] text-sm text-slate-700">
                      <p className="font-semibold text-slate-900">Shipment {asset.id}</p>
                      <p className="mt-1 text-slate-600">{asset.assetType} · {asset.carrier}</p>
                      <p className="mt-2 text-slate-600">{asset.location.city}, {asset.location.state} → {asset.destination}</p>
                      <div className="mt-3 space-y-1 text-slate-600">
                        <p>Status: <span className="font-medium text-slate-900">{getTruckStatus(asset)}</span></p>
                        <p>{currentLeg} · {Math.round(progress * 100)}% complete</p>
                        <p>ETA: {asset.eta}</p>
                        <p>Active signal: {getActiveAlertSummary(asset)}</p>
                        <p>Battery posture: {getBatteryPosture(asset)}</p>
                      </div>
                      <p className="mt-2 text-xs text-slate-500">Destination approx: {destination[0].toFixed(2)}, {destination[1].toFixed(2)}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}

            </MapContainer>
          </div>
        </Card>

        <div className="space-y-6">
          <MapRiskLegend />
          <AssetDetailPanel asset={selectedAsset} />
        </div>
      </div>
    </div>
  );
}
