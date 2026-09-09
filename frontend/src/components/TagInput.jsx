import { useState } from 'react';
import { X } from 'lucide-react';

// Simple comma/enter-delimited tag editor for `technologies` arrays.
export default function TagInput({ label, value = [], onChange, placeholder = 'Type and press Enter' }) {
  const [draft, setDraft] = useState('');

  const addTag = () => {
    const tag = draft.trim();
    if (tag && !value.includes(tag)) onChange([...value, tag]);
    setDraft('');
  };

  const removeTag = (tag) => onChange(value.filter((t) => t !== tag));

  return (
    <div>
      {label && <label className="mb-1.5 block text-sm font-medium text-ink/80">{label}</label>}
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-ink/15 bg-surface p-2">
        {value.map((tag) => (
          <span key={tag} className="flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-ink">
            {tag}
            <button type="button" onClick={() => removeTag(tag)} aria-label={`Remove ${tag}`}>
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ',') {
              e.preventDefault();
              addTag();
            }
          }}
          onBlur={addTag}
          placeholder={value.length === 0 ? placeholder : ''}
          className="min-w-[120px] flex-1 border-none bg-transparent p-1 text-sm text-ink outline-none placeholder:text-ink/40"
        />
      </div>
    </div>
  );
}
