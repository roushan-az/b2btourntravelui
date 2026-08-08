export class ApiError extends Error {
  constructor(status, body) {
    let errorMessage = "API error";
    
    if (body?.message) {
      errorMessage = body.message;
    } else if (body?.detail) {
      // Handle FastAPI 422 array format
      if (Array.isArray(body.detail)) {
        errorMessage = body.detail.map(err => `${err.loc.at(-1)}: ${err.msg}`).join(", ");
      } else {
        errorMessage = body.detail;
      }
    }

    super(errorMessage);
    this.status = status;
    this.body = body;
  }
}