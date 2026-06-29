"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";
import ApiSettingsCard from "@/components/ApiSettingsCard";
import BillingSettingsCard from "@/components/BillingSettingsCard";
import CompanySettingsCard from "@/components/CompanySettingsCard";
import IntegrationSettings from "@/components/IntegrationSettings";
import NotificationRulesSettings from "@/components/NotificationRulesSettings";
import SensorThresholdSettings from "@/components/SensorThresholdSettings";
import SettingsActions from "@/components/SettingsActions";
import UserManagementSettings from "@/components/UserManagementSettings";
import PageHeader from "@/components/ui/PageHeader";
import { useDemoState } from "@/context/DemoStateContext";
import { mockData } from "@/data";

export default function SettingsPage() {
  const [feedback, setFeedback] = useState("");
  const { state, setSensorThresholds, resetSensorThresholds } = useDemoState();

  return (
    <AppShell title="Settings" description="Configure company preferences, alert thresholds, notification rules, integrations, and platform access.">
      <div className="space-y-6">
        <PageHeader title="Settings" description="Configure company preferences, alert thresholds, notification rules, integrations, and platform access." actions={<span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-200">Demo Configuration</span>} />

        <CompanySettingsCard settings={mockData.settings.company} />
        <NotificationRulesSettings rules={mockData.settings.notificationRules} />
        <SensorThresholdSettings
          thresholds={state.sensorThresholds}
          onThresholdChange={(updates) => {
            setSensorThresholds(updates);
            setFeedback("Sensor thresholds updated across shipments, map events, and badges.");
          }}
          onResetThresholds={() => {
            resetSensorThresholds();
            setFeedback("Sensor thresholds restored to demo defaults.");
          }}
        />
        <UserManagementSettings users={mockData.settings.users} />
        <IntegrationSettings integrations={mockData.settings.integrations} />
        <ApiSettingsCard settings={mockData.settings.api} />
        <BillingSettingsCard settings={mockData.settings.billing} />
        <SettingsActions
          onSave={() => setFeedback("Demo settings saved locally.")}
          onReset={() => {
            resetSensorThresholds();
            setFeedback("Demo settings reset to defaults.");
          }}
          feedback={feedback}
        />
      </div>
    </AppShell>
  );
}
