const activityItems = [
  { title: "Temperature Alert", detail: "Cold chain threshold exceeded in Corridor 3", time: "2 min ago" },
  { title: "Humidity Alert", detail: "Humidity spike detected near distribution hub", time: "8 min ago" },
  { title: "Shock Detected", detail: "Package handling anomaly recorded", time: "12 min ago" },
  { title: "Light Exposure", detail: "Sensitive cargo exposed during transit", time: "19 min ago" },
  { title: "Tamper Detected", detail: "Seal integrity compromised on one pallet", time: "24 min ago" },
];

export default function RecentActivityFeed() {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-black/20">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Recent Activity Feed</h3>
        <span className="text-sm text-slate-400">Live timeline</span>
      </div>

      <div className="mt-6 space-y-4">
        {activityItems.map((item) => (
          <div key={item.title} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-white">{item.title}</p>
              <span className="text-xs text-slate-500">{item.time}</span>
            </div>
            <p className="mt-2 text-sm text-slate-400">{item.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
