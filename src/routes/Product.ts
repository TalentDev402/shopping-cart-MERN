import express from "express";
import { Auth, OnlyAdmin, OnlySuperAdmin } from "../middleware";
import { ProductController } from "../controllers/ProductController";
const router = express.Router();

// router.get("/list", Auth, ProductController.GetProductList);
router.get("/list",  ProductController.GetProductList);
router.get("/listing", ProductController.GetProductListForGuest);
router.post("/", OnlyAdmin, ProductController.CreateProduct);
router.delete("/:id", OnlySuperAdmin, ProductController.DeleteProduct);
router.post("/upload-photo", OnlyAdmin, ProductController.UploadPhoto);
router.get("/display-list", ProductController.GetDisplayList);
router.get("/alert-list", OnlyAdmin, ProductController.GetAlertList);
router.get('/fetch-list', ProductController.FetchProductListbyItemNo);
router.get('/fetch-listbyname', ProductController.FetchProductListbyName);
router.put("/:id", OnlyAdmin, ProductController.EditProduct);
router.get("/:id", ProductController.GetProductById);

export default router;
