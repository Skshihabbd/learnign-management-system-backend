import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import status from "http-status";
import { ZodError } from "zod";
import { env } from "../config/env";
import AppError from "../errors/AppError";

import handleZodError from "../errors/handleZodError";
import handleCastError from "../errors/handleCastError";
import { TErrorSources, TGenericErrorResponse } from "../interfaces/error.interfaces";

const globalErrorHandler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = status.INTERNAL_SERVER_ERROR as number;
  let message = "Something went wrong";
  let errorSources: TErrorSources = [];
  let stack = err.stack;

  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode as number;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err?.name === "CastError") {
    const simplifiedError = handleCastError(err);
    statusCode = simplifiedError.statusCode as number;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorSources = [
      {
        path: "",
        message: err.message,
      },
    ];
  } else if (err instanceof Error) {
    statusCode = status.BAD_REQUEST;
    message = err.message;
    errorSources = [
      {
        path: "",
        message: err.message,
      },
    ];
  }

  const errorResponse: TGenericErrorResponse = {
    success: false,
    statusCode: statusCode,
    message: message,
    errorSources,
    error: env.NODE_ENV === "development" ? err : undefined,
    stack: env.NODE_ENV === "development" ? stack : undefined,
  };

  res.status(statusCode).json(errorResponse);
};

export default globalErrorHandler;