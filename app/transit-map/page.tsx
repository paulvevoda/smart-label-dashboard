import AppShell from "@/components/AppShell";
import TransitMapClient from "@/components/TransitMapClient";
import PageHeader from "@/components/ui/PageHeader";

type TransitMapPageProps = {
  searchParams: Promise<{ assetId?: string }>;
};

export default async function TransitMapPage({ searchParams }: TransitMapPageProps) {
  const params = await searchParams;

  return (
    <AppShell
      title="Transit Map"
      description="A real U.S. logistics map showing Smart Label assets, corridors, and alert-driven risk levels."
    >
      <div className="space-y-6">
        <PageHeader
          title="Transit Map"
          description="Inspect the live network posture across priority U.S. logistics lanes and operational assets."
          actions={<span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-200">Leaflet · OpenStreetMap</span>}
        />
        <TransitMapClient initialSelectedAssetId={params.assetId} />
      </div>
    </AppShell>
  );
}
