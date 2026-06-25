import Link from "next/link";
import AppShell from "@/components/AppShell";
import PageHeader from "@/components/ui/PageHeader";
import { mockData } from "@/data";

export default function ShipmentsIndexPage() {
  return (
    <AppShell title="Shipments" description="Quick access to shipment detail views for the mock demo data.">
      <div className="space-y-6">
        <PageHeader title="Shipments" description="Jump into a shipment detail drill-down from the mock shipment catalog." />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {mockData.shipments.map((shipment) => (
            <Link key={shipment.id} href={`/shipments/${shipment.id}`} className="rounded-[1.5rem] border border-white/10 bg-slate-900/70 p-5 transition hover:border-cyan-400/40 hover:bg-slate-800/80">
              <p className="text-sm text-cyan-300">{shipment.id}</p>
              <p className="mt-2 text-lg font-semibold text-white">{shipment.customer}</p>
              <p className="mt-2 text-sm text-slate-400">{shipment.origin} → {shipment.destination}</p>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
