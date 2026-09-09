import { useRef, useState } from 'react';
import { Film, Loader2, X } from 'lucide-react';
import { adminApi } from '../lib/api.js';

export default function VideoUploader({ label, bucket, value, onChange }) {
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
      <div className="flex items-start gap-4">
        <div className="flex h-20 w-32 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-ink/15 bg-ink/5">
          {value ? (
            <video src={value} className="h-full w-full object-cover" muted playsInline />
          ) : (
            <Film className="h-6 w-6 text-ink/30" />
          )}
        </div>
        <div>
          <input ref={inputRef} type="file" accept="video/mp4,video/webm,video/quicktime" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-4 py-2 text-sm font-medium hover:border-ink/40 disabled:opacity-60"
          >
            {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
            {value ? 'Replace video' : 'Upload video'}
          </button>
          {value && (
            <button type="button" onClick={() => onChange('')} className="ml-2 inline-flex items-center gap-1 text-sm text-ink/50 hover:text-red-600">
              <X className="h-3.5 w-3.5" /> Remove
            </button>
          )}
          <p className="mt-1 text-xs text-ink/40">MP4 or WebM, up to 60MB. Muted, looping background — keep it short.</p>
          {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
