import { Router } from "express";
import { validateRequest } from "../../middlewares/ValidateRequest";
import { userController } from "./user.controller";
import { createUserTransactionSchema } from "./user.validation";

// User Create with MongoDB Transaction
const router: Router = Router();

router.post(
    "/transaction-create",
    validateRequest(createUserTransactionSchema),
    userController.createUserWithTransaction
);

export const UserRoutes: Router = router;