export type SensorTripKind = "temperature" | "shock" | "packageRemoved" | "battery" | "delay" | "route";

export type SensorTripMeta = {
  symbol: string;
  label: string;
  textColor: string;
  borderColor: string;
};

export const SENSOR_TRIP_META: Record<SensorTripKind, SensorTripMeta> = {
  temperature: {
    symbol: "T",
    label: "Temperature / humidity",
    textColor: "#67e8f9",
    borderColor: "rgba(34, 211, 238, 0.35)",
  },
  shock: {
    symbol: "S",
    label: "Shock / impact",
    textColor: "#fbbf24",
    borderColor: "rgba(251, 191, 36, 0.35)",
  },
  packageRemoved: {
    symbol: "P",
    label: "Package removed / tamper",
    textColor: "#fb7185",
    borderColor: "rgba(251, 113, 133, 0.35)",
  },
  battery: {
    symbol: "B",
    label: "Battery",
    textColor: "#fbbf24",
    borderColor: "rgba(251, 191, 36, 0.35)",
  },
  delay: {
    symbol: "D",
    label: "Delay / hold",
    textColor: "#c4b5fd",
    borderColor: "rgba(196, 181, 253, 0.35)",
  },
  route: {
    symbol: "R",
    label: "Route deviation",
    textColor: "#67e8f9",
    borderColor: "rgba(34, 211, 238, 0.35)",
  },
};

export const SENSOR_TRIP_ORDER: SensorTripKind[] = [
  "temperature",
  "shock",
  "packageRemoved",
  "battery",
  "delay",
  "route",
];

export const resolveSensorTripKindFromEvents = (events: string[]): SensorTripKind | null => {
  const eventText = events.join(" ").toLowerCase();

  if (eventText.includes("temperature") || eventText.includes("humidity")) return "temperature";
  if (eventText.includes("package removed") || eventText.includes("tamper")) return "packageRemoved";
  if (eventText.includes("shock") || eventText.includes("impact")) return "shock";
  if (eventText.includes("battery")) return "battery";
  if (eventText.includes("delay") || eventText.includes("hold")) return "delay";
  if (eventText.includes("deviat") || eventText.includes("route")) return "route";

  return null;
};
