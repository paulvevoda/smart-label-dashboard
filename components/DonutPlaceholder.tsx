type DonutItem = {
  label: string;
  value: number;
  color: string;
  percentage?: number;
};

type DonutPlaceholderProps = {
  title: string;
  subtitle: string;
  items: DonutItem[];
};

export default function DonutPlaceholder({ title, subtitle, items }: DonutPlaceholderProps) {
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
      };
    });

  return (
    <div className="flex h-full min-w-0 flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-black/20 transition-colors hover:border-cyan-400/20">
      <div>
        <h3 className="text-lg font-semibold leading-tight text-white">{title}</h3>
        <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
      </div>

      <div className="mt-6 flex flex-1 min-w-0 flex-col gap-5">
        <div className="mx-auto">
          <div className="relative h-32 w-32 sm:h-[8.5rem] sm:w-[8.5rem]">
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
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
              <p className="text-[0.62rem] font-medium uppercase tracking-[0.24em] text-slate-500">Total</p>
              <p className="mt-1 text-2xl font-semibold leading-none text-white tabular-nums">{total.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="w-full min-w-0 space-y-3">
          {total === 0 && (
            <div className="rounded-xl border border-dashed border-white/15 bg-slate-950/40 px-4 py-6 text-sm text-slate-400">
              No telemetry is available for this chart yet.
            </div>
          )}
          {items.map((item) => {
            const percentage = item.percentage ?? (total > 0 ? Math.round((item.value / total) * 100) : 0);
            return (
              <div key={item.label} className="box-border grid w-full min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 transition-colors hover:border-white/20">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="min-w-0 text-sm font-medium text-slate-200">{item.label}</span>
                </div>
                <span className="shrink-0 whitespace-nowrap text-sm font-medium text-white tabular-nums">
                  {item.value.toLocaleString()} · {percentage}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
