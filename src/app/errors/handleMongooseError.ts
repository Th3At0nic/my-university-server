import mongoose from 'mongoose';
import { TErrorSource, TGenericErrorResponse } from '../interface/error';

export const handleMongooseError = (
  err: mongoose.Error.ValidationError,
): TGenericErrorResponse => {
  const statusCode = 400;
  const errorSource: TErrorSource = Object.values(err.errors).map(
    (val: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: val.name,
        message: val.message,
      };
    },
  );
  return {
    statusCode,
    message: 'Validation Error',
    errorSource,
  };
};
