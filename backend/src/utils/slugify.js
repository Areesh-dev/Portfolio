export const slugify = (text) =>
  text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

// Appends -2, -3, ... until `exists(candidate)` returns false.
export const uniqueSlug = async (base, exists) => {
  let slug = slugify(base) || 'project';
  let n = 2;
  while (await exists(slug)) {
    slug = `${slugify(base)}-${n}`;
    n += 1;
  }
  return slug;
};
