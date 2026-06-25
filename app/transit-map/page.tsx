import AppShell from "@/components/AppShell";

export default function TransitMapPage() {
  return (
    <AppShell
      title="Transit Map"
      description="A live placeholder view for route monitoring and network visibility."
    >
      <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-10 text-center shadow-2xl shadow-black/20">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">Module 01 placeholder</p>
        <h3 className="mt-3 text-2xl font-semibold text-white">Transit map experience coming soon</h3>
        <p className="mx-auto mt-3 max-w-xl text-sm text-slate-400">
          This route is reserved for the first network visualization layer of the Smart Label logistics platform.
        </p>
      </div>
    </AppShell>
  );
}
