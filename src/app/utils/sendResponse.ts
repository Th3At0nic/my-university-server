import { Response } from 'express';

type TMeta = {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
};

const sendResponse = <T>(
  res: Response,
  statusCode: number,
  success: boolean,
  message: string,
  data: T,
  meta?: TMeta,
) => {
  res.status(statusCode).json({
    success: success,
    message: message,
    meta: meta,
    data: data,
  });
};

export default sendResponse;
