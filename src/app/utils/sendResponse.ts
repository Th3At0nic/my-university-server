import { Response } from 'express';

const sendResponse = <T>(
  res: Response,
  statusCode: number,
  success: boolean,
  message: string,
  data: T,
) => {
  res.status(statusCode).json({
    success: success,
    message: message,
    data: data,
  });
};

export default sendResponse;
