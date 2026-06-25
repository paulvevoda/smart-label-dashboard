import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export default function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-slate-950/60 p-8 text-center shadow-inner shadow-black/20">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      {description && <p className="mt-2 text-sm text-slate-400">{description}</p>}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}
