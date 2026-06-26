import Card from "@/components/ui/Card";
import StatusBadge from "@/components/ui/StatusBadge";
import type { ApiAccessSettings } from "@/data/types";

type ApiSettingsCardProps = {
  settings: ApiAccessSettings;
};

export default function ApiSettingsCard({ settings }: ApiSettingsCardProps) {
  return (
    <Card title="API access" description="Developer access surfaces for the demo environment">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-4">
          <p className="text-sm text-slate-400">API status</p>
          <div className="mt-2"><StatusBadge label={settings.status} tone="active" /></div>
        </div>
        <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-4">
          <p className="text-sm text-slate-400">API key</p>
          <p className="mt-2 text-base font-semibold text-white">{settings.apiKey}</p>
        </div>
        <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-4">
          <p className="text-sm text-slate-400">Webhook endpoint</p>
          <p className="mt-2 text-base font-semibold text-white">{settings.webhookEndpoint}</p>
        </div>
        <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-4">
          <p className="text-sm text-slate-400">Event stream</p>
          <p className="mt-2 text-base font-semibold text-white">{settings.eventStream}</p>
        </div>
      </div>
    </Card>
  );
}
