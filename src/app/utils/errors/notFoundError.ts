import { TErrorSource } from '../../interface/error';
import { AppError } from './appError';

export class NotFoundError extends AppError {
  constructor(message: string, errorSource: TErrorSource) {
    super(message, 404, errorSource);
  }
}
