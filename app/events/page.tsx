import AppShell from "@/components/AppShell";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";

export default function EventsPage() {
  return (
    <AppShell
      title="Events"
      description="A placeholder events stream for operational signal review."
    >
      <Card title="Operational events" description="Upcoming event timeline and alert history views.">
        <EmptyState
          title="No events found"
          description="The event feed will appear here once the operational timeline is wired up."
        />
      </Card>
    </AppShell>
  );
}
