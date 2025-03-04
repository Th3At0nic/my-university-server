import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import { globalErrorHandler } from './app/middlewares/globalErrorHandler';
import { notFound } from './app/middlewares/notFound';
import router from './app/routes';
import cookieParser from 'cookie-parser';

const app: Application = express();

//json parser
app.use(express.json());

//cookie parser
app.use(cookieParser());

//cors
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

//routing to the router folder
app.use('/api/v1/', router);

// const test = async (req: Request, res: Response) => {
//   Promise.reject();
// };
// app.get('/', test);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

//this is the global error handler
app.use(globalErrorHandler);

// not found handler
app.use(notFound);

export default app;
