"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import AppShell from "@/components/AppShell";
import PageHeader from "@/components/ui/PageHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import TransportModeIcon, { getTransportModeLabel } from "@/components/ui/TransportModeIcon";
import { mockData } from "@/data";
import type { TransportMode } from "@/data/types";

const modeFilters: Array<{ label: string; value: "all" | TransportMode }> = [
  { label: "All", value: "all" },
  { label: "Truck", value: "truck" },
  { label: "Rail", value: "rail" },
  { label: "Air", value: "air" },
  { label: "Vessel", value: "vessel" },
];

const modeToneClass: Record<TransportMode, string> = {
  truck: "border-cyan-400/20 bg-cyan-500/10 text-cyan-200",
  rail: "border-emerald-400/20 bg-emerald-500/10 text-emerald-200",
  air: "border-violet-400/20 bg-violet-500/10 text-violet-200",
  vessel: "border-sky-400/20 bg-sky-500/10 text-sky-200",
};

export default function ShipmentsIndexPage() {
  const [modeFilter, setModeFilter] = useState<"all" | TransportMode>("all");

  const modeCounts = useMemo(() => {
    return mockData.shipments.reduce<Record<TransportMode, number>>((counts, shipment) => {
      counts[shipment.mode] += 1;
      return counts;
    }, { truck: 0, rail: 0, air: 0, vessel: 0 });
  }, []);

  const filteredShipments = useMemo(() => {
    if (modeFilter === "all") return mockData.shipments;
    return mockData.shipments.filter((shipment) => shipment.mode === modeFilter);
  }, [modeFilter]);

  return (
    <AppShell title="Shipments" description="Operational shipment board across truck, rail, air, and vessel modes.">
      <div className="space-y-6">
        <PageHeader
          title="Shipments"
          description="Review live demo shipments by route, mode, status, and current node before drilling into detail or map context."
          actions={<span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-200">Investor demo catalog</span>}
        />

        <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/70 p-4 shadow-2xl shadow-black/20">
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
            <button
              type="button"
              onClick={() => setModeFilter("all")}
              className={`rounded-xl border px-3 py-2 text-left transition ${modeFilter === "all" ? "border-white/30 bg-white/10 text-white" : "border-white/10 bg-slate-950/70 text-slate-300 hover:border-white/20"}`}
            >
              <p className="text-xs uppercase tracking-wide text-slate-400">All</p>
              <p className="mt-0.5 text-base font-semibold">{mockData.shipments.length}</p>
            </button>
            {(["truck", "rail", "air", "vessel"] as TransportMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setModeFilter(mode)}
                className={`rounded-xl border px-3 py-2 text-left transition ${modeFilter === mode ? modeToneClass[mode] : "border-white/10 bg-slate-950/70 text-slate-300 hover:border-white/20"}`}
              >
                <div className="flex items-center gap-2">
                  <TransportModeIcon mode={mode} className="h-4 w-4" />
                  <p className="text-xs uppercase tracking-wide">{getTransportModeLabel(mode)}</p>
                </div>
                <p className="mt-0.5 text-base font-semibold">{modeCounts[mode]}</p>
              </button>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {modeFilters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setModeFilter(filter.value)}
                className={`rounded-full border px-3 py-1.5 text-sm transition ${modeFilter === filter.value ? "border-cyan-400/40 bg-cyan-500/15 text-cyan-200" : "border-white/10 bg-slate-950/70 text-slate-300 hover:border-white/20"}`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredShipments.map((shipment) => (
            <article key={shipment.id} className="rounded-[1.5rem] border border-white/10 bg-slate-900/70 p-5 shadow-2xl shadow-black/20 transition hover:border-cyan-400/40 hover:bg-slate-800/80">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-cyan-300">{shipment.id}</p>
                  <p className="mt-1 text-sm text-slate-400">{shipment.origin} → {shipment.destination}</p>
                </div>
                <StatusBadge label={shipment.status} tone={shipment.status === "On Time" ? "on-time" : shipment.status === "Delayed" ? "delayed" : "at-risk"} />
              </div>

              <p className="mt-3 text-lg font-semibold text-white">{shipment.customer}</p>

              <div className="mt-3 grid gap-2 rounded-2xl border border-white/10 bg-slate-950/65 p-3 text-sm text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Transport mode</span>
                  <span className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium ${modeToneClass[shipment.mode]}`}>
                    <TransportModeIcon mode={shipment.mode} className="h-3.5 w-3.5" />
                    {getTransportModeLabel(shipment.mode)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Current node</span>
                  <span className="text-right text-white">{shipment.currentNode ?? shipment.currentLocation}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Current location</span>
                  <span className="text-right text-white">{shipment.currentLocation}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">ETA</span>
                  <span className="text-right text-white">{shipment.eta}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Planned arrival</span>
                  <span className="text-right text-white">{shipment.plannedArrival ?? "Not set"}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-2">
                <span className="text-xs text-slate-500">{shipment.activity}</span>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/transit-map?assetId=${shipment.mapAssetId ?? shipment.assignedAsset}`}
                    className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-200 transition hover:border-cyan-300/50 hover:bg-cyan-500/20"
                  >
                    View on map
                  </Link>
                  <Link
                    href={`/shipments/${shipment.id}`}
                    className="rounded-full border border-white/15 bg-slate-950/70 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:border-white/30"
                  >
                    Details
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
