import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export default function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="mx-auto max-w-2xl rounded-[1.5rem] border border-dashed border-cyan-400/20 bg-slate-950/70 p-8 text-center shadow-inner shadow-black/20">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-500/10 text-xl text-cyan-200">
        •
      </div>
      <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
      {description && <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}
