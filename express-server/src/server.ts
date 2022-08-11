require('dotenv').config();
require('./passport');
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import helmet from 'helmet';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';

import express, { NextFunction, Request, Response } from 'express';
import StatusCodes from 'http-status-codes';
import 'express-async-errors';

import apiRouter from './routes/api';
import userRouter from './routes/users';
import logger from 'jet-logger';
import { CustomError } from '@shared/errors';

import mongoose, { ConnectOptions } from 'mongoose';

// Constants
const app = express();

const mongoDB: string =
  process.env.MONGODB_URI || process.env.MONGODB_DEV || 'No MongoDB found.';
mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as ConnectOptions);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

/***********************************************************************************
 *                                  Middlewares
 **********************************************************************************/

// Common middlewares
app.use(
  cors({
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'No secret found.',
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Show routes called in console during development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Security (helmet recommended in express docs)
if (process.env.NODE_ENV === 'production') {
  app.use(helmet());
}

/***********************************************************************************
 *                         API routes and error handling
 **********************************************************************************/

// Add api router
app.use('/api', apiRouter);
app.use('/users', userRouter);
// Error handling
app.use(
  (err: Error | CustomError, _: Request, res: Response, __: NextFunction) => {
    logger.err(err, true);
    const status =
      err instanceof CustomError ? err.HttpStatus : StatusCodes.BAD_REQUEST;
    return res.status(status).json({
      error: err.message,
    });
  }
);

/***********************************************************************************
 *                                  Front-end content
 **********************************************************************************/

// Set static dir
const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir));

// Export here and start in a diff file (for testing).
export default app;
