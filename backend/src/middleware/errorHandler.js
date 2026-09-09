export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export const notFoundHandler = (req, res) => {
  res.status(404).json({ error: 'Not found' });
};

// Centralized error handler — never leaks stack traces or internal details
// to the client, only logs them server-side.
export const errorHandler = (err, req, res, _next) => {
  const status = err.status || 500;
  if (status >= 500) {
    console.error(err);
  }
  res.status(status).json({
    error: status >= 500 ? 'Internal server error' : err.message || 'Request failed',
  });
};
