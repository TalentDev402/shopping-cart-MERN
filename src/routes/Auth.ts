import express from "express";
import { Auth, OnlyAdmin } from "../middleware";
import { AuthController } from "../controllers/AuthController";
const router = express.Router();

router.post("/admin-login", AuthController.AdminLogin);
router.post("/admin-changePassword", OnlyAdmin, AuthController.AdminChangePassword);
router.post("/customer-login", AuthController.CustomerLogin);
router.post("/customer-register", AuthController.CustomerRegister);
router.get("/current-user", Auth, AuthController.GetCurrentUser);
router.post("/customer-google", AuthController.CustomerGoogleAuth);

export default router;
