import express from "express";
import { Auth, OnlyAdmin } from "../middleware";
import { AdjustmentController } from "../controllers/AdjustmentController";
const router = express.Router();

router.get("/list", Auth, AdjustmentController.GetAdjustmentList);
router.post("/", OnlyAdmin, AdjustmentController.CreateAdjustment);
router.delete("/:id", OnlyAdmin, AdjustmentController.DeleteAdjustment);
router.patch("/:id", OnlyAdmin, AdjustmentController.EditAdjustment);

export default router;
