"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";
import DemoActivityLog from "@/components/DemoActivityLog";
import DemoAlertControls from "@/components/DemoAlertControls";
import DemoAssetControls from "@/components/DemoAssetControls";
import DemoNetworkControls from "@/components/DemoNetworkControls";
import DemoNodeControls from "@/components/DemoNodeControls";
import DemoScenarioSummary from "@/components/DemoScenarioSummary";
import DemoTransitLaneControls from "@/components/DemoTransitLaneControls";
import TransitMapClient from "@/components/TransitMapClient";
import PageHeader from "@/components/ui/PageHeader";
import { useDemoState } from "@/context/DemoStateContext";

export default function DemoControlPage() {
  const [feedback, setFeedback] = useState("Scenario presets and live controls update the shared demo state across the investor workspace.");
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

  const handlePreset = (preset: Parameters<typeof setPreset>[0]) => {
    setPreset(preset);
    setFeedback(`${preset} preset applied. ${state.activeSmartLabels.toLocaleString()} labels and network posture updated.`);
  };

  const handleLabelSummary = (summary: Parameters<typeof setLabelSummary>[0]) => {
    setLabelSummary(summary);
    setFeedback("Label posture updated for the current walkthrough.");
  };

  return (
    <AppShell title="Investor Demo Control Panel" description="Control the simulated Smart Label logistics network for live investor demonstrations.">
      <div className="space-y-6">
        <PageHeader
          title="Investor Demo Control Panel"
          description="Control the simulated Smart Label logistics network for live investor demonstrations."
          actions={<span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-200">Simulated Demo Mode</span>}
        />

        <div className="rounded-[1.5rem] border border-cyan-400/20 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-100">
          {feedback}
        </div>

        <DemoScenarioSummary state={state} />
        <DemoNetworkControls
          state={state}
          onPreset={handlePreset}
          onLabelCountChange={(value) => handleLabelSummary({ activeSmartLabels: value })}
          onReportingChange={(value) => handleLabelSummary({ labelsReporting: value })}
          onOfflineChange={(value) => handleLabelSummary({ offlineLabels: value })}
          onClearActivity={() => {
            clearActivityLog();
            setFeedback("Activity log cleared for the next demo beat.");
          }}
        />
        <section className="rounded-[1.5rem] border border-white/10 bg-slate-900/70 p-4 shadow-2xl shadow-black/20">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-semibold text-white">Live shipment map</h2>
              <p className="text-sm text-slate-400">Map reflects demo-control changes in real time.</p>
            </div>
            <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-200">Shared transit state</span>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-2">
            <TransitMapClient />
          </div>
        </section>
        <DemoNodeControls state={state} onAddNode={addNode} onSetNodeLabels={setNodeLabels} onToggleNodeAlert={toggleNodeAlert} />
        <DemoTransitLaneControls state={state} onAddLane={addLane} onSetLaneRisk={setLaneRisk} onSimulateDelay={simulateShipmentDelay} />
        <DemoAssetControls state={state} onAddAsset={addAsset} onSetAssetLocation={setAssetLocation} onSetAssetBattery={setAssetBattery} onSimulateAlert={(assetId) => simulateAlert(assetId, "Temperature Alert", "Warning")} onSimulateBatteryWarning={simulateBatteryWarning} />
        <DemoAlertControls state={state} onSimulateAlert={(assetId, eventType, severity) => {
          simulateAlert(assetId, eventType, severity);
          setFeedback(`${eventType} simulated for the active demo scenario.`);
        }} onGenerateRandomActivity={() => {
          generateRandomActivity();
          setFeedback("A random activity event was generated for the walkthrough.");
        }} onReset={() => {
          reset();
          setFeedback("Demo state reset to the default network.");
        }} onResolve={() => {
          resolveAlerts();
          setFeedback("Active alerts were resolved for the next presentation beat.");
        }} />
        <DemoActivityLog state={state} />
      </div>
    </AppShell>
  );
}
