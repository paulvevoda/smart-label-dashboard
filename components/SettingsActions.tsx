import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

type SettingsActionsProps = {
  onSave?: () => void;
  onReset?: () => void;
  feedback?: string;
};

export default function SettingsActions({ onSave, onReset, feedback }: SettingsActionsProps) {
  return (
    <Card title="Actions" description="Demo-only configuration controls for the investor walkthrough">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="primary" onClick={onSave}>Save Changes</Button>
        <Button variant="secondary" onClick={onReset}>Reset to Demo Defaults</Button>
        {feedback && <span className="text-sm text-slate-400">{feedback}</span>}
      </div>
    </Card>
  );
}
