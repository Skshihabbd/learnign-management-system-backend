import mongoose from "mongoose";
import { User } from "./user.model";
import { IUser } from "./user.interface";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

interface ICreateUserPayload {
  name: string;
  email: string;
  password: string;
  simulateRollback?: boolean;
}

const createUserWithTransaction = async (
  payload: ICreateUserPayload
) => {
  const session = await mongoose.startSession();

  let rollbackTriggered = false;

  try {
    await session.withTransaction(async () => {
      const existingUser = await User.findOne({
        email: payload.email,
      }).session(session);

      if (existingUser) {
        throw new AppError(
          httpStatus.CONFLICT,
          "User already exists!"
        );
      }

      await User.create(
        [
          {
            name: payload.name,
            email: payload.email,
            password: payload.password,
            role: "buyer",
            status: "active",
          },
        ],
        { session }
      );

      // Testing purpose: ইচ্ছাকৃতভাবে transaction বাতিল
      if (payload.simulateRollback === true) {
        throw new Error("FORCED_ROLLBACK");
      }
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "FORCED_ROLLBACK"
    ) {
      rollbackTriggered = true;
    } else {
      throw error;
    }
  } finally {
    await session.endSession();
  }

  // Transaction-এর বাইরে যাচাই
  const createdUser = await User.findOne({
    email: payload.email,
  });

  if (rollbackTriggered) {
    if (createdUser) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Rollback verification failed!"
      );
    }

    return {
      transaction: "ROLLBACK",
      rollbackVerified: true,
      userCreated: false,
      message: "Rollback successful. User was not saved.",
    };
  }

  if (!createdUser) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Transaction verification failed!"
    );
  }

  return {
    transaction: "COMMIT",
    commitVerified: true,
    userCreated: true,
    user: createdUser,
    message: "User created successfully.",
  };
};

export const userService = {
  createUserWithTransaction,
};