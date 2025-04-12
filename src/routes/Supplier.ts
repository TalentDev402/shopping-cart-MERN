import express from "express";
import { OnlyAdmin, OnlySuperAdmin } from "../middleware";
import { SupplierController } from "../controllers/SupplierController";
const router = express.Router();

router.get("/list", OnlyAdmin, SupplierController.GetSupplierList);
router.post("/", OnlyAdmin, SupplierController.CreateSupplier);
router.delete("/:id", OnlySuperAdmin, SupplierController.DeleteSupplier);
router.put("/:id", OnlyAdmin, SupplierController.EditSupplier);
router.post("/upload-logo", OnlyAdmin, SupplierController.UploadLogo);
router.post("/upload-file", OnlyAdmin, SupplierController.UploadFile);

export default router;
