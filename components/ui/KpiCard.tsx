import type { ReactNode } from "react";

type KpiCardProps = {
  label: string;
  value: string;
  subtext?: string;
  tone?: "cyan" | "amber" | "rose" | "emerald";
  trend?: ReactNode;
  status?: ReactNode;
};

const toneClasses: Record<NonNullable<KpiCardProps["tone"]>, string> = {
  cyan: "border-cyan-400/20 bg-cyan-500/10 text-cyan-200",
  amber: "border-amber-400/20 bg-amber-500/10 text-amber-200",
  rose: "border-rose-400/20 bg-rose-500/10 text-rose-200",
  emerald: "border-emerald-400/20 bg-emerald-500/10 text-emerald-200",
};

export default function KpiCard({
  label,
  value,
  subtext,
  tone = "cyan",
  trend,
  status,
}: KpiCardProps) {
  return (
    <div className={`rounded-[1.25rem] border p-5 shadow-lg shadow-black/10 ${toneClasses[tone]}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-300">{label}</p>
          <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
        </div>
        {status && <div>{status}</div>}
      </div>
      {subtext && <p className="mt-2 text-sm text-slate-400">{subtext}</p>}
      {trend && <div className="mt-3 text-sm text-slate-300">{trend}</div>}
    </div>
  );
}
