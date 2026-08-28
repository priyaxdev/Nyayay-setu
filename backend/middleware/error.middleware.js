// 404 handler — mounted after all routes.
export function notFound(req, res, next) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

// Centralized error handler — mounted last. Never leaks stack traces or
// internal details to the client; those are only logged server-side.
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  console.error('[error]', err);

  // Our own thrown errors carry a safe status + message.
  if (err.isApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Mongoose validation errors → 400 with a readable summary.
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((e) => e.message)
      .join('; ');
    return res.status(400).json({ success: false, message });
  }

  // Mongoose duplicate key (e.g. complaintId collision, should be rare).
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: 'A record with that identifier already exists.',
    });
  }

  // Malformed JSON body from express.json().
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ success: false, message: 'Malformed JSON body.' });
  }

  // Fallback — never expose err.message from unknown errors in production.
  const status = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === 'production' && status === 500
      ? 'Something went wrong. Please try again.'
      : err.message || 'Internal server error.';

  res.status(status).json({ success: false, message });
}
