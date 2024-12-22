import mongoose from 'mongoose';
import { TErrorSource } from '../../interface/error';

export const handleMongooseError = (
  err: mongoose.Error.ValidationError,
) => {
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
