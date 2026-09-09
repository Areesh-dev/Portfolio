const baseInput =
  'w-full rounded-lg border border-ink/15 bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition placeholder:text-ink/40 focus:border-primary-500 focus:ring-1 focus:ring-primary-500';

function Field({ label, htmlFor, error, children }) {
  return (
    <div>
      {label && (
        <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-ink/80">
          {label}
        </label>
      )}
      {children}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}

export function Input({ label, error, className = '', id, ...props }) {
  return (
    <Field label={label} htmlFor={id} error={error}>
      <input id={id} className={`${baseInput} ${className}`} {...props} />
    </Field>
  );
}

export function Textarea({ label, error, className = '', id, rows = 4, ...props }) {
  return (
    <Field label={label} htmlFor={id} error={error}>
      <textarea id={id} rows={rows} className={`${baseInput} resize-y ${className}`} {...props} />
    </Field>
  );
}

export function Select({ label, error, className = '', id, children, ...props }) {
  return (
    <Field label={label} htmlFor={id} error={error}>
      <select id={id} className={`${baseInput} ${className}`} {...props}>
        {children}
      </select>
    </Field>
  );
}

export function Checkbox({ label, id, ...props }) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-center gap-2 text-sm font-medium text-ink/80">
      <input id={id} type="checkbox" className="h-4 w-4 rounded border-ink/30 accent-primary-400 focus:ring-primary-500" {...props} />
      {label}
    </label>
  );
}
