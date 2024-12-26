import { TErrorSource } from "../../interface/error";


export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errorSource: TErrorSource;
  public readonly isOperational: boolean;

  constructor(
    public readonly message: string,
    statusCode: number,
    errorSource: TErrorSource,
    isOperational: boolean = true,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorSource = errorSource;
    this.isOperational = isOperational;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
