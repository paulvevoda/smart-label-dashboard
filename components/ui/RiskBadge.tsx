type RiskBadgeProps = {
  level: "Normal" | "Warning" | "Critical";
  className?: string;
};

const toneClasses = {
  Normal: "border-cyan-400/20 bg-cyan-500/10 text-cyan-200",
  Warning: "border-amber-400/20 bg-amber-500/10 text-amber-200",
  Critical: "border-rose-400/20 bg-rose-500/10 text-rose-200",
} as const;

export default function RiskBadge({ level, className = "" }: RiskBadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${toneClasses[level]} ${className}`.trim()}>
      {level}
    </span>
  );
}
