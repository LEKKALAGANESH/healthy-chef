export class HttpError extends Error {
  constructor(public statusCode: number, message: string, public isOperational = true) {
    super(message);
  }
}
