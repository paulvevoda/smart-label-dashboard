import Card from "@/components/ui/Card";
import SectionHeader from "@/components/ui/SectionHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import type { NotificationRule } from "@/data/types";

type NotificationRulesSettingsProps = {
  rules: NotificationRule[];
};

export default function NotificationRulesSettings({ rules }: NotificationRulesSettingsProps) {
  return (
    <Card title="Alert notification rules" description="Routing and escalation defaults for operational event delivery">
      <SectionHeader title="Configured rules" description="All rules are demo-only and can be toggled in the UI without connecting a service." />
      <div className="mt-5 space-y-3">
        {rules.map((rule) => (
          <div key={rule.name} className="flex flex-col gap-3 rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-base font-semibold text-white">{rule.name}</p>
              <p className="mt-1 text-sm text-slate-400">{rule.description}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge label={rule.enabled ? "Enabled" : "Disabled"} tone={rule.enabled ? "active" : "offline"} />
              <span className="rounded-full border border-white/10 bg-slate-900/70 px-3 py-1 text-sm text-slate-300">{rule.deliveryMethod}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
