import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import { studentRoute } from './app/modules/student/student.route';

// const express = require("express");
const app: Application = express();
// const port = 3000;

//parser
app.use(express.json());
//cors
app.use(cors());

app.use('/api/v1/students', studentRoute);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

console.log('here is:', process.cwd());

export default app;
