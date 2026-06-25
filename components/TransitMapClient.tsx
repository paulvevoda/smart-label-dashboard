'use client';

import dynamic from "next/dynamic";

const TransitMap = dynamic(() => import("@/components/TransitMap"), {
  ssr: false,
  loading: () => (
    <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-10 text-center shadow-2xl shadow-black/20">
      <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">Loading transit map</p>
      <p className="mt-3 text-sm text-slate-400">Preparing the logistics map experience…</p>
    </div>
  ),
});

export default function TransitMapClient() {
  return <TransitMap />;
}
