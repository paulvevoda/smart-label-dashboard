import AppShell from "@/components/AppShell";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";

export default function SettingsPage() {
  return (
    <AppShell
      title="Settings"
      description="Operational preferences and platform configuration controls."
    >
      <Card title="Configuration workspace" description="Alert rules, integrations, and network preferences will be added later.">
        <EmptyState
          title="No configuration options yet"
          description="This area will support alert rules and operational preferences in future modules."
        />
      </Card>
    </AppShell>
  );
}
