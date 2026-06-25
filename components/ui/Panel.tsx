import type { ReactNode } from "react";

type PanelProps = {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export default function Panel({ title, description, children, className = "" }: PanelProps) {
  return (
    <div className={`rounded-[1.5rem] border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-black/20 backdrop-blur ${className}`.trim()}>
      {(title || description) && (
        <div className="mb-5">
          {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
          {description && <p className="mt-1 text-sm text-slate-400">{description}</p>}
        </div>
      )}
      {children}
    </div>
  );
}
