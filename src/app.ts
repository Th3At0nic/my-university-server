/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import cors from 'cors';
import express, { Application, Request, Response, NextFunction } from 'express';
import { studentRoute } from './app/modules/student/student.route';
import { userRoute } from './app/modules/user/user.route';

const app: Application = express();

//parser
app.use(express.json());
//cors
app.use(cors());

app.use('/api/v1/students', studentRoute);
app.use('/api/v1/users/', userRoute);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

//this is the global error handler
// eslint-disable-next-line no-unused-vars
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({
    success: false,
    message: err.message || 'Something went wrong!',
    error: err,
  });
});

export default app;
