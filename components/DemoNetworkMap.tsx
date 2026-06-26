"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import "leaflet/dist/leaflet.css";
import Card from "@/components/ui/Card";
import { getRiskColor } from "@/data";
import type { DemoState, LogisticsAsset, LogisticsNode, TransitLane } from "@/data/types";
import { useDemoState } from "@/context/DemoStateContext";

const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Polyline = dynamic(() => import("react-leaflet").then((mod) => mod.Polyline), { ssr: false });

const getAssetColor = (asset: LogisticsAsset) => getRiskColor(asset.riskStatus);
const getNodeColor = (node: LogisticsNode) => (node.activeAlerts > 0 ? getRiskColor("Critical") : getRiskColor("Normal"));

export default function DemoNetworkMap() {
  const { state, setSelectedItem, selectedItem } = useDemoState();

  const selectedNode = state.nodes.find((node) => node.id === selectedItem.id && selectedItem.kind === "node") ?? null;
  const selectedAsset = state.assets.find((asset) => asset.id === selectedItem.id && selectedItem.kind === "asset") ?? null;
  const selectedLane = state.lanes.find((lane) => lane.id === selectedItem.id && selectedItem.kind === "lane") ?? null;

  const lanePositions = useMemo(() =>
    state.lanes.map((lane) => {
      const origin = state.nodes.find((node) => node.id === lane.originNode);
      const destination = state.nodes.find((node) => node.id === lane.destinationNode);
      const positions: [number, number][] = origin && destination ? [origin.coordinates, destination.coordinates] : [[39.5, -98.35], [39.5, -98.35]];
      return { lane, positions };
    }),
  [state.lanes, state.nodes]);

  return (
    <div className="grid gap-6 xl:grid-cols-[1.55fr_0.95fr]">
      <Card className="p-3">
        <div className="h-[620px] w-full overflow-hidden rounded-[1.5rem]">
          <MapContainer center={[39.5, -98.35]} zoom={4} scrollWheelZoom className="h-full w-full">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {lanePositions.map(({ lane, positions }) => (
              <Polyline
                key={lane.id}
                positions={positions}
                pathOptions={{ color: lane.riskStatus === "Critical" ? "#fb7185" : lane.riskStatus === "Warning" ? "#f59e0b" : "#38bdf8", weight: 2, opacity: 0.5 }}
                eventHandlers={{ click: () => setSelectedItem({ kind: "lane", id: lane.id }) }}
              />
            ))}

            {state.nodes.map((node) => (
              <Marker
                key={node.id}
                position={node.coordinates}
                eventHandlers={{ click: () => setSelectedItem({ kind: "node", id: node.id }) }}
              />
            ))}

            {state.assets.map((asset) => (
              <Marker
                key={asset.id}
                position={asset.location.coordinates}
                eventHandlers={{ click: () => setSelectedItem({ kind: "asset", id: asset.id }) }}
              />
            ))}
          </MapContainer>
        </div>
      </Card>

      <div className="space-y-4">
        <Card title="Selected network object" description="Click a node, lane, or asset to inspect the live demo state.">
          {selectedNode ? (
            <div className="space-y-3 text-sm text-slate-300">
              <div><p className="text-xs uppercase tracking-[0.3em] text-slate-500">Node</p><p className="mt-1 text-base font-semibold text-white">{selectedNode.name}</p></div>
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-3"><p className="text-xs uppercase tracking-[0.3em] text-slate-500">Type</p><p className="mt-2 text-sm text-white">{selectedNode.type}</p></div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-3"><p className="text-xs uppercase tracking-[0.3em] text-slate-500">Location</p><p className="mt-2 text-sm text-white">{selectedNode.city}, {selectedNode.state}</p></div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-3"><p className="text-xs uppercase tracking-[0.3em] text-slate-500">Labels Present</p><p className="mt-2 text-sm text-white">{selectedNode.labelsPresent}</p></div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-3"><p className="text-xs uppercase tracking-[0.3em] text-slate-500">Active Alerts</p><p className="mt-2 text-sm text-white">{selectedNode.activeAlerts}</p></div>
              </div>
            </div>
          ) : selectedAsset ? (
            <div className="space-y-3 text-sm text-slate-300">
              <div><p className="text-xs uppercase tracking-[0.3em] text-slate-500">Asset</p><p className="mt-1 text-base font-semibold text-white">{selectedAsset.id}</p></div>
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-3"><p className="text-xs uppercase tracking-[0.3em] text-slate-500">Type</p><p className="mt-2 text-sm text-white">{selectedAsset.assetType}</p></div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-3"><p className="text-xs uppercase tracking-[0.3em] text-slate-500">Carrier</p><p className="mt-2 text-sm text-white">{selectedAsset.carrier}</p></div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-3"><p className="text-xs uppercase tracking-[0.3em] text-slate-500">Location</p><p className="mt-2 text-sm text-white">{selectedAsset.location.city}</p></div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-3"><p className="text-xs uppercase tracking-[0.3em] text-slate-500">Labels Present</p><p className="mt-2 text-sm text-white">{selectedAsset.labelsPresent}</p></div>
              </div>
            </div>
          ) : selectedLane ? (
            <div className="space-y-3 text-sm text-slate-300">
              <div><p className="text-xs uppercase tracking-[0.3em] text-slate-500">Lane</p><p className="mt-1 text-base font-semibold text-white">{selectedLane.corridor}</p></div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-3"><p className="text-xs uppercase tracking-[0.3em] text-slate-500">Risk</p><p className="mt-2 text-sm text-white">{selectedLane.riskStatus}</p></div>
            </div>
          ) : (
            <p className="text-sm text-slate-400">Select a node, lane, or asset on the map to inspect live demo details.</p>
          )}
        </Card>
      </div>
    </div>
  );
}
