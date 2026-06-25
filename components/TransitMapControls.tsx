type TransitMapControlsProps = {
  search: string;
  setSearch: (value: string) => void;
  filter: string;
  setFilter: (value: string) => void;
  criticalOnly: boolean;
  setCriticalOnly: (value: boolean) => void;
};

const assetTypeFilters = ["All", "Distribution Centers", "Trailers", "Trucks", "Containers", "Rail Cars"];

export default function TransitMapControls({
  search,
  setSearch,
  filter,
  setFilter,
  criticalOnly,
  setCriticalOnly,
}: TransitMapControlsProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-4 shadow-2xl shadow-black/20">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1">
          <label htmlFor="asset-search" className="mb-2 block text-sm text-slate-400">
            Search assets
          </label>
          <input
            id="asset-search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Asset ID, label ID, customer, city, or node"
            className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none ring-0 placeholder:text-slate-500"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {assetTypeFilters.map((option) => {
            const normalized = option === "All" ? "All" : option.replace(/s$/, "");
            const isActive = filter === normalized;

            return (
              <button
                key={option}
                type="button"
                onClick={() => setFilter(normalized)}
                className={`rounded-full px-3 py-2 text-sm transition ${
                  isActive
                    ? "bg-cyan-500/15 text-cyan-200 ring-1 ring-cyan-400/30"
                    : "bg-slate-950/70 text-slate-300 hover:bg-white/5"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={() => setCriticalOnly(!criticalOnly)}
          className={`rounded-full px-3 py-2 text-sm transition ${
            criticalOnly
              ? "bg-rose-500/15 text-rose-200 ring-1 ring-rose-400/30"
              : "bg-slate-950/70 text-slate-300 hover:bg-white/5"
          }`}
        >
          {criticalOnly ? "Showing critical only" : "Show critical only"}
        </button>
      </div>
    </div>
  );
}
