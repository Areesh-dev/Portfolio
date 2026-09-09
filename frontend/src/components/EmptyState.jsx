export default function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink/15 py-16 text-center">
      {Icon && <Icon className="mb-3 h-8 w-8 text-ink/30" aria-hidden="true" />}
      <p className="font-medium text-ink/70">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-ink/40">{description}</p>}
    </div>
  );
}
