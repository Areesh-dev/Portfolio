
const normalize = (s) => s.trim().toLowerCase().replace(/[-_\s]+/g, '');

let indexPromise = null;

function loadIndex() {
  if (!indexPromise) {
    indexPromise = import('lucide-react').then((mod) => {
      const index = {};
      for (const key of Object.keys(mod)) {
        if (/^[A-Z]/.test(key)) index[normalize(key)] = mod[key];
      }
      return index;
    });
  }
  return indexPromise;
}

// Resolves to the matching icon component, or `null` if nothing matches
// (the caller decides the fallback — see DynamicIcon).
export async function resolveIcon(name) {
  if (!name) return null;
  const index = await loadIndex();
  return index[normalize(name)] || null;
}
