import { TErrorSource } from '../../middlewares/globalErrorHandler';
import { AppError } from './appError';

export class ConflictError extends AppError {
  constructor(message: string, errorSource: TErrorSource) {
    super(message, 409, errorSource);
  }
}
