import cors from 'cors';
import express, { Application, Request, Response } from 'express';

// const express = require("express");
const app: Application = express();
// const port = 3000;

//parser
app.use(express.json());
//cors
app.use(cors());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

console.log('here is:', process.cwd());

export default app;
