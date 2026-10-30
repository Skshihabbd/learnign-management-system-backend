import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import status from 'http-status';
import { env } from './app/config/env';
// import passport from "./app/utills/passport";

import cookieParser from "cookie-parser";
import { sendResponse } from './app/utills/sendResponse';
import router from './app/routes';
import globalErrorHandler from './app/middlewares/GlobalErrorHandler';
import { notFound } from './app/middlewares/NotFound';
const app: Application = express();
app.use(cors({
    origin: [env.FRONTEND_URL, "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    // allowedHeaders: ["Content-Type", "Authorization", "cookie"],
    credentials: true
}));
app.use(express.json({ limit: "16kb", }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
// app.use(passport.initialize());

app.get('/', (req: Request, res: Response) => {
    sendResponse(res, {
        success: true,
        statusCode: status.OK,
        message: "Debdada server is running successfully",
        data: {
            author: {
                name: "Md Abu Sufian Jidan & Shihab Uddin",
                version: "1.0.0",
            },
            host: req.hostname,
            time: new Date().toISOString(),
        }
    });
});

// application routes
app.use('/api/v1', router);
app.use(globalErrorHandler);
app.use(notFound);

export default app; 