'use client';

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { initialDemoState } from "@/data/demoState";
import { applyDemoPreset, generateRandomDemoActivity, resetDemoState, simulateAlert, simulateBatteryWarning, simulateShipmentDelay } from "@/data/demoStateHelpers";
import type { Alert, DemoPresetName, DemoState, LogisticsAsset, LogisticsNode, TransitLane } from "@/data/types";

const DemoStateContext = createContext<{
  state: DemoState;
  setPreset: (preset: DemoPresetName) => void;
  setLabelSummary: (summary: Partial<Pick<DemoState, "activeSmartLabels" | "labelsReporting" | "offlineLabels">>) => void;
  addNode: (node: LogisticsNode) => void;
  updateNode: (nodeId: string, updates: Partial<LogisticsNode>) => void;
  setNodeLabels: (nodeId: string, labelsPresent: number) => void;
  toggleNodeAlert: (nodeId: string) => void;
  addLane: (lane: TransitLane) => void;
  setLaneRisk: (laneId: string, risk: DemoState["lanes"][number]["riskStatus"]) => void;
  assignAssetToLane: (assetId: string, laneId: string) => void;
  addAsset: (asset: LogisticsAsset) => void;
  updateAsset: (assetId: string, updates: Partial<LogisticsAsset>) => void;
  setAssetLocation: (assetId: string, location: LogisticsAsset["location"]) => void;
  setAssetBattery: (assetId: string, battery: LogisticsAsset["battery"]) => void;
  simulateAlert: (assetId: string, eventType: Alert["eventType"], severity: Alert["severity"]) => void;
  simulateBatteryWarning: (assetId: string) => void;
  simulateShipmentDelay: (laneId: string) => void;
  generateRandomActivity: () => void;
  clearActivityLog: () => void;
  resolveAlerts: () => void;
  reset: () => void;
  selectedItem: { kind: "node" | "asset" | "lane" | null; id: string | null };
  setSelectedItem: (value: { kind: "node" | "asset" | "lane" | null; id: string | null }) => void;
} | null>(null);

export function DemoStateProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DemoState>(initialDemoState);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("smart-label-demo-state");
    if (stored) {
      try {
        setState(JSON.parse(stored));
      } catch {
        setState(initialDemoState);
      }
    }
  }, []);
  const [selectedItem, setSelectedItem] = useState<{ kind: "node" | "asset" | "lane" | null; id: string | null }>({ kind: "asset", id: null });

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("smart-label-demo-state", JSON.stringify(state));
  }, [state]);

  const setPreset = (preset: DemoPresetName) => {
    setState((current) => applyDemoPreset(current, preset));
  };

  const setLabelSummary = (summary: Partial<Pick<DemoState, "activeSmartLabels" | "labelsReporting" | "offlineLabels">>) => {
    setState((current) => ({ ...current, ...summary }));
  };

  const addNode = (node: LogisticsNode) => {
    setState((current) => ({
      ...current,
      nodes: [...current.nodes, node],
      activityLog: [{ id: `act-${Date.now()}`, title: "Node added", detail: `${node.name} was added to the demo network`, timestamp: "just now" }, ...current.activityLog].slice(0, 8),
    }));
  };

  const updateNode = (nodeId: string, updates: Partial<LogisticsNode>) => {
    setState((current) => ({
      ...current,
      nodes: current.nodes.map((node) => (node.id === nodeId ? { ...node, ...updates } : node)),
    }));
  };

  const setNodeLabels = (nodeId: string, labelsPresent: number) => {
    setState((current) => ({
      ...current,
      nodes: current.nodes.map((node) => (node.id === nodeId ? { ...node, labelsPresent } : node)),
      activityLog: [{ id: `act-${Date.now()}`, title: "Node labels adjusted", detail: `${nodeId} labels updated to ${labelsPresent}`, timestamp: "just now" }, ...current.activityLog].slice(0, 8),
    }));
  };

  const toggleNodeAlert = (nodeId: string) => {
    setState((current) => ({
      ...current,
      nodes: current.nodes.map((node) => (node.id === nodeId ? { ...node, activeAlerts: node.activeAlerts > 0 ? 0 : 1 } : node)),
      activityLog: [{ id: `act-${Date.now()}`, title: "Node alert toggled", detail: `${nodeId} alert state flipped`, timestamp: "just now" }, ...current.activityLog].slice(0, 8),
    }));
  };

  const addLane = (lane: TransitLane) => {
    setState((current) => ({
      ...current,
      lanes: [...current.lanes, lane],
      activityLog: [{ id: `act-${Date.now()}`, title: "Lane added", detail: `${lane.corridor} was added to the network`, timestamp: "just now" }, ...current.activityLog].slice(0, 8),
    }));
  };

  const setLaneRisk = (laneId: string, risk: DemoState["lanes"][number]["riskStatus"]) => {
    setState((current) => ({
      ...current,
      lanes: current.lanes.map((lane) => (lane.id === laneId ? { ...lane, riskStatus: risk } : lane)),
      activityLog: [{ id: `act-${Date.now()}`, title: "Lane risk updated", detail: `${laneId} marked ${risk}`, timestamp: "just now" }, ...current.activityLog].slice(0, 8),
    }));
  };

  const assignAssetToLane = (assetId: string, laneId: string) => {
    setState((current) => ({
      ...current,
      assets: current.assets.map((asset) => (asset.id === assetId ? { ...asset, destination: laneId } : asset)),
      activityLog: [{ id: `act-${Date.now()}`, title: "Asset assigned to lane", detail: `${assetId} routed onto ${laneId}`, timestamp: "just now" }, ...current.activityLog].slice(0, 8),
    }));
  };

  const addAsset = (asset: LogisticsAsset) => {
    setState((current) => ({
      ...current,
      assets: [...current.assets, asset],
      activityLog: [{ id: `act-${Date.now()}`, title: "Asset added", detail: `${asset.id} was added to the demo network`, timestamp: "just now" }, ...current.activityLog].slice(0, 8),
    }));
  };

  const updateAsset = (assetId: string, updates: Partial<LogisticsAsset>) => {
    setState((current) => ({
      ...current,
      assets: current.assets.map((asset) => (asset.id === assetId ? { ...asset, ...updates } : asset)),
    }));
  };

  const setAssetLocation = (assetId: string, location: LogisticsAsset["location"]) => {
    setState((current) => ({
      ...current,
      assets: current.assets.map((asset) => (asset.id === assetId ? { ...asset, location } : asset)),
      activityLog: [{ id: `act-${Date.now()}`, title: "Asset moved", detail: `${assetId} repositioned to ${location.city}`, timestamp: "just now" }, ...current.activityLog].slice(0, 8),
    }));
  };

  const setAssetBattery = (assetId: string, battery: LogisticsAsset["battery"]) => {
    setState((current) => ({
      ...current,
      assets: current.assets.map((asset) => (asset.id === assetId ? { ...asset, battery } : asset)),
      activityLog: [{ id: `act-${Date.now()}`, title: "Battery updated", detail: `${assetId} battery profile changed`, timestamp: "just now" }, ...current.activityLog].slice(0, 8),
    }));
  };

  const handleSimulateAlert = (assetId: string, eventType: Alert["eventType"], severity: Alert["severity"]) => {
    setState((current) => simulateAlert(current, assetId, eventType, severity));
  };

  const handleSimulateBatteryWarning = (assetId: string) => {
    setState((current) => simulateBatteryWarning(current, assetId));
  };

  const handleSimulateShipmentDelay = (laneId: string) => {
    setState((current) => simulateShipmentDelay(current, laneId));
  };

  const handleGenerateRandomActivity = () => {
    setState((current) => generateRandomDemoActivity(current));
  };

  const clearActivityLog = () => {
    setState((current) => ({ ...current, activityLog: [] }));
  };

  const resolveAlerts = () => {
    setState((current) => ({
      ...current,
      alerts: current.alerts.map((alert) => ({ ...alert, status: "Resolved" as const })),
      sensorEvents: current.sensorEvents.map((event) => ({ ...event, status: "Resolved" as const })),
      nodes: current.nodes.map((node) => ({ ...node, activeAlerts: 0 })),
      activityLog: [{ id: `act-${Date.now()}`, title: "Alerts resolved", detail: "Active issues cleared from the demo stack", timestamp: "just now" }, ...current.activityLog].slice(0, 8),
    }));
  };

  const handleReset = () => {
    setState(resetDemoState());
  };

  const value = useMemo(() => ({
    state,
    setPreset,
    setLabelSummary,
    addNode,
    updateNode,
    setNodeLabels,
    toggleNodeAlert,
    addLane,
    setLaneRisk,
    assignAssetToLane,
    addAsset,
    updateAsset,
    setAssetLocation,
    setAssetBattery,
    simulateAlert: handleSimulateAlert,
    simulateBatteryWarning: handleSimulateBatteryWarning,
    simulateShipmentDelay: handleSimulateShipmentDelay,
    generateRandomActivity: handleGenerateRandomActivity,
    clearActivityLog,
    resolveAlerts,
    reset: handleReset,
    selectedItem,
    setSelectedItem,
  }), [state, selectedItem]);

  return <DemoStateContext.Provider value={value}>{children}</DemoStateContext.Provider>;
}

export function useDemoState() {
  const context = useContext(DemoStateContext);
  if (!context) throw new Error("useDemoState must be used within DemoStateProvider");
  return context;
}
