import Button from "@/components/ui/Button";

type EventsControlsProps = {
  search: string;
  setSearch: (value: string) => void;
  filter: string;
  setFilter: (value: string) => void;
  sortBy: "timestamp" | "severity" | "status" | "eventType" | "customer";
  setSortBy: (value: "timestamp" | "severity" | "status" | "eventType" | "customer") => void;
  sortDirection: "asc" | "desc";
  setSortDirection: (value: "asc" | "desc") => void;
};

const filterOptions = [
  "All Events",
  "Active",
  "Resolved",
  "Warning",
  "Critical",
  "Temperature",
  "Humidity",
  "Shock",
  "Light",
  "Tamper",
  "Battery",
  "Offline",
];

export default function EventsControls({
  search,
  setSearch,
  filter,
  setFilter,
  sortBy,
  setSortBy,
  sortDirection,
  setSortDirection,
}: EventsControlsProps) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/70 p-4 shadow-2xl shadow-black/20">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex-1">
          <label htmlFor="event-search" className="mb-2 block text-sm text-slate-400">
            Search events
          </label>
          <input
            id="event-search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Event ID, label ID, shipment ID, asset ID, customer, location, or type"
            className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div>
            <label className="mb-2 block text-sm text-slate-400">Sort by</label>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as EventsControlsProps["sortBy"])}
              className="rounded-2xl border border-white/10 bg-slate-950/80 px-3 py-2 text-sm text-white"
            >
              <option value="timestamp">Timestamp</option>
              <option value="severity">Severity</option>
              <option value="status">Status</option>
              <option value="eventType">Event Type</option>
              <option value="customer">Customer</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-400">Direction</label>
            <Button variant="secondary" onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}>
              {sortDirection === "asc" ? "Ascending" : "Descending"}
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {filterOptions.map((option) => {
          const isActive = filter === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => setFilter(option)}
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
  );
}
