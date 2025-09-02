class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = ""
  ) {
    super(message);                 // sets this.message and captures basic error behavior
    this.name = "ApiError";         // helpful label
    this.statusCode = statusCode;   // HTTP status (e.g., 400/401/404/500)
    this.data = null;               // optional payload you might include
    this.success = false;           // APIs often include success flag
    this.errors = errors;           // array of field/validation errors, etc.

    if (stack) {
      this.stack = stack;           // allow overriding stack trace
    } else {
      // V8/Node feature: makes stack start from where ApiError was constructed
      Error.captureStackTrace?.(this, this.constructor);
    }
  }
}

export default ApiError;