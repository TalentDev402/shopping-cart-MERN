import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import path from "path";
import mongoose from "mongoose";
import cron from "node-cron";
import { UserController } from "./controllers/UserController";
import { SettingController } from "./controllers/SettingController";

//Routers
import AuthRouter from "./routes/Auth";
import UserRouter from "./routes/User";
import SupplierRouter from "./routes/Supplier";
import ProductRouter from "./routes/Product";
import TagRouter from "./routes/Tag";
import CategoryRouter from "./routes/Category";
import CartRouter from "./routes/Cart";
import SettingRouter from "./routes/Setting";
import CustomerRouter from "./routes/Customer";
import OrderRouter from "./routes/Order";
import AdjustmentRouter from "./routes/Adjustment";
import EmailRouter from "./routes/Email";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const server = http.createServer(app);

app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/user", UserRouter);
app.use("/api/v1/supplier", SupplierRouter);
app.use("/api/v1/product", ProductRouter);
app.use("/api/v1/tag", TagRouter);
app.use("/api/v1/category", CategoryRouter);
app.use("/api/v1/cart", CartRouter);
app.use("/api/v1/setting", SettingRouter);
app.use("/api/v1/customer", CustomerRouter);
app.use("/api/v1/order", OrderRouter);
app.use("/api/v1/adjustment", AdjustmentRouter);
app.use("/api/v1/email", EmailRouter);

mongoose
  .connect(process.env.MONGO_URL as string)
  .then(async () => {
    await UserController.CreateSuperAdmin();
    await SettingController.CreateInitialSetting();
    console.log("Connected to Mongo DB!!");
  })
  .catch((err) => console.log(err));

app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "../client/build")));
app.use("*", (req: Request, res: Response) =>
  res.sendFile(path.join(__dirname, "../client/build", "index.html"))
);

// Cron Job
cron.schedule(
  "0 0 * * *",
  () => {
    SettingController.GetExchangeRateForHKD();
  },
  {
    timezone: "Asia/Hong_Kong",
  }
);

cron.schedule(
  "0 12 * * *",
  () => {
    SettingController.GetExchangeRateForHKD();
  },
  { timezone: "Asia/Hong_Kong" }
);

server.listen(port, () => {
  console.log(`The Server is up and running on PORT ${port}`);
});
