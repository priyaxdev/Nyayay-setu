// Lightweight error class carrying an HTTP status alongside a
// user-safe message. Throw this anywhere in controllers/services and the
// error middleware will turn it into the { success: false, message } shape.
export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.isApiError = true;
  }
}
