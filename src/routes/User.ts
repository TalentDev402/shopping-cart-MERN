import express from "express";
import { OnlySuperAdmin } from "../middleware";
import { UserController } from "../controllers/UserController";
const router = express.Router();

router.get("/list", OnlySuperAdmin, UserController.GetUserList);
router.post("/", OnlySuperAdmin, UserController.CreateUser);
router.delete("/:id", OnlySuperAdmin, UserController.DeleteUser);
router.put("/:id", OnlySuperAdmin, UserController.EditUser);
router.post("/upload-avatar", OnlySuperAdmin, UserController.UploadAvatar);

export default router;
