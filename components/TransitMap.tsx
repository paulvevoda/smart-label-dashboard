'use client';

import dynamic from "next/dynamic";
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

const getMarkerColor = (asset: LogisticsAsset) => getRiskColor(asset.riskStatus);

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

              {state.lanes.map((lane) => (
                <Polyline
                  key={lane.id}
                  positions={state.nodes.filter((node) => [lane.originNode, lane.destinationNode].includes(node.id)).map((node) => node.coordinates)}
                  pathOptions={{ color: lane.riskStatus === "Critical" ? "#fb7185" : lane.riskStatus === "Warning" ? "#f59e0b" : "#38bdf8", weight: 2, opacity: 0.45 }}
                />
              ))}

              {filteredAssets.map((asset) => (
                <Marker
                  key={asset.id}
                  position={asset.location.coordinates}
                  eventHandlers={{ click: () => setSelectedAssetId(asset.id) }}
                />
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
