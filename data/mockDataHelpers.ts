import type { LogisticsAsset, RiskStatus } from "./types";

export const getRiskStatus = (negativeAlerts: number, labelsPresent: number): RiskStatus => {
  if (labelsPresent <= 0) return "Normal";
  const rate = negativeAlerts / labelsPresent;

  if (rate > 0.08) return "Critical";
  if (rate > 0.02) return "Warning";
  return "Normal";
};

export const enrichAssetsWithRisk = (assets: LogisticsAsset[]): LogisticsAsset[] => {
  return assets.map((asset) => ({
    ...asset,
    negativeAlertRate: asset.labelsPresent > 0 ? asset.negativeAlerts24h / asset.labelsPresent : 0,
    riskStatus: getRiskStatus(asset.negativeAlerts24h, asset.labelsPresent),
  }));
};

export const getRiskColor = (riskStatus: RiskStatus) => {
  switch (riskStatus) {
    case "Critical":
      return "#fb7185";
    case "Warning":
      return "#f59e0b";
    default:
      return "#22d3ee";
  }
};
