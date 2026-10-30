import { Types } from "mongoose";

export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: "buyer" | "seller" | "admin";
  status: "active" | "blocked";
  createdAt?: Date;
  updatedAt?: Date;
}