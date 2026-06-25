import Card from "@/components/ui/Card";
import type { AnalyticsInsight } from "@/data/types";

type AnalyticsInsightsPanelProps = {
  insights: AnalyticsInsight[];
};

export default function AnalyticsInsightsPanel({ insights }: AnalyticsInsightsPanelProps) {
  return (
    <Card title="Insights and recommendations" description="Executive synthesis of where the platform is creating the most operational value">
      <div className="space-y-3">
        {insights.map((insight) => (
          <div key={insight.title} className="rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-4">
            <p className="text-base font-semibold text-white">{insight.title}</p>
            <p className="mt-2 text-sm text-slate-400">{insight.description}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
