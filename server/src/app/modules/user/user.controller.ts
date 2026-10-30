import httpStatus from "http-status";

import { userService } from "./user.service";
import { sendResponse } from "../../utills/sendResponse";
import { catchAsync } from "../../utills/catchAsync";

const createUserWithTransaction = catchAsync(
  async (req, res) => {
    const result =
      await userService.createUserWithTransaction(req.body);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: result.message,
      data: result,
    });
  }
);

export const userController = {
  createUserWithTransaction,
};