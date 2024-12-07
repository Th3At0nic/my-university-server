/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import { studentRoute } from './app/modules/student/student.route';
import { userRoute } from './app/modules/user/user.route';
import { globalErrorHandler } from './app/middlewares/globalErrorHandler';

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
app.use(globalErrorHandler);

export default app;
