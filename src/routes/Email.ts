import express from "express";
import { EmailController } from "../controllers/EmailController";
const router = express.Router();

router.post("/contact-us", EmailController.ContactUs);

export default router;
