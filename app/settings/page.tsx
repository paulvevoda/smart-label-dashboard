import AppShell from "@/components/AppShell";

export default function SettingsPage() {
  return (
    <AppShell
      title="Settings"
      description="Operational preferences and platform configuration controls."
    >
      <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-10 text-center shadow-2xl shadow-black/20">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">Module 01 placeholder</p>
        <h3 className="mt-3 text-2xl font-semibold text-white">Settings workspace coming soon</h3>
        <p className="mx-auto mt-3 max-w-xl text-sm text-slate-400">
          This route will eventually hold alert rules, integrations, and network configuration.
        </p>
      </div>
    </AppShell>
  );
}
