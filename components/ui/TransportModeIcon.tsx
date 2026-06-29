import type { TransportMode } from "@/data/types";

type TransportModeIconProps = {
  mode: TransportMode;
  className?: string;
};

const modeLabel: Record<TransportMode, string> = {
  truck: "Truck",
  rail: "Rail",
  air: "Air",
  vessel: "Vessel",
};

export default function TransportModeIcon({ mode, className }: TransportModeIconProps) {
  const baseClass = className ?? "h-4 w-4";

  if (mode === "rail") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={baseClass}>
        <path fill="currentColor" d="M5 4h14c1.1 0 2 .9 2 2v7c0 1.3-.8 2.5-2 3l1.5 2v1h-2.4l-1.6-2h-9.1l-1.6 2H3.4v-1L5 16c-1.2-.5-2-1.7-2-3V6c0-1.1.9-2 2-2zm0 4v3h14V8H5zm3 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm8 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
      </svg>
    );
  }

  if (mode === "vessel") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={baseClass}>
        <path fill="currentColor" d="M3 15.8h18c0 2.6-2.2 4.2-4.4 4.2-1.2 0-2.2-.4-3.1-1.2-.9.8-2 1.2-3.2 1.2-1.2 0-2.3-.4-3.2-1.2-.9.8-1.9 1.2-3.1 1.2C5.2 20 3 18.4 3 15.8zm3.1-1.6L7.8 8h8.4l1.7 6.2H6.1zM10 5h4.4c.7 0 1.3.6 1.3 1.3V7H8.7V6.3C8.7 5.6 9.3 5 10 5z" />
      </svg>
    );
  }

  if (mode === "air") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={baseClass}>
        <rect fill="currentColor" x="11.2" y="3.4" width="1.6" height="3.2" rx="0.8" />
        <rect fill="currentColor" x="4.2" y="10.3" width="15.6" height="2.2" rx="1.1" />
        <ellipse fill="currentColor" cx="12" cy="14.4" rx="2.2" ry="3" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={baseClass}>
      <path fill="currentColor" d="M3 7h11v7h1.6c.7 0 1.3.3 1.7.8l2.7 3.2V21h-1.8a2.7 2.7 0 0 1-5.4 0H9.2a2.7 2.7 0 0 1-5.4 0H2v-3h1V7zm12 2v5h4.2l-2-2.4c-.2-.4-.6-.6-1-.6H15zM6.5 20a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4zm9 0a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4z" />
    </svg>
  );
}

export const getTransportModeLabel = (mode: TransportMode) => modeLabel[mode];
