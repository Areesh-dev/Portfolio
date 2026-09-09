// Strips angle brackets and control characters from free-text user input
// before it's stored. React escapes rendered text by default so this isn't
// the only XSS defense, but it keeps raw markup out of the database.
const CONTROL_CHARS = new RegExp('[\\u0000-\\u0008\\u000B\\u000C\\u000E-\\u001F\\u007F]', 'g');

export const sanitizeText = (value) => {
  if (typeof value !== 'string') return value;
  return value.replace(/[<>]/g, '').replace(CONTROL_CHARS, '').trim();
};

export const sanitizeFields = (obj, fields) => {
  const copy = { ...obj };
  for (const field of fields) {
    if (typeof copy[field] === 'string') {
      copy[field] = sanitizeText(copy[field]);
    }
  }
  return copy;
};
