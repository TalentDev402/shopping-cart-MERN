import express from "express";
import { Auth, OnlyAdmin, OnlySuperAdmin } from "../middleware";
import { CustomerController } from "../controllers/CustomerController";
const router = express.Router();

router.get("/list", OnlyAdmin, CustomerController.GetCustomerList);
router.put("/:id", Auth, CustomerController.EditCustomer);
router.post("/", OnlyAdmin, CustomerController.CreateCustomer);
router.delete("/:id", OnlySuperAdmin, CustomerController.DeleteCustomer);

export default router;
