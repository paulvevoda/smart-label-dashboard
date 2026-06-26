import Card from "@/components/ui/Card";
import StatusBadge from "@/components/ui/StatusBadge";
import type { CompanySettings } from "@/data/types";

type CompanySettingsCardProps = {
  settings: CompanySettings;
};

export default function CompanySettingsCard({ settings }: CompanySettingsCardProps) {
  return (
    <Card title="Company profile" description="Account and deployment defaults for the demo tenant">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-4">
          <p className="text-sm text-slate-400">Company</p>
          <p className="mt-2 text-base font-semibold text-white">{settings.companyName}</p>
        </div>
        <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-4">
          <p className="text-sm text-slate-400">Industry</p>
          <p className="mt-2 text-base font-semibold text-white">{settings.industry}</p>
        </div>
        <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-4">
          <p className="text-sm text-slate-400">Primary contact</p>
          <p className="mt-2 text-base font-semibold text-white">{settings.primaryContact}</p>
        </div>
        <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-4">
          <p className="text-sm text-slate-400">Operations region</p>
          <p className="mt-2 text-base font-semibold text-white">{settings.operationsRegion}</p>
        </div>
        <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-4">
          <p className="text-sm text-slate-400">Default timezone</p>
          <p className="mt-2 text-base font-semibold text-white">{settings.defaultTimezone}</p>
        </div>
        <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-4">
          <p className="text-sm text-slate-400">Account status</p>
          <div className="mt-2"><StatusBadge label={settings.accountStatus} tone="active" /></div>
        </div>
      </div>
    </Card>
  );
}
