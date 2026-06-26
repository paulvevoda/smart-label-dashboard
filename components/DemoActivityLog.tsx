import Card from "@/components/ui/Card";
import type { DemoState } from "@/data/types";

type DemoActivityLogProps = {
  state: DemoState;
};

export default function DemoActivityLog({ state }: DemoActivityLogProps) {
  return (
    <Card title="Demo activity log" description="Recent cause-and-effect events for the investor walkthrough.">
      <div className="space-y-3">
        {state.activityLog.map((entry) => (
          <div key={entry.id} className="rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-base font-semibold text-white">{entry.title}</p>
              <span className="text-xs uppercase tracking-[0.3em] text-slate-500">{entry.timestamp}</span>
            </div>
            <p className="mt-2 text-sm text-slate-400">{entry.detail}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
