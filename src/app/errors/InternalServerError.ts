import { TErrorSource } from '../interface/error';
import { AppError } from './AppError';

export class InternalServerError extends AppError {
  constructor(message: string, errorSource: TErrorSource) {
    super(message, 500, errorSource);
  }
}
