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

const SEATTLE_CHICAGO_ASSET_ID = "TR-SEA-CHI-90";
const CHICAGO_ATLANTA_ASSET_ID = "TR-CHI-ATL-65";

const controlledRouteIdByAssetId: Record<string, string> = {
  "TR-SEA-12": "seattle-boise",
  [SEATTLE_CHICAGO_ASSET_ID]: "seattle-chicago",
  [CHICAGO_ATLANTA_ASSET_ID]: "chicago-atlanta",
};

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

const truckRoutesByLaneId: Record<string, RouteWaypoint[]> = {
  "seattle-boise": seattleToBoiseRoute,
  "seattle-chicago": seattleToChicagoRoute,
  "chicago-atlanta": chicagoToAtlantaRoute,
};

const DESTINATION_COORDINATES: Record<string, Coordinate> = {
  "Ontario Crossdock": [34.0633, -117.6509],
  "Boise Distribution Hub": [43.615, -116.2023],
  "Salt Lake City": [40.7608, -111.891],
  "Denver Yard": [39.7392, -104.9903],
  "Atlanta Hub": [33.749, -84.388],
  "New York / New Jersey": [40.7357, -74.1724],
  "Newark": [40.7357, -74.1724],
  "Newark Yard": [40.7357, -74.1724],
  "Boston Market": [42.3601, -71.0589],
  "Chicago, IL": [41.8781, -87.6298],
  "Atlanta, GA": [33.749, -84.388],
  "Orlando Fulfillment": [28.5383, -81.3792],
};

const getRouteStyle = (riskStatus: LogisticsAsset["riskStatus"], hasIssue: boolean) => {
  if (riskStatus === "Critical" || hasIssue) {
    return { color: "#fb7185", weight: 4, opacity: 0.95, dashArray: "" };
  }

  if (riskStatus === "Warning") {
    return { color: "#f59e0b", weight: 3.2, opacity: 0.8, dashArray: "8 6" };
  }

  return { color: "#38bdf8", weight: 3, opacity: 0.75, dashArray: "" };
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

const getTruckIcon = (asset: LogisticsAsset, isSelected: boolean) => {
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

  return divIcon({
    html: `
      <div style="position:relative;display:flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:9999px;border:2px solid rgba(255,255,255,0.95);background:${color};box-shadow:${isSelected ? "0 0 0 7px rgba(34,211,238,0.26)" : "0 0 0 4px rgba(2,6,23,0.42)"};">
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" focusable="false" style="display:block;fill:#020617;">
          <path d="M3 7h11v7h1.6c.7 0 1.3.3 1.7.8l2.7 3.2V21h-1.8a2.7 2.7 0 0 1-5.4 0H9.2a2.7 2.7 0 0 1-5.4 0H2v-3h1V7zm12 2v5h4.2l-2-2.4c-.2-.4-.6-.6-1-.6H15zM6.5 20a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4zm9 0a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4z"/>
        </svg>
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
  // Controlled truck route lookup: asset.id -> truckRoutesByLaneId[routeId]
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
  if (routeLaneId && truckRoutesByLaneId[routeLaneId]) {
    return {
      laneId: routeLaneId,
      waypoints: truckRoutesByLaneId[routeLaneId],
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
      !isDisabledLocalLaneAsset(asset) && !isMiamiConnectedAsset(asset)
    ));

    const withSeattleChicago = baseAssets.some((asset) => asset.id === SEATTLE_CHICAGO_ASSET_ID)
      ? baseAssets
      : [...baseAssets, seattleToChicagoDemoAsset];

    return withSeattleChicago.some((asset) => asset.id === CHICAGO_ATLANTA_ASSET_ID)
      ? withSeattleChicago
      : [...withSeattleChicago, chicagoToAtlantaDemoAsset];
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
        if (!waypoint.nodeType) return;
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

              {routeSnapshots.map(({ asset, waypoints, laneId }) => (
                <Polyline
                  key={`route-${asset.id}`}
                  positions={waypoints}
                  pathOptions={getRouteStyle(asset.riskStatus, getMarkerSymbol(asset) !== "•")}
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

              {routeSnapshots.map(({ asset, destination, progress, currentLeg, truckCoordinate }) => (
                <Marker
                  key={`truck-${asset.id}`}
                  position={truckCoordinate}
                  icon={getTruckIcon(asset, selectedAssetId === asset.id)}
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
