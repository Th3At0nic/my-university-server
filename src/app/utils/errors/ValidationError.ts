import { TErrorSource } from '../../interface/error';
import { AppError } from './AppError';

export class ValidationError extends AppError {
  constructor(message: string, errorSource: TErrorSource) {
    super(message, 400, errorSource);
  }
}
