import { z } from "zod";

import status from "http-status";
import { TErrorSources, TGenericErrorResponse } from "../interfaces/error.interfaces";

const handleZodError = (err: z.ZodError): TGenericErrorResponse => {
  const statusCode = status.BAD_REQUEST;
  const errorSources: TErrorSources = [];

  err.issues.forEach((issue) => {
    errorSources.push({
      path: issue.path.join("."),
      message: issue.message,
    });
  });

  const message = errorSources.length
    ? errorSources.map((error) => error.message).join(", ")
    : "Validation Error From Zod";

  return {
    statusCode,
    success: false,
    message,
    errorSources,
  };
};

export default handleZodError;