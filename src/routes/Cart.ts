import express from "express";
import { Auth } from "../middleware";
import { CartController } from "../controllers/CartController";
const router = express.Router();

router.post("/add-item", Auth, CartController.AddToCart);
router.get("/", Auth, CartController.GetCart);
router.put("/change-quantity", Auth, CartController.ChangeQuantity);
router.put("/remove-item", Auth, CartController.RemoveItem);

export default router;
