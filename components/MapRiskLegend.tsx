export default function MapRiskLegend() {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-4 shadow-2xl shadow-black/20">
      <p className="text-sm font-semibold text-white">Transit map legend</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <div className="flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-200">
          <span className="flex h-5 w-5 items-center justify-center rounded-full border border-white/80 bg-cyan-400 text-slate-950">
            <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true" focusable="false" className="fill-slate-950">
              <path d="M3 7h11v7h1.6c.7 0 1.3.3 1.7.8l2.7 3.2V21h-1.8a2.7 2.7 0 0 1-5.4 0H9.2a2.7 2.7 0 0 1-5.4 0H2v-3h1V7zm12 2v5h4.2l-2-2.4c-.2-.4-.6-.6-1-.6H15zM6.5 20a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4zm9 0a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4z" />
            </svg>
          </span>
          Truck: road shipment
        </div>
        <div className="flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-200">
          <span className="flex h-5 w-5 items-center justify-center rounded-full border border-white/80 bg-cyan-400 text-slate-950">
            <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true" focusable="false" className="fill-slate-950">
              <path d="M5 4h14c1.1 0 2 .9 2 2v7c0 1.3-.8 2.5-2 3l1.5 2v1h-2.4l-1.6-2h-9.1l-1.6 2H3.4v-1L5 16c-1.2-.5-2-1.7-2-3V6c0-1.1.9-2 2-2zm0 4v3h14V8H5zm3 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm8 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
            </svg>
          </span>
          Locomotive: rail shipment
        </div>
        <div className="flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-200">
          <span className="flex h-5 w-5 items-center justify-center rounded-full border border-white/80 bg-cyan-400 text-slate-950">
            <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true" focusable="false" className="fill-slate-950">
              <path d="M3 15.8h18c0 2.6-2.2 4.2-4.4 4.2-1.2 0-2.2-.4-3.1-1.2-.9.8-2 1.2-3.2 1.2-1.2 0-2.3-.4-3.2-1.2-.9.8-1.9 1.2-3.1 1.2C5.2 20 3 18.4 3 15.8zm3.1-1.6L7.8 8h8.4l1.7 6.2H6.1zM10 5h4.4c.7 0 1.3.6 1.3 1.3V7H8.7V6.3C8.7 5.6 9.3 5 10 5z" />
            </svg>
          </span>
          Vessel: ocean shipment
        </div>
        <div className="flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-200">
          <span className="flex h-5 w-5 items-center justify-center rounded-full border border-white/80 bg-cyan-400 text-slate-950">
            <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true" focusable="false" className="fill-slate-950">
              <rect x="11.2" y="3.4" width="1.6" height="3.2" rx="0.8" />
              <rect x="4.2" y="10.3" width="15.6" height="2.2" rx="1.1" />
              <ellipse cx="12" cy="14.4" rx="2.2" ry="3" />
            </svg>
          </span>
          Air freighter: air shipment
        </div>
        <div className="flex items-center gap-2 rounded-full border border-slate-400/20 bg-slate-500/10 px-3 py-2 text-sm text-slate-200">
          <span className="h-3 w-3 rounded-full border-2 border-slate-400/30 bg-slate-300" />
          Origin
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
          Warning &lt;5%
        </div>
        <div className="flex items-center gap-2 rounded-full border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
          Exception ≥5%
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
          <span className="flex h-5 w-5 items-center justify-center rounded-full border border-rose-400/30 bg-rose-500/15 text-[10px] font-semibold text-rose-200">P</span>
          Package removed
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

      <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/70 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-cyan-200">Route key</p>
        <div className="mt-2 grid gap-2">
          <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-slate-900/40 px-2.5 py-1.5">
            <svg width="72" height="10" viewBox="0 0 72 10" aria-hidden="true" focusable="false" className="shrink-0">
              <line x1="2" y1="5" x2="70" y2="5" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <span className="text-xs text-slate-300">Truck route</span>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-slate-900/40 px-2.5 py-1.5">
            <svg width="72" height="10" viewBox="0 0 72 10" aria-hidden="true" focusable="false" className="shrink-0">
              <line x1="2" y1="5" x2="70" y2="5" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="11 6" strokeLinecap="butt" />
            </svg>
            <span className="text-xs text-slate-300">Rail route</span>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-slate-900/40 px-2.5 py-1.5">
            <svg width="72" height="10" viewBox="0 0 72 10" aria-hidden="true" focusable="false" className="shrink-0">
              <line x1="2" y1="5" x2="70" y2="5" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="1 12" strokeLinecap="round" />
            </svg>
            <span className="text-xs text-slate-300">Air route</span>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-slate-900/40 px-2.5 py-1.5">
            <svg width="72" height="10" viewBox="0 0 72 10" aria-hidden="true" focusable="false" className="shrink-0">
              <line x1="2" y1="5" x2="70" y2="5" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="1 8 12 8" strokeLinecap="round" />
            </svg>
            <span className="text-xs text-slate-300">Vessel route</span>
          </div>
        </div>
      </div>
    </div>
  );
}
