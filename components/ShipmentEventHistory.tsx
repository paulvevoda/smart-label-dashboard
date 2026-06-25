import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import RiskBadge from "@/components/ui/RiskBadge";
import StatusBadge from "@/components/ui/StatusBadge";
import TableShell from "@/components/ui/TableShell";
import type { Alert, SensorEvent } from "@/data/types";

type ShipmentEventHistoryProps = {
  events: Array<Alert | SensorEvent>;
};

export default function ShipmentEventHistory({ events }: ShipmentEventHistoryProps) {
  if (events.length === 0) {
    return <EmptyState title="No shipment events recorded" description="The current mock dataset does not contain shipment-level events for this route." />;
  }

  return (
    <Card title="Event history" description="Recent operational events tied to the shipment">
      <div className="overflow-x-auto">
        <TableShell headers={["Timestamp", "Event Type", "Severity", "Status", "Label", "Location", "Details"]}>
          {events.map((event) => (
            <tr key={event.id}>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-300">{event.timestamp}</td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-200">{event.eventType}</td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-200">
                <RiskBadge level={event.severity as "Normal" | "Warning" | "Critical"} />
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-200">
                <StatusBadge label={event.status} tone={event.status === "Active" ? "active" : "resolved"} />
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-300">{event.labelId}</td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-300">{"currentLocation" in event ? event.currentLocation : "—"}</td>
              <td className="max-w-[220px] px-4 py-3 text-sm text-slate-400">{"recommendedAction" in event ? event.recommendedAction : event.description}</td>
            </tr>
          ))}
        </TableShell>
      </div>
    </Card>
  );
}
