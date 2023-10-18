
import express from "express";
import indexRouter from "./routes/index.js"
import dotenv from 'dotenv';
import cors from 'cors';
import { connections } from './connection.js'

const env = dotenv.config().parsed;
var app = express();

app.use(cors({
    origin: 'http://localhost:8000',
}))

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);

connections()

app.listen(env.APP_PORT,  () => {
    console.log(`Server is running on port ${env.APP_PORT}`);
})

export default app