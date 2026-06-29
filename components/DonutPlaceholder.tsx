type DonutItem = {
  label: string;
  value: number;
  color: string;
  percentage?: number;
};

type DonutPlaceholderProps = {
  title: string;
  items: DonutItem[];
  unitLabel: string;
};

const singularize = (unitLabel: string, value: number) => {
  if (value === 1) return unitLabel;
  return `${unitLabel}s`;
};

export default function DonutPlaceholder({ title, items, unitLabel }: DonutPlaceholderProps) {
  const total = items.reduce((sum, item) => sum + item.value, 0);
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  let cumulativeLength = 0;

  const segments = items
    .filter((item) => item.value > 0)
    .map((item) => {
      const portion = total > 0 ? item.value / total : 0;
      const segmentLength = portion * circumference;
      const offset = cumulativeLength;
      cumulativeLength += segmentLength;

      return {
        ...item,
        segmentLength,
        offset,
        displayPercentage: item.percentage ?? (total > 0 ? Math.round(portion * 100) : 0),
      };
    });

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-black/20 transition-colors hover:border-cyan-400/20">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-cyan-200">
          <span className="h-2 w-2 rounded-full bg-cyan-300" aria-hidden />
          Live snapshot
        </span>
      </div>

      <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-8">
        <div className="mx-auto w-full max-w-[12rem]">
          <div className="relative aspect-square">
            <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" role="img" aria-label={`${title} distribution`}>
              <circle cx="60" cy="60" r={radius} fill="none" stroke="rgba(148, 163, 184, 0.2)" strokeWidth="14" />
              {segments.map((segment) => (
                <circle
                  key={segment.label}
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="none"
                  stroke={segment.color}
                  strokeWidth="14"
                  strokeLinecap="butt"
                  strokeDasharray={`${segment.segmentLength} ${circumference - segment.segmentLength}`}
                  strokeDashoffset={-segment.offset}
                />
              ))}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Total</p>
              <p className="mt-1 text-2xl font-semibold text-white">{total.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-3">
          {total === 0 && (
            <div className="rounded-xl border border-dashed border-white/15 bg-slate-950/40 px-4 py-6 text-sm text-slate-400">
              No telemetry is available for this chart yet.
            </div>
          )}
          {items.map((item) => {
            const percentage = item.percentage ?? (total > 0 ? Math.round((item.value / total) * 100) : 0);
            return (
              <div key={item.label} className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 transition-colors hover:border-white/20">
                <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-slate-200">{item.label}</span>
                </div>
                <span className="text-sm font-medium text-white">
                  {item.value.toLocaleString()} {singularize(unitLabel, item.value)} · {percentage}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
