import express from "express";
import { OnlyAdmin, OnlySuperAdmin } from "../middleware";
import { CategoryController } from "../controllers/CategoryController";
const router = express.Router();

router.get("/list", CategoryController.GetCategoryList);
router.post("/", OnlyAdmin, CategoryController.CreateCategory);
router.post("/:id", OnlyAdmin, CategoryController.AddSubCategory);
router.delete("/:id", OnlySuperAdmin, CategoryController.DeleteCategory);
router.put('/:id', OnlyAdmin, CategoryController.EditCategory);

export default router;
