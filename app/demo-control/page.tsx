import AppShell from "@/components/AppShell";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";

export default function DemoControlPage() {
  return (
    <AppShell
      title="Investor Demo Control Panel"
      description="A placeholder control surface for scenario storytelling and investor presentations."
    >
      <Card title="Demo control workspace" description="Scenario controls and presentation overlays will be added in a later module.">
        <EmptyState
          title="No demo controls yet"
          description="This panel will later host narrative switches and demo orchestration actions."
        />
      </Card>
    </AppShell>
  );
}
