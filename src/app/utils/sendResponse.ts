import { Response } from 'express';

const sendResponse = <T>(res: Response, message: string, data: T) => {
  console.log("ekhane dataaaaa: ",data)
  res.status(200).json({
    success: true,
    message: message,
    data: data,
  });
};

export default sendResponse;
