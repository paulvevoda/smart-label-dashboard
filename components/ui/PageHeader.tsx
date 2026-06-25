import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
};

export default function PageHeader({ title, description, actions, className = "" }: PageHeaderProps) {
  return (
    <div className={`flex flex-col gap-3 rounded-[1.5rem] border border-white/10 bg-slate-900/70 px-6 py-5 shadow-2xl shadow-black/20 backdrop-blur sm:flex-row sm:items-end sm:justify-between ${className}`.trim()}>
      <div>
        <h2 className="text-2xl font-semibold text-white">{title}</h2>
        {description && <p className="mt-2 text-sm text-slate-400">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
