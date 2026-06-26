'use client';

import dynamic from "next/dynamic";
import { divIcon } from "leaflet";
import { useMemo, useState } from "react";
import "leaflet/dist/leaflet.css";

import AssetDetailPanel from "@/components/AssetDetailPanel";
import MapRiskLegend from "@/components/MapRiskLegend";
import TransitMapControls from "@/components/TransitMapControls";
import Card from "@/components/ui/Card";
import { useDemoState } from "@/context/DemoStateContext";
import { getRiskColor } from "@/data";
import type { LogisticsAsset } from "@/data/types";

const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Polyline = dynamic(() => import("react-leaflet").then((mod) => mod.Polyline), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });

const getRouteStyle = (riskStatus: LogisticsAsset["riskStatus"], hasIssue: boolean) => {
  if (riskStatus === "Critical" || hasIssue) {
    return { color: "#fb7185", weight: 4, opacity: 0.95, dashArray: "" };
  }

  if (riskStatus === "Warning") {
    return { color: "#f59e0b", weight: 3.2, opacity: 0.8, dashArray: "8 6" };
  }

  return { color: "#38bdf8", weight: 3, opacity: 0.75, dashArray: "" };
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

const getMarkerIcon = (asset: LogisticsAsset, isSelected: boolean) => {
  const color = getRiskColor(asset.riskStatus);
  const symbol = getMarkerSymbol(asset);

  return divIcon({
    html: `<div style="display:flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:9999px;border:2px solid rgba(255,255,255,0.95);background:${color};color:${isSelected ? "#f8fafc" : "#020617"};box-shadow:${isSelected ? "0 0 0 7px rgba(34,211,238,0.24)" : "0 0 0 6px rgba(2,6,23,0.4)"};font-size:12px;font-weight:700;">${symbol}</div>`,
    className: "border-0 bg-transparent",
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

export default function TransitMap() {
  const { state } = useDemoState();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [criticalOnly, setCriticalOnly] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(state.assets[0]?.id ?? null);

  const filteredAssets = useMemo(() => {
    return state.assets.filter((asset) => {
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
  }, [criticalOnly, filter, search]);

  const selectedAsset = filteredAssets.find((asset) => asset.id === selectedAssetId) ?? null;

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

              {state.lanes.map((lane) => {
                const hasIssue = lane.recentAlertActivity.length > 0;
                const style = getRouteStyle(lane.riskStatus, hasIssue);
                return (
                  <Polyline
                    key={lane.id}
                    positions={state.nodes.filter((node) => [lane.originNode, lane.destinationNode].includes(node.id)).map((node) => node.coordinates)}
                    pathOptions={style}
                  />
                );
              })}

              {filteredAssets.map((asset) => (
                <Marker
                  key={asset.id}
                  position={asset.location.coordinates}
                  icon={getMarkerIcon(asset, selectedAssetId === asset.id)}
                  eventHandlers={{ click: () => setSelectedAssetId(asset.id) }}
                  zIndexOffset={selectedAssetId === asset.id ? 1000 : 0}
                >
                  <Popup>
                    <div className="min-w-[180px] text-sm text-slate-700">
                      <p className="font-semibold text-slate-900">{asset.id}</p>
                      <p className="mt-1 text-slate-600">{asset.assetType} · {asset.carrier}</p>
                      <p className="mt-2 text-slate-600">{asset.location.city}, {asset.location.state}</p>
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
