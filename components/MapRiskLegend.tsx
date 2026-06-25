export default function MapRiskLegend() {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-4 shadow-2xl shadow-black/20">
      <p className="text-sm font-semibold text-white">Risk legend</p>
      <div className="mt-3 flex flex-wrap gap-3">
        <div className="flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-200">
          <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
          Normal (0%–2%)
        </div>
        <div className="flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          Warning (&gt;2%–8%)
        </div>
        <div className="flex items-center gap-2 rounded-full border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
          Critical (&gt;8%)
        </div>
      </div>
    </div>
  );
}
