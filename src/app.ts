import cors from 'cors';
import express, { Application, Request, Response } from 'express';
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

console.log('here is:', process.cwd());

export default app;
