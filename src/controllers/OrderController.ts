import { Response, Request } from "express";
import fs from "fs";
import Order from "../models/Order";
import Cart from "../models/Cart";
import Product from "../models/Product";
import Customer from "../models/Customer";
import Adjustment from "../models/Adjustment";
import ReturnRequest from "../models/ReturnRequest";
import { EmailController } from "./EmailController";
import Setting from "../models/Setting";

export const CreateOrder = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const userId = req.body.userId;
    const orderId = await Order.findOne()
      .sort({ orderId: -1 })
      .then((order: any) => {
        return order ? order.orderId + 1 : 1;
      });
    const products = data.items;
    const newOrder = new Order({
      ...data,
      orderId: orderId,
      customer: userId,
      orderStatus: "Pending",
      orderTrackStatus: "ordered",
      paymentStatus: "Pending",
    });

    await newOrder.save();
    await Cart.findOneAndUpdate({ customer: userId }, { items: [] });

    let foundProducts = <any>[];
    products.forEach((item: any) => {
      foundProducts.push(Product.findById(item.product));
    });

    const results = await Promise.all(foundProducts);
    let updatedProducts = <any>[];
    results.forEach((result: any, index: number) => {
      updatedProducts.push(
        Product.findByIdAndUpdate(products[index].product, {
          quantity: result.quantity - products[index].quantity,
        })
      );
    });
    Promise.all(updatedProducts);
    EmailController.NewOrder(orderId);

    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(501).json({ message: "Internal server error" });
  }
};

const CreateRequest = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const requestId = await ReturnRequest.findOne()
      .sort({ requestId: -1 })
      .then((request: any) => {
        return request ? request.requestId + 1 : 1;
      });
    const order = await Order.find({ orderId: data.orderNumber });
    let newRequest = new ReturnRequest({
      requestId: requestId,
      order: order[0]._id,
      customer: {
        name: data.fullName,
        phone: data.phoneNumber,
        email: data.emailAddress,
      },
      returnReason:
        data.requestReason === "others" ? data.otherReason : data.requestReason,
    });

    await newRequest.save();
    await newRequest.populate("order");
    return res.status(200).json({
      success: true,
      request: newRequest,
    });
  } catch (err) {
    console.log(err);
    return res.status(501).json({ message: "Internal server error" });
  }
};

const GetRequestList = async (req: Request, res: Response) => {
  try {
    const requests = await ReturnRequest.find().populate("order");
    return res.status(200).json({
      status: true,
      requests: requests,
    });
  } catch (err) {
    console.log(err);
    return res.status(501).json({ message: "Internal server error" });
  }
};

const GetOrderList = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find().populate([
      { path: "customer", select: { email: 1, name: 1, address: 1 } },
      { path: "items.product", select: { name: 1, photo: 1 } },
    ]);
    return res.status(200).json({
      status: true,
      orders: orders,
    });
  } catch (err) {
    console.log(err);
    return res.status(501).json({ message: "Internal server error" });
  }
};

const GetOrderListByCustomer = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const orders = await Order.find({ customer: userId }).populate([
      { path: "items.product", select: { name: 1, photo: 1 } },
    ]);
    return res.status(200).json({
      status: true,
      orders: orders,
    });
  } catch (err) {
    console.log(err);
    return res.status(501).json({ message: "Internal server error" });
  }
};

const EditOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { type, data } = req.body;

    if (type === "order_status") {
      if (data.orderStatus === "Complete") {
        const order: any = await Order.findById(id);
        if (order) {
          const customer: any = await Customer.findById(order.customer);
          let points = 0;
          order.items.forEach((item: any) => {
            points = points + item.quantity * item.pricePerItem;
          });
          if (customer) {
            await Customer.findByIdAndUpdate(customer._id, {
              points: customer.points + Math.round(points / 3),
            });
          }
        }
      }
      const updatedOrder = await Order.findByIdAndUpdate(
        id,
        { orderStatus: data.orderStatus },
        { new: true }
      ).populate([
        { path: "customer", select: { email: 1, name: 1 } },
        { path: "items.product", select: { name: 1, photo: 1 } },
      ]);
      return res.status(200).json({
        status: true,
        order: updatedOrder,
      });
    } else if (type === "payment_status") {
      if (data.paymentStatus === "Complete") {
        const order: any = await Order.findById(id);
        if (order) {
          const customer: any = await Customer.findById(order.customer);
          let points = 0;
          order.items.forEach((item: any) => {
            points = points + item.quantity * item.pricePerItem;
          });
          if (customer) {
            await Customer.findByIdAndUpdate(customer._id, {
              points: customer.points + points,
            });
          }
        }
      }
      const updatedOrder = await Order.findByIdAndUpdate(
        id,
        { paymentStatus: data.paymentStatus },
        { new: true }
      ).populate([
        { path: "customer", select: { email: 1, name: 1 } },
        { path: "items.product", select: { name: 1, photo: 1 } },
      ]);
      return res.status(200).json({
        status: true,
        order: updatedOrder,
      });
    } else if (type === "order_track_status") {
      const updatedOrder = await Order.findByIdAndUpdate(
        id,
        { orderTrackStatus: data.orderTrackStatus },
        { new: true }
      ).populate([
        { path: "customer", select: { email: 1, name: 1 } },
        { path: "items.product", select: { name: 1, photo: 1 } },
      ]);
      return res.status(200).json({
        status: true,
        order: updatedOrder,
      });
    } else {
      const updatedOrder = await Order.findByIdAndUpdate(
        id,
        {
          contactInfo: {
            email: data.email,
            phone: data.phone,
          },
          shippingAddress: data.address,
        },
        { new: true }
      ).populate([
        { path: "customer", select: { email: 1, name: 1 } },
        { path: "items.product", select: { name: 1, photo: 1 } },
      ]);
      return res.status(200).json({
        status: true,
        order: updatedOrder,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(501).json({ message: "Internal server error" });
  }
};

const EditRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updatedRequest = await ReturnRequest.findByIdAndUpdate(
      id,
      { status: data.status },
      { new: true }
    );
    return res.status(200).json({
      status: true,
      request: updatedRequest,
    });
  } catch (err) {
    console.log(err);
    return res.status(501).json({ message: "Internal server error" });
  }
};

const GetSalesRankingList = async (req: Request, res: Response) => {
  try {
    const { start_at, end_at } = req.query;
    const startDate = new Date(Number(start_at));
    const endDate = new Date(Number(end_at));

    const orders = await Order.find({
      createdAt: { $gte: startDate, $lte: endDate },
    }).populate([
      { path: "customer", select: { email: 1, name: 1 } },
      { path: "items.product", select: { itemNo: 1, name: 1, photo: 1 } },
    ]);

    let items: Array<any> = [];

    orders.forEach((order: any) => {
      order.items.forEach((item: any) => {
        let index = -1;
        if (item.product) {
          index = items.findIndex(
            (i: any) => i.product && i.product._id === item.product._id
          );
        }
        if (index !== -1) {
          items[index].quantity += item.quantity;
          items[index].amount += item.quantity * item.pricePerItem;
        } else {
          items.push({
            product: item.product,
            quantity: item.quantity,
            amount: item.quantity * item.pricePerItem,
          });
        }
      });
    });

    items.sort((a: any, b: any) => b.quantity - a.quantity);
    return res.status(200).json({
      success: true,
      rankings: items.map((i: any, index: number) => {
        return { ...i, index: index + 1 };
      }),
    });
  } catch (err) {
    console.log(err);
    return res.status(501).json({ message: "Internal server error" });
  }
};

const CompareDate = (date1: Date, date2: Date) => {
  return (
    date1.getFullYear() == date2.getFullYear() &&
    date1.getMonth() == date2.getMonth() &&
    date1.getDate() == date2.getDate()
  );
};

const GetInventoryTrendList = async (req: Request, res: Response) => {
  try {
    const { start_at, end_at, product_name } = req.body;
    const startDate = new Date(Number(start_at));
    const endDate = new Date(Number(end_at));
    const products = await Product.find({
      name: product_name,
      createdAt: { $gte: startDate, $lte: endDate },
    });
    let items: Array<any> = [];

    products.sort((a: any, b: any) => a.createdAt - b.createdAt);
    for (var i = 0; i < products.length; i++) {
      const product = products[i];

      if (
        items.length == 0 ||
        !CompareDate(items[items.length - 1].date, product.createdAt)
      ) {
        items.push({
          date: product.createdAt,
          openingCount: product.quantity,
          salesCount: 0,
          adjustCount: 0,
          closingCount: 0,
        });
      } else {
        items[items.length - 1].openingCount += product.quantity;
      }
      const orders = await Order.find({
        createdAt: {
          $gte: new Date(
            product.createdAt.getFullYear(),
            product.createdAt.getMonth(),
            product.createdAt.getDate()
          ),
          $lte: new Date(
            product.createdAt.getFullYear(),
            product.createdAt.getMonth(),
            product.createdAt.getDate() + 1
          ),
        },
      });
      for (var j = 0; j < orders.length; j++) {
        const order = orders[j];
        for (var k = 0; k < order.items.length; k++) {
          if (order.items[k].product?.toString() == product._id.toString()) {
            items[items.length - 1].salesCount += order.items[k].quantity;
          }
        }
      }

      let adjustments = await Adjustment.find({
        createdAt: {
          $gte: new Date(
            product.createdAt.getFullYear(),
            product.createdAt.getMonth(),
            product.createdAt.getDate()
          ),
          $lte: new Date(
            product.createdAt.getFullYear(),
            product.createdAt.getMonth(),
            product.createdAt.getDate() + 1
          ),
        },
      });
      adjustments = await adjustments.filter((adjustment: any) => {
        return adjustment.product.toString() == product._id.toString();
      });
      for (var j = 0; j < adjustments.length; j++) {
        const adjustment = adjustments[j];
        items[items.length - 1].adjustCount += adjustment.quantity;
      }
    }
    for (var i = 0; i < items.length; i++) {
      const item = items[i];
      item.closingCount =
        item.openingCount - item.salesCount + item.adjustCount;
    }
    return res.status(200).json({
      success: true,
      trends: items,
    });
  } catch (err) {
    console.log(err);
    return res.status(501).json({ message: "Internal server error" });
  }
};

const ExportOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const data = await Order.findOne({ orderId: id }).populate([
      { path: "customer", select: { email: 1, name: 1, address: 1 } },
      { path: "items.product", select: { name: 1, photo: 1 } },
    ]);
    const setting = await Setting.find();

    if (data) {
      const PDFDocument = require("pdfkit");

      // Create a document
      const doc = new PDFDocument({ size: "A4" });
      doc.pipe(fs.createWriteStream(`public/${data.orderId}.pdf`));

      doc.font("src/resources/fonts/Source Han Sans CN Light.otf");
      //LOGO
      {
        doc.image(`public/${setting[0]?.pages?.dashboard?.logo}`, 450, 30, {
          fit: [100, 100],
          align: "center",
          valign: "center",
        });
      }

      //Top detail
      {
        doc.moveDown(4);
        doc.fontSize(11);
        doc.text(`珍品匯有限公司`, {
          align: "right",
        });
        doc.text(`香港屯門天后路 18 號南豐工業城 1 座 607 室`, {
          align: "right",
        });

        doc.fontSize(19);
        doc.fillColor("darkgreen");
        doc.text("INVOICE", {
          align: "left",
          continued: true,
        });
        doc.fillColor("black");
        doc.fontSize(11);
        doc.text(`+852-3795 7455`, {
          align: "right",
        });
        doc.fillColor("black");
        doc.text(`cot.info813@gmail.com`, {
          align: "right",
        });

        doc.fontSize(11);
        doc.fillColor("darkgreen");

        let invoiceNum = "";
        for (var i = 0; i < 5 - (data.orderId + "").length; i++) {
          invoiceNum = "0" + invoiceNum;
        }
        invoiceNum = invoiceNum + data.orderId;

        doc.text(`# INV-${invoiceNum}`, {
          align: "left",
          continued: true,
        });

        doc
          .moveTo(50, 240)
          .lineTo(550, 240)
          .lineWidth(2)
          .fillOpacity(0.8)
          .fillAndStroke("gray", "gray");
      }

      doc.fillAndStroke("black", "black");
      //Shipping Information
      {
        doc.moveDown(3);

        doc.fontSize(12);
        doc.fillColor("black");
        doc.text("Shipping Information", 40, 260, {
          align: "left",
        });

        doc.fontSize(11);
        doc.moveDown(2);
        doc.text(`Name: `, 50, 290, {
          width: 50,
          align: "right",
        });
        const customer: any = data.customer;
        doc.text(`${customer.name}`, 110, 290, {
          width: 100,
          align: "left",
        });

        doc.moveDown();
        doc.text(`Email: `, 50, 310, {
          width: 50,
          align: "right",
        });
        doc.text(`${data.contactInfo?.email}`, 110, 310, {
          width: 150,
          align: "left",
        });

        doc.moveDown();
        doc.text(`Phone: `, 50, 330, {
          width: 50,
          align: "right",
        });
        doc.text(`${data.contactInfo?.phone}`, 110, 330, {
          width: 150,
          align: "left",
        });

        doc.moveDown();
        doc.text(`Address: `, 50, 350, {
          width: 50,
          align: "right",
        });
        doc.text(`${data.shippingAddress}`, 110, 350, {
          width: 150,
          align: "left",
        });
      }

      doc.rect(350, 270, 100, 25 * 5).fillAndStroke("#afa291", "#afa291");

      doc.fillAndStroke("black", "black");
      //Order details
      {
        doc.moveDown();
        doc.fontSize(10);
        doc.fillColor("black");
        doc.lineWidth(0.5);
        doc.rect(350, 270, 100, 25).stroke();
        doc.rect(450, 270, 110, 25).stroke();
        doc.rect(350, 295, 100, 25).stroke();
        doc.rect(450, 295, 110, 25).stroke();
        doc.rect(350, 320, 100, 25).stroke();
        doc.rect(450, 320, 110, 25).stroke();
        doc.rect(350, 345, 100, 25).stroke();
        doc.rect(450, 345, 110, 25).stroke();
        doc.rect(350, 370, 100, 25).stroke();
        doc.rect(450, 370, 110, 25).stroke();
        doc.text("Order No.", 350, 280, {
          width: 95,
          height: 25,
          align: "right",
        });
        doc.text("Order Date", 350, 305, {
          width: 95,
          height: 25,
          align: "right",
        });
        doc.text("Payment Method", 350, 330, {
          width: 95,
          height: 25,
          align: "right",
        });
        doc.text("Invoice Date", 350, 355, {
          width: 95,
          height: 25,
          align: "right",
        });
        doc.text("Amount Due", 350, 380, {
          width: 95,
          height: 25,
          align: "right",
        });
        doc.text(`#${data.orderId}`, 455, 280, {
          width: 95,
          height: 25,
          align: "left",
        });
        const year: number = data.createdAt.getFullYear();
        const month: number = data.createdAt.getMonth() + 1;
        const date: number = data.createdAt.getDate();
        doc.text(`${year}-${month}-${date}`, 455, 305, {
          width: 95,
          height: 25,
          align: "left",
        });
        doc.text(`${data.paymentMethod}`, 455, 330, {
          width: 95,
          height: 25,
          align: "left",
        });
        doc.text(`${new Date().toISOString().slice(0, 10)}`, 455, 355, {
          width: 95,
          height: 25,
          align: "left",
        });
        let amountDue = (
          data.items.reduce(
            (pre: number, cur: any) => pre + cur.pricePerItem * cur.quantity,
            0
          ) + data.fee
        ).toFixed(2);
        doc.text(`$${amountDue}`, 455, 380, {
          width: 100,
          height: 25,
          align: "left",
        });
      }

      //Items
      doc.rect(60, 450, 500, 25).fillAndStroke("#afa291", "#afa291");
      doc
        .rect(360, 475 + (data.items.length + 3) * 25, 200, 25)
        .fillAndStroke("#afa291", "#afa291");
      doc.fillAndStroke("black", "black");

      //TableHeader
      {
        doc.rect(60, 450, 100, 25).stroke();
        doc.rect(160, 450, 100, 25).stroke();
        doc.rect(260, 450, 100, 25).stroke();
        doc.rect(360, 450, 100, 25).stroke();
        doc.rect(460, 450, 100, 25).stroke();

        doc.text("Item No.", 60, 460, {
          width: 100,
          height: 25,
          align: "center",
        });

        doc.text("Item Name", 160, 460, {
          width: 100,
          height: 25,
          align: "center",
        });
        doc.text("Price", 260, 460, {
          width: 100,
          height: 25,
          align: "center",
        });
        doc.text("Qty", 360, 460, {
          width: 100,
          height: 25,
          align: "center",
        });
        doc.text("Total", 460, 460, {
          width: 100,
          height: 25,
          align: "center",
        });
      }

      //TableContent
      for (var i = 0; i < data.items.length; i++) {
        doc.rect(60, 475 + i * 25, 100, 25).stroke();
        doc.rect(160, 475 + i * 25, 100, 25).stroke();
        doc.rect(260, 475 + i * 25, 100, 25).stroke();
        doc.rect(360, 475 + i * 25, 100, 25).stroke();
        doc.rect(460, 475 + i * 25, 100, 25).stroke();
        let product = null;
        if (data.items[i].product) {
          product = await Product.findById(data?.items[i]?.product?._id);
        }

        doc.text(
          `${product ? product?.itemNo : "Unknown"}`,
          60,
          475 + i * 25 + 10,
          {
            width: 100,
            height: 25,
            align: "center",
          }
        );

        doc.text(
          `${product ? product?.name : "Unknown"}`,
          160,
          475 + i * 25 + 10,
          {
            width: 100,
            height: 25,
            align: "center",
          }
        );

        doc.text(`$${data.items[i].pricePerItem}`, 260, 475 + i * 25 + 10, {
          width: 100,
          height: 25,
          align: "center",
        });

        doc.text(`${data.items[i].quantity}`, 360, 475 + i * 25 + 10, {
          width: 100,
          height: 25,
          align: "center",
        });
        const item: any = data.items[i];
        doc.text(
          `$${item.pricePerItem * item.quantity}`,
          460,
          475 + i * 25 + 10,
          {
            width: 100,
            height: 25,
            align: "center",
          }
        );
      }

      //Money Detail
      {
        doc.rect(60, 450, 500, 25 * (data.items.length + 4 + 1)).stroke();
        for (var i = 0; i < 4; i++) {
          doc.rect(360, 475 + (data.items.length + i) * 25, 200, 25).stroke();
        }

        doc.text("SubTotal: ", 360, 475 + data.items.length * 25 + 10, {
          width: 100,
          align: "right",
        });

        doc.text(
          "Delivery Fee: ",
          360,
          475 + (data.items.length + 1) * 25 + 10,
          {
            width: 100,
            align: "right",
          }
        );

        doc.text("Discount: ", 360, 475 + (data.items.length + 2) * 25 + 10, {
          width: 100,
          align: "right",
        });

        doc.text(
          "Grand Total: ",
          360,
          475 + (data.items.length + 3) * 25 + 10,
          {
            width: 100,
            align: "right",
          }
        );

        let amountDue = (
          data.items.reduce(
            (pre: number, cur: any) => pre + cur.pricePerItem * cur.quantity,
            0
          ) + data.fee
        ).toFixed(2);
        doc.text(
          `$${data.items
            .reduce(
              (pre: number, cur: any) => pre + cur.pricePerItem * cur.quantity,
              0
            )
            .toFixed(2)}`,
          470,
          475 + data.items.length * 25 + 10,
          {
            width: 100,
            align: "left",
          }
        );

        doc.text(`$${data.fee}`, 470, 475 + (data.items.length + 1) * 25 + 10, {
          width: 100,
          align: "left",
        });

        doc.text(`$${0}`, 470, 475 + (data.items.length + 2) * 25 + 10, {
          width: 100,
          align: "left",
        });

        doc.text(
          `$${amountDue}`,
          470,
          475 + (data.items.length + 3) * 25 + 10,
          {
            width: 100,
            align: "left",
          }
        );

        doc.text("Remark: ", 50, doc.y + 20);
      }

      // Finalize PDF file
      doc.end();
      return res.status(200).json({
        success: true,
        path: `${data.orderId}.pdf`,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(501).json({ message: "Internal server error" });
  }
};

const DeleteInvoice = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const filePath = "public/" + orderId + ".pdf";
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) throw err;
      });
    }
    return res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
  }
};

export const OrderController = {
  CreateOrder,
  CreateRequest,
  EditOrder,
  EditRequest,
  GetRequestList,
  GetOrderList,
  GetOrderListByCustomer,
  GetSalesRankingList,
  GetInventoryTrendList,
  ExportOrder,
  DeleteInvoice,
};
