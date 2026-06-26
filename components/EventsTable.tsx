import Link from "next/link";
import { useMemo, useState, type KeyboardEvent } from "react";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import RiskBadge from "@/components/ui/RiskBadge";
import StatusBadge from "@/components/ui/StatusBadge";
import TableShell from "@/components/ui/TableShell";
import type { AlertSeverity, AlertStatus, SensorEventType } from "@/data/types";

type EventRow = {
  id: string;
  timestamp: string;
  labelId: string;
  shipmentId: string;
  assetId: string;
  eventType: SensorEventType;
  severity: AlertSeverity;
  status: AlertStatus;
  description: string;
  customer?: string;
  currentLocation?: string;
  recommendedAction?: string;
};

type EventsTableProps = {
  events: EventRow[];
  filters: string;
};

const toEventTypeLabel = (event: EventRow) => event.eventType;

export default function EventsTable({ events, filters }: EventsTableProps) {
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

  const rows = useMemo(() => events, [events]);

  if (rows.length === 0) {
    return <EmptyState title="No events match the current filters" description="Try widening the search, switching to a broader filter, or clearing the active selection to resume the walkthrough." />;
  }

  const toggleExpanded = (eventId: string) => {
    setExpandedEventId((current) => (current === eventId ? null : eventId));
  };

  const handleRowKeyDown = (event: KeyboardEvent<HTMLTableRowElement>, eventId: string) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleExpanded(eventId);
    }
  };

  return (
    <Card title="Event timeline" description="Recent sensor and alert activity across the Smart Label network">
      <div className="overflow-x-auto">
        <TableShell headers={["Timestamp", "Event Type", "Severity", "Status", "Smart Label", "Shipment", "Asset", "Customer", "Current Location", "Recommended Action"]}>
          {rows.map((event) => {
            const isExpanded = expandedEventId === event.id;
            const severityTone = event.severity === "Critical" ? "critical" : event.severity === "Warning" ? "warning" : "normal";
            const statusTone = event.status === "Active" ? "active" : "resolved";

            return (
              <div key={event.id} className="contents">
                <tr className="cursor-pointer transition hover:bg-white/5" onClick={() => toggleExpanded(event.id)} onKeyDown={(rowEvent) => handleRowKeyDown(rowEvent, event.id)} tabIndex={0} aria-expanded={isExpanded} aria-controls={`event-detail-${event.id}`}>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-300">{event.timestamp}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-200">{toEventTypeLabel(event)}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-200">
                    <RiskBadge level={event.severity as "Normal" | "Warning" | "Critical"} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-200">
                    <StatusBadge label={event.status} tone={statusTone as "active" | "resolved"} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-300">{event.labelId}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-300">
                    <Link href={`/shipments/${event.shipmentId}`} className="text-cyan-300 transition hover:text-cyan-200">
                      {event.shipmentId}
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-300">{event.assetId}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-300">{event.customer ?? "—"}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-300">{event.currentLocation ?? "—"}</td>
                  <td className="max-w-[220px] px-4 py-3 text-sm text-slate-400">
                    {event.recommendedAction ?? event.description}
                  </td>
                </tr>
                {isExpanded && (
                  <tr id={`event-detail-${event.id}`} className="bg-slate-950/80">
                    <td colSpan={10} className="px-4 py-4">
                      <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                        <p className="text-sm font-semibold text-white">Event detail</p>
                        <div className="mt-3 grid gap-3 md:grid-cols-2">
                          <div>
                            <p className="text-sm text-slate-400">Description</p>
                            <p className="mt-1 text-sm text-slate-300">{event.description}</p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-400">Recommended action</p>
                            <p className="mt-1 text-sm text-slate-300">{event.recommendedAction ?? "Review with operations team"}</p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-400">Related label</p>
                            <p className="mt-1 text-sm text-slate-300">{event.labelId}</p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-400">Related shipment</p>
                            <p className="mt-1 text-sm text-slate-300">{event.shipmentId}</p>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </div>
            );
          })}
        </TableShell>
      </div>
    </Card>
  );
}
