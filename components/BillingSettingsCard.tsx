import Card from "@/components/ui/Card";
import StatusBadge from "@/components/ui/StatusBadge";
import type { BillingSettings } from "@/data/types";

type BillingSettingsCardProps = {
  settings: BillingSettings;
};

export default function BillingSettingsCard({ settings }: BillingSettingsCardProps) {
  return (
    <Card title="Billing and subscription" description="Projected enterprise plan and usage configuration for the demo account">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-4">
          <p className="text-sm text-slate-400">Plan</p>
          <p className="mt-2 text-base font-semibold text-white">{settings.planName}</p>
        </div>
        <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-4">
          <p className="text-sm text-slate-400">Active labels</p>
          <p className="mt-2 text-base font-semibold text-white">{settings.activeLabels}</p>
        </div>
        <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-4">
          <p className="text-sm text-slate-400">Billing model</p>
          <p className="mt-2 text-base font-semibold text-white">{settings.billingModel}</p>
        </div>
        <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-4">
          <p className="text-sm text-slate-400">Usage tier</p>
          <div className="mt-2"><StatusBadge label={settings.usageTier} tone="normal" /></div>
        </div>
        <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-4 md:col-span-2 xl:col-span-4">
          <p className="text-sm text-slate-400">Next invoice</p>
          <p className="mt-2 text-base font-semibold text-white">{settings.nextInvoice}</p>
        </div>
      </div>
    </Card>
  );
}
