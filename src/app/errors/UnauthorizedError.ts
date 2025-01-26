import { TErrorSource } from '../interface/error';
import { AppError } from './AppError';

export class UnauthorizedError extends AppError {
  constructor(message: string, errorSource: TErrorSource) {
    super(message, 401, errorSource);
  }
}
