import { randomUUID } from 'crypto';
import { supabaseAdmin } from '../config/supabase.js';
import { ApiError } from '../middleware/errorHandler.js';

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
const DOC_TYPES = ['application/pdf'];
const VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];

const MB = 1024 * 1024;

// Per-bucket upload policy: which MIME types are accepted and the max size.
// Adding a bucket here is the only backend change needed to support it —
// the frontend just needs a matching uploader pointed at the bucket name.
const BUCKET_RULES = {
  'profile-images': { types: IMAGE_TYPES, maxBytes: 5 * MB },
  'project-images': { types: IMAGE_TYPES, maxBytes: 5 * MB },
  'project-screenshots': { types: IMAGE_TYPES, maxBytes: 5 * MB },
  'service-images': { types: IMAGE_TYPES, maxBytes: 5 * MB },
  'review-images': { types: IMAGE_TYPES, maxBytes: 5 * MB },
  resume: { types: DOC_TYPES, maxBytes: 10 * MB },
  'hero-video': { types: VIDEO_TYPES, maxBytes: 60 * MB },
};

export const ALLOWED_BUCKETS = Object.keys(BUCKET_RULES);

const EXTENSIONS = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/svg+xml': 'svg',
  'application/pdf': 'pdf',
  'video/mp4': 'mp4',
  'video/webm': 'webm',
  'video/quicktime': 'mov',
};

export const uploadToBucket = async (bucket, file) => {
  const rule = BUCKET_RULES[bucket];
  if (!rule) {
    throw new ApiError(400, `Unknown storage bucket: ${bucket}`);
  }
  if (!rule.types.includes(file.mimetype)) {
    throw new ApiError(400, `Unsupported file type: ${file.mimetype}`);
  }
  if (file.size > rule.maxBytes) {
    throw new ApiError(400, `File too large. Max size is ${Math.round(rule.maxBytes / MB)}MB.`);
  }

  const path = `${randomUUID()}.${EXTENSIONS[file.mimetype] || 'bin'}`;

  const { error } = await supabaseAdmin.storage.from(bucket).upload(path, file.buffer, {
    contentType: file.mimetype,
    upsert: false,
  });
  if (error) {
    throw new ApiError(500, `Upload failed: ${error.message}`);
  }

  const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(path);
  return { url: data.publicUrl, path };
};

// Best-effort delete when replacing/removing an asset — a failure here
// shouldn't block the caller's main operation, so callers may ignore errors.
export const deleteFromBucket = async (bucket, path) => {
  if (!BUCKET_RULES[bucket] || !path) return;
  await supabaseAdmin.storage.from(bucket).remove([path]);
};
