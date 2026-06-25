import AppShell from "@/components/AppShell";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";

export default function AnalyticsPage() {
  return (
    <AppShell
      title="Analytics"
      description="A placeholder analytics workspace for performance and trend analysis."
    >
      <Card title="Analytics workspace" description="Trend analysis and performance views will be introduced in later modules.">
        <EmptyState
          title="No analytics data available"
          description="This section will surface throughput, anomaly, and forecast insights soon."
        />
      </Card>
    </AppShell>
  );
}
