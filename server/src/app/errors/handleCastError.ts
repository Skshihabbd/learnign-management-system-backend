import mongoose from 'mongoose';
import { TErrorSources, TGenericErrorResponse } from '../interfaces/error.interfaces';

const handleCastError = (
  err: mongoose.Error.CastError,
): TGenericErrorResponse => {
  const errorSources: TErrorSources = [
    {
      path: err.path,
      message: err.message,
    },
  ];

  const statusCode = 400;

  return {
    statusCode,
    success: false,
    message: 'Invalid ID',
    errorSources,
  };
};

export default handleCastError;