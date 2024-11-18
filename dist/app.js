"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
// const express = require("express");
const app = (0, express_1.default)();
// const port = 3000;
//parser
app.use(express_1.default.json());
//cors
app.use((0, cors_1.default)());
app.get('/', (req, res) => {
    res.send('Hello World!');
});
console.log('here is:', process.cwd());
exports.default = app;
