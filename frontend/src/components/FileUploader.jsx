import { useRef, useState } from 'react';
import { FileText, Loader2, X, ExternalLink } from 'lucide-react';
import { adminApi } from '../lib/api.js';

// Non-image upload (currently: resume PDF). Shows a link to the current
// file instead of an image preview.
export default function FileUploader({ label, bucket, accept = 'application/pdf', value, onChange }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (file) => {
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const { url } = await adminApi.upload(bucket, file);
      onChange(url);
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {label && <label className="mb-1.5 block text-sm font-medium text-ink/80">{label}</label>}
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-ink/15 bg-ink/5">
          <FileText className="h-6 w-6 text-ink/30" />
        </div>
        <div>
          <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-4 py-2 text-sm font-medium hover:border-ink/40 disabled:opacity-60"
          >
            {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
            {value ? 'Replace file' : 'Upload file'}
          </button>
          {value && (
            <>
              <a href={value} target="_blank" rel="noopener noreferrer" className="ml-3 inline-flex items-center gap-1 text-sm text-primary-400 hover:underline">
                View current <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <button type="button" onClick={() => onChange('')} className="ml-2 inline-flex items-center gap-1 text-sm text-ink/50 hover:text-red-400">
                <X className="h-3.5 w-3.5" /> Remove
              </button>
            </>
          )}
          {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
        </div>
      </div>
    </div>
  );
}
