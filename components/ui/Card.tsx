import type { ReactNode } from "react";

type CardProps = {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
};

export default function Card({
  title,
  description,
  actions,
  children,
  className = "",
}: CardProps) {
  return (
    <section className={`rounded-[1.5rem] border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-black/20 backdrop-blur ${className}`.trim()}>
      {(title || description || actions) && (
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
            {description && <p className="mt-1 text-sm text-slate-400">{description}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </section>
  );
}
