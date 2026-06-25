type KpiCardProps = {
  label: string;
  value: string;
  detail: string;
  tone?: "cyan" | "amber" | "rose" | "emerald";
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
  detail,
  tone = "cyan",
}: KpiCardProps) {
  return (
    <div className={`rounded-2xl border p-5 shadow-lg shadow-black/10 ${toneClasses[tone]}`}>
      <p className="text-sm text-slate-300">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-sm text-slate-400">{detail}</p>
    </div>
  );
}
