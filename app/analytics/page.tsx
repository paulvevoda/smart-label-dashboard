"use client";

import AppShell from "@/components/AppShell";
import ActiveAlertsPanel from "@/components/ActiveAlertsPanel";
import AlertTrendBreakdown from "@/components/AlertTrendBreakdown";
import AnalyticsInsightsPanel from "@/components/AnalyticsInsightsPanel";
import AnalyticsSummaryCards from "@/components/AnalyticsSummaryCards";
import AssetRiskRanking from "@/components/AssetRiskRanking";
import BatteryUtilizationAnalytics from "@/components/BatteryUtilizationAnalytics";
import LabelUtilizationAnalytics from "@/components/LabelUtilizationAnalytics";
import LaneRiskAnalytics from "@/components/LaneRiskAnalytics";
import LossPreventionCard from "@/components/LossPreventionCard";
import ResponseMetricsPanel from "@/components/ResponseMetricsPanel";
import SeverityBreakdown from "@/components/SeverityBreakdown";
import ShipmentActivityAnalytics from "@/components/ShipmentActivityAnalytics";
import ShipmentPerformanceAnalytics from "@/components/ShipmentPerformanceAnalytics";
import PageHeader from "@/components/ui/PageHeader";
import { useDemoState } from "@/context/DemoStateContext";
import { mockData } from "@/data";
import {
  getAlertCountsByType,
  getAnalyticsInsights,
  getAnalyticsSummary,
  getAssetRiskRanking,
  getBatteryBreakdown,
  getLaneRiskSummary,
  getLabelUtilizationSummary,
  getLossPreventionEstimate,
  getResponseMetrics,
  getSeverityBreakdown,
  getShipmentActivityBreakdown,
  getShipmentPerformanceBreakdown,
} from "@/data";

export default function AnalyticsPage() {
  const { state } = useDemoState();
  const summary = { ...getAnalyticsSummary(), activeAlerts: state.alerts.filter((alert) => alert.status === "Active").length };
  const shipmentPerformance = getShipmentPerformanceBreakdown();
  const shipmentActivity = getShipmentActivityBreakdown();
  const alertTrends = getAlertCountsByType();
  const severityBreakdown = getSeverityBreakdown();
  const batteryBreakdown = getBatteryBreakdown();
  const labelUtilization = getLabelUtilizationSummary();
  const assetRiskRanking = getAssetRiskRanking();
  const laneRiskSummary = getLaneRiskSummary();
  const responseMetrics = getResponseMetrics();
  const lossPrevention = getLossPreventionEstimate();
  const insights = getAnalyticsInsights();

  return (
    <AppShell title="Analytics" description="Executive insight into shipment performance, alert trends, label utilization, carrier risk, and estimated loss prevention.">
      <div className="space-y-6">
        <PageHeader
          title="Analytics"
          description="Executive insight into shipment performance, alert trends, label utilization, carrier risk, and estimated loss prevention."
          actions={<span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-200">Simulated demo data</span>}
        />

        <AnalyticsSummaryCards summary={summary} />
        <ShipmentPerformanceAnalytics breakdown={shipmentPerformance} />
        <ShipmentActivityAnalytics breakdown={shipmentActivity} />
        <AlertTrendBreakdown categories={alertTrends} />
        <SeverityBreakdown items={severityBreakdown} />
        <BatteryUtilizationAnalytics items={batteryBreakdown} />
        <LabelUtilizationAnalytics summary={labelUtilization} />
        <AssetRiskRanking items={assetRiskRanking} />
        <LaneRiskAnalytics lanes={laneRiskSummary} />
        <ResponseMetricsPanel metrics={responseMetrics} />
        <LossPreventionCard estimate={lossPrevention} />
        <AnalyticsInsightsPanel insights={insights} />
        <ActiveAlertsPanel alerts={state.alerts} />
      </div>
    </AppShell>
  );
}
