import type { ReactNode } from "react";

type TableShellProps = {
  headers: string[];
  children: ReactNode;
  emptyState?: ReactNode;
};

export default function TableShell({ headers, children, emptyState }: TableShellProps) {
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950/60 shadow-2xl shadow-black/20">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10 text-left">
          <thead className="bg-slate-900/80">
            <tr>
              {headers.map((header) => (
                <th key={header} className="px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 bg-slate-950/60">
            {children}
          </tbody>
        </table>
      </div>
      {emptyState && <div className="p-4">{emptyState}</div>}
    </div>
  );
}
