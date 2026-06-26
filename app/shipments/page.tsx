import Link from "next/link";
import AppShell from "@/components/AppShell";
import PageHeader from "@/components/ui/PageHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import { mockData } from "@/data";

export default function ShipmentsIndexPage() {
  return (
    <AppShell title="Shipments" description="Quick access to shipment detail views for the mock demo data.">
      <div className="space-y-6">
        <PageHeader
          title="Shipments"
          description="Jump into a shipment detail drill-down from the mock shipment catalog."
          actions={<span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-200">Mock shipment catalog</span>}
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {mockData.shipments.map((shipment) => (
            <Link key={shipment.id} href={`/shipments/${shipment.id}`} className="rounded-[1.5rem] border border-white/10 bg-slate-900/70 p-5 transition hover:border-cyan-400/40 hover:bg-slate-800/80">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-cyan-300">{shipment.id}</p>
                <StatusBadge label={shipment.status} tone={shipment.status === "On Time" ? "on-time" : shipment.status === "Delayed" ? "delayed" : "at-risk"} />
              </div>
              <p className="mt-3 text-lg font-semibold text-white">{shipment.customer}</p>
              <p className="mt-2 text-sm text-slate-400">{shipment.origin} → {shipment.destination}</p>
              <p className="mt-3 text-sm text-slate-500">ETA {shipment.eta} · {shipment.activity}</p>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
