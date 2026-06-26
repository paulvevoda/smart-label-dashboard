import Card from "@/components/ui/Card";
import StatusBadge from "@/components/ui/StatusBadge";
import type { UserAccount } from "@/data/types";

type UserManagementSettingsProps = {
  users: UserAccount[];
};

export default function UserManagementSettings({ users }: UserManagementSettingsProps) {
  return (
    <Card title="User management" description="Preview of roles and access levels for the demo tenant">
      <div className="space-y-3">
        {users.map((user) => (
          <div key={user.name} className="flex flex-col gap-3 rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-base font-semibold text-white">{user.name}</p>
              <p className="mt-1 text-sm text-slate-400">{user.role}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-white/10 bg-slate-900/70 px-3 py-1 text-sm text-slate-300">{user.accessLevel}</span>
              <StatusBadge label={user.status} tone={user.status === "Active" ? "active" : "offline"} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
