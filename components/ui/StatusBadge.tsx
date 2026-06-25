type StatusBadgeProps = {
  label: string;
  tone?: "normal" | "warning" | "critical" | "active" | "idle" | "offline" | "resolved" | "on-time" | "delayed" | "at-risk";
  className?: string;
};

const toneClasses: Record<NonNullable<StatusBadgeProps["tone"]>, string> = {
  normal: "border-cyan-400/20 bg-cyan-500/10 text-cyan-200",
  warning: "border-amber-400/20 bg-amber-500/10 text-amber-200",
  critical: "border-rose-400/20 bg-rose-500/10 text-rose-200",
  active: "border-emerald-400/20 bg-emerald-500/10 text-emerald-200",
  idle: "border-slate-400/20 bg-slate-500/10 text-slate-200",
  offline: "border-slate-500/20 bg-slate-700/40 text-slate-300",
  resolved: "border-emerald-400/20 bg-emerald-500/10 text-emerald-200",
  "on-time": "border-cyan-400/20 bg-cyan-500/10 text-cyan-200",
  delayed: "border-amber-400/20 bg-amber-500/10 text-amber-200",
  "at-risk": "border-rose-400/20 bg-rose-500/10 text-rose-200",
};

export default function StatusBadge({ label, tone = "normal", className = "" }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${toneClasses[tone]} ${className}`.trim()}>
      {label}
    </span>
  );
}
