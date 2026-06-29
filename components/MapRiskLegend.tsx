export default function MapRiskLegend() {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-4 shadow-2xl shadow-black/20">
      <p className="text-sm font-semibold text-white">Transit map legend</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <div className="flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-200">
          <span className="flex h-5 w-5 items-center justify-center rounded-full border border-white/80 bg-cyan-400 text-[10px] font-semibold text-slate-950">T</span>
          Moving truck
        </div>
        <div className="flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-200">
          <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
          On track
        </div>
        <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          Completed
        </div>
        <div className="flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          Warning
        </div>
        <div className="flex items-center gap-2 rounded-full border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
          Exception
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-slate-300">
          <span className="flex h-5 w-5 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-500/15 text-[10px] font-semibold text-cyan-200">T</span>
          Temperature
        </div>
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-slate-300">
          <span className="flex h-5 w-5 items-center justify-center rounded-full border border-amber-400/30 bg-amber-500/15 text-[10px] font-semibold text-amber-200">S</span>
          Shock / tamper
        </div>
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-slate-300">
          <span className="flex h-5 w-5 items-center justify-center rounded-full border border-rose-400/30 bg-rose-500/15 text-[10px] font-semibold text-rose-200">L</span>
          Light exposure
        </div>
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-slate-300">
          <span className="flex h-5 w-5 items-center justify-center rounded-full border border-amber-400/30 bg-amber-500/15 text-[10px] font-semibold text-amber-200">B</span>
          Battery
        </div>
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-slate-300">
          <span className="flex h-5 w-5 items-center justify-center rounded-full border border-violet-400/30 bg-violet-500/15 text-[10px] font-semibold text-violet-200">D</span>
          Delay / hold
        </div>
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-slate-300">
          <span className="flex h-5 w-5 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-500/15 text-[10px] font-semibold text-cyan-200">R</span>
          Route deviation
        </div>
      </div>
    </div>
  );
}
