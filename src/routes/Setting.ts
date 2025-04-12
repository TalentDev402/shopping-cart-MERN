import express from "express";
import { Auth, OnlyAdmin, OnlySuperAdmin } from "../middleware";
import { SettingController } from "../controllers/SettingController";
const router = express.Router();

router.get("/", Auth, SettingController.GetSetting);
router.get("/company-info", SettingController.GetCompanyInfo);
router.post("/company-info", SettingController.SaveCompanyInfo);
router.get("/product-display", SettingController.GetProductDisplay);
router.post("/currency", OnlyAdmin, SettingController.CreateCurrency);
router.delete("/currency", OnlySuperAdmin, SettingController.DeleteCurrency);
router.post("/currency/base-currency", OnlyAdmin, SettingController.SetBaseCurrency);
router.post("/upload-photo", OnlyAdmin, SettingController.UploadPhoto);
router.post("/product-display", OnlyAdmin, SettingController.CreateProductDisplay);
router.patch("/product-display", OnlyAdmin, SettingController.UpdateProductDisplay);
router.delete("/product-display/:index", OnlyAdmin, SettingController.DeleteProductDisplay);
router.patch("/pages", OnlyAdmin, SettingController.SavePages);
router.get("/pages", SettingController.GetPages);
router.post("/upload-image", OnlyAdmin, SettingController.UploadImage);

export default router;
