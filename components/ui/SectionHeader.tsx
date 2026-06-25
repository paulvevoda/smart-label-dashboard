type SectionHeaderProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export default function SectionHeader({ title, description, action }: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {description && <p className="mt-1 text-sm text-slate-400">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
