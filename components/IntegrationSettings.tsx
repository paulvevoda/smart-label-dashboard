import Card from "@/components/ui/Card";
import StatusBadge from "@/components/ui/StatusBadge";
import type { IntegrationSetting } from "@/data/types";

type IntegrationSettingsProps = {
  integrations: IntegrationSetting[];
};

export default function IntegrationSettings({ integrations }: IntegrationSettingsProps) {
  return (
    <Card title="Integrations" description="Current MVP integrations and future-ready connection points">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {integrations.map((integration) => (
          <div key={integration.name} className="rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-base font-semibold text-white">{integration.name}</p>
              <StatusBadge label={integration.status} tone={integration.status === "Connected" ? "active" : integration.status === "Available" ? "normal" : "idle"} />
            </div>
            <p className="mt-3 text-sm text-slate-400">{integration.description}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
