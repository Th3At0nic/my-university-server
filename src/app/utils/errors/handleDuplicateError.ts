/* eslint-disable @typescript-eslint/no-explicit-any */
import { TErrorSource, TGenericErrorResponse } from './../../interface/error';

export const handleDuplicateError = (err: any): TGenericErrorResponse => {
  const statusCode = 409;
  const pathRegex = err.message.match(/{ name: "(.*?)" }/);
  const errorSource: TErrorSource = [
    {
      path: `${err.message.match(pathRegex[1])}`,
      message: `${err.message.match(pathRegex[1])} is already exists!`,
    },
  ];
  return {
    statusCode,
    message: 'Duplicate Error!',
    errorSource,
  };
};
