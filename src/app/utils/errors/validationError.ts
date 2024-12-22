import { TErrorSource } from '../../interface/error';
import { AppError } from './appError';

export class ValidationError extends AppError {
  constructor(message: string, errorSource: TErrorSource) {
    super(message, 400, errorSource);
  }
}
