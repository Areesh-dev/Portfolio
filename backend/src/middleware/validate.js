import { ApiError } from './errorHandler.js';

// Validates and replaces req.body/req.query with the parsed, coerced,
// stripped-of-unknown-keys result from a Zod schema. Frontend validation is
// for UX only — this is the source of truth.
export const validateBody = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const message = result.error.issues
      .map((issue) => `${issue.path.join('.') || 'body'}: ${issue.message}`)
      .join('; ');
    return next(new ApiError(400, message));
  }
  req.body = result.data;
  next();
};

export const validateQuery = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.query);
  if (!result.success) {
    const message = result.error.issues
      .map((issue) => `${issue.path.join('.') || 'query'}: ${issue.message}`)
      .join('; ');
    return next(new ApiError(400, message));
  }
  req.query = result.data;
  next();
};
