type DonutItem = {
  label: string;
  value: number;
  color: string;
};

type DonutPlaceholderProps = {
  title: string;
  items: DonutItem[];
};

export default function DonutPlaceholder({ title, items }: DonutPlaceholderProps) {
  const total = items.reduce((sum, item) => sum + item.value, 0);
  const gradient = items
    .map((item, index) => {
      const start = index === 0 ? 0 : items.slice(0, index).reduce((sum, current) => sum + current.value, 0) / total * 100;
      const end = items.slice(0, index + 1).reduce((sum, current) => sum + current.value, 0) / total * 100;
      return `${item.color} ${start}% ${end}%`;
    })
    .join(", ");

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-black/20">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <span className="text-sm text-slate-400">Live snapshot</span>
      </div>

      <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-center">
        <div
          className="mx-auto h-36 w-36 rounded-full border border-white/10"
          style={{ background: `conic-gradient(${gradient})` }}
        />

        <div className="flex-1 space-y-3">
          {items.map((item) => (
            <div key={item.label} className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-slate-300">{item.label}</span>
              </div>
              <span className="text-sm font-medium text-white">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
