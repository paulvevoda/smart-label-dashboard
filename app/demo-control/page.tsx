"use client";

import dynamic from "next/dynamic";
import AppShell from "@/components/AppShell";
import DemoActivityLog from "@/components/DemoActivityLog";
import DemoAlertControls from "@/components/DemoAlertControls";
import DemoAssetControls from "@/components/DemoAssetControls";
import DemoNetworkControls from "@/components/DemoNetworkControls";
import DemoNodeControls from "@/components/DemoNodeControls";
import DemoScenarioSummary from "@/components/DemoScenarioSummary";
import DemoTransitLaneControls from "@/components/DemoTransitLaneControls";
import PageHeader from "@/components/ui/PageHeader";
import { useDemoState } from "@/context/DemoStateContext";

const DemoNetworkMap = dynamic(() => import("@/components/DemoNetworkMap"), { ssr: false });

export default function DemoControlPage() {
  const {
    state,
    setPreset,
    setLabelSummary,
    addNode,
    setNodeLabels,
    toggleNodeAlert,
    addLane,
    setLaneRisk,
    addAsset,
    setAssetLocation,
    setAssetBattery,
    simulateAlert,
    simulateBatteryWarning,
    simulateShipmentDelay,
    generateRandomActivity,
    clearActivityLog,
    resolveAlerts,
    reset,
  } = useDemoState();

  return (
    <AppShell title="Investor Demo Control Panel" description="Control the simulated Smart Label logistics network for live investor demonstrations.">
      <div className="space-y-6">
        <PageHeader
          title="Investor Demo Control Panel"
          description="Control the simulated Smart Label logistics network for live investor demonstrations."
          actions={<span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-200">Simulated Demo Mode</span>}
        />

        <DemoScenarioSummary state={state} />
        <DemoNetworkControls
          state={state}
          onPreset={setPreset}
          onLabelCountChange={(value) => setLabelSummary({ activeSmartLabels: value })}
          onReportingChange={(value) => setLabelSummary({ labelsReporting: value })}
          onOfflineChange={(value) => setLabelSummary({ offlineLabels: value })}
          onClearActivity={clearActivityLog}
        />
        <DemoNetworkMap />
        <DemoNodeControls state={state} onAddNode={addNode} onSetNodeLabels={setNodeLabels} onToggleNodeAlert={toggleNodeAlert} />
        <DemoTransitLaneControls state={state} onAddLane={addLane} onSetLaneRisk={setLaneRisk} onSimulateDelay={simulateShipmentDelay} />
        <DemoAssetControls state={state} onAddAsset={addAsset} onSetAssetLocation={setAssetLocation} onSetAssetBattery={setAssetBattery} onSimulateAlert={(assetId) => simulateAlert(assetId, "Temperature Alert", "Warning")} onSimulateBatteryWarning={simulateBatteryWarning} />
        <DemoAlertControls state={state} onSimulateAlert={simulateAlert} onGenerateRandomActivity={generateRandomActivity} onReset={reset} onResolve={resolveAlerts} />
        <DemoActivityLog state={state} />
      </div>
    </AppShell>
  );
}
