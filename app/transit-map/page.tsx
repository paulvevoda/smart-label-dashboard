import AppShell from "@/components/AppShell";
import TransitMapClient from "@/components/TransitMapClient";

export default function TransitMapPage() {
  return (
    <AppShell
      title="Transit Map"
      description="A real U.S. logistics map showing Smart Label assets, corridors, and alert-driven risk levels."
    >
      <TransitMapClient />
    </AppShell>
  );
}
