import express from "express";
import { Auth, OnlyAdmin, OnlySuperAdmin } from "../middleware";
import { OrderController } from "../controllers/OrderController";
const router = express.Router();

router.post('/', Auth, OrderController.CreateOrder);
router.post('/createRequest', Auth, OrderController.CreateRequest);
router.get('/request-list', Auth, OrderController.GetRequestList);
router.get("/list", OnlyAdmin, OrderController.GetOrderList);
router.get('/customer-list', Auth, OrderController.GetOrderListByCustomer);
router.get('/sales-ranking', OnlyAdmin, OrderController.GetSalesRankingList);
router.post('/inventory-trend', OnlySuperAdmin, OrderController.GetInventoryTrendList);
router.put('/:id', OnlyAdmin, OrderController.EditOrder);
router.put('/request/:id', OnlyAdmin, OrderController.EditRequest);
router.post("/export-order", Auth, OrderController.ExportOrder);
router.delete("/invoice/:orderId", Auth, OrderController.DeleteInvoice);

export default router;
