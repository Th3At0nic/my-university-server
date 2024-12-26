import { TErrorSource } from '../../interface/error';
import { AppError } from './AppError';

export class ConflictError extends AppError {
  constructor(message: string, errorSource: TErrorSource) {
    super(message, 409, errorSource);
  }
}
