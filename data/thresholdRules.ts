import type { AlertSeverity, SensorEventType, SensorThresholds } from "@/data/types";

export const DEFAULT_SENSOR_THRESHOLDS: SensorThresholds = {
  temperatureWarningC: 8,
  temperatureExceptionC: 10,
  humidityWarningPct: 65,
  humidityExceptionPct: 75,
  shockWarningG: 5,
  shockExceptionG: 8,
  packageRemovedWarningHours: 4,
  packageRemovedExceptionHours: 8,
  routeDeviationWarningMiles: 12,
  routeDeviationExceptionMiles: 25,
  arrivalVarianceWarningMinutes: 30,
  arrivalVarianceExceptionMinutes: 60,
  batteryWarningPct: 30,
  batteryExceptionPct: 10,
  warningRatePct: 5,
  exceptionRatePct: 5,
};

export const getRiskStatusFromRate = (rate: number, thresholds: SensorThresholds) => {
  const percentage = rate * 100;
  if (percentage >= thresholds.exceptionRatePct) return "Critical" as const;
  if (percentage > 0 && percentage < thresholds.warningRatePct) return "Warning" as const;
  return "Normal" as const;
};

const getDemoEventMeasurement = (eventType: SensorEventType) => {
  switch (eventType) {
    case "Temperature Alert":
      return 9.2;
    case "Humidity Alert":
      return 68;
    case "Shock Detected":
      return 6.1;
    case "Package Removed":
      return 5;
    case "Tamper Detected":
      return 1;
    case "Battery Warning":
      return 24;
    case "Label Offline":
      return 1;
    default:
      return null;
  }
};

export const getSeverityFromThresholds = (eventType: SensorEventType, thresholds: SensorThresholds): AlertSeverity => {
  const measured = getDemoEventMeasurement(eventType);

  if (eventType === "Tamper Detected" || eventType === "Label Offline") return "Critical";
  if (measured === null) return "Normal";

  if (eventType === "Temperature Alert") {
    if (measured >= thresholds.temperatureExceptionC) return "Critical";
    if (measured >= thresholds.temperatureWarningC) return "Warning";
    return "Normal";
  }

  if (eventType === "Humidity Alert") {
    if (measured >= thresholds.humidityExceptionPct) return "Critical";
    if (measured >= thresholds.humidityWarningPct) return "Warning";
    return "Normal";
  }

  if (eventType === "Shock Detected") {
    if (measured >= thresholds.shockExceptionG) return "Critical";
    if (measured >= thresholds.shockWarningG) return "Warning";
    return "Normal";
  }

  if (eventType === "Package Removed") {
    if (measured >= thresholds.packageRemovedExceptionHours) return "Critical";
    if (measured >= thresholds.packageRemovedWarningHours) return "Warning";
    return "Normal";
  }

  if (eventType === "Battery Warning") {
    if (measured <= thresholds.batteryExceptionPct) return "Critical";
    if (measured <= thresholds.batteryWarningPct) return "Warning";
    return "Normal";
  }

  return "Normal";
};

export const getThresholdDisplay = (thresholds: SensorThresholds) => ({
  temperature: `${thresholds.temperatureWarningC}C / ${thresholds.temperatureExceptionC}C`,
  humidity: `${thresholds.humidityWarningPct}% / ${thresholds.humidityExceptionPct}%`,
  shock: `${thresholds.shockWarningG}g / ${thresholds.shockExceptionG}g`,
  packageRemoved: `${thresholds.packageRemovedWarningHours}h / ${thresholds.packageRemovedExceptionHours}h`,
  routeDeviation: `${thresholds.routeDeviationWarningMiles}mi / ${thresholds.routeDeviationExceptionMiles}mi`,
  arrivalVariance: `${thresholds.arrivalVarianceWarningMinutes}m / ${thresholds.arrivalVarianceExceptionMinutes}m`,
  battery: `${thresholds.batteryWarningPct}% / ${thresholds.batteryExceptionPct}%`,
});
