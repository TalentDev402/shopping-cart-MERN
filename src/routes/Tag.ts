import express from "express";
import { OnlyAdmin, Auth, OnlySuperAdmin } from "../middleware";
import { TagController } from "../controllers/TagController";
const router = express.Router();

router.get("/list", Auth, TagController.GetTagList);
router.post("/", OnlyAdmin, TagController.CreateTag);
router.delete("/:id", OnlySuperAdmin, TagController.DeleteTag);

export default router;
