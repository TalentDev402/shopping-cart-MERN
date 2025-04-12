import { Request, Response } from "express";
import nodemailer, { Transporter } from "nodemailer";
import Order from "../models/Order";

const ContactUs = async (req: Request, res: Response) => {
  try {
    const { email, name, message } = req.body;

    const transporter: Transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: true,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: { rejectUnauthorized: false },
    });

    const html = `
        <html>
            <head>
                <style>
                * {
                    padding: 0;
                    margin: 0;
                }
                </style>
            <head/>
            <body>
                <h4>Full name: ${name} </h4>
                <h4>Email address: ${email} </h4>
                <h4>Message: ${message} </h4>
            <body>
        <html>
    `;

    await transporter.sendMail({
      from: email,
      to: process.env.EMAIL_USERNAME,
      subject: "Cotlife新訊息通知",
      html: html,
    });

    return res
      .status(200)
      .json({ status: true, message: "Your message submitted successfully." });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const NewOrder = async (orderId: any) => {
  const order: any = await Order.findOne({ orderId: orderId }).populate([
    { path: "customer" },
    { path: "items.product" },
  ]);

  const transporter: Transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: true,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: { rejectUnauthorized: false },
  });

  let subtotal = 0;
  let itemData = "";
  order.items.forEach((item: any) => {
    itemData += `
        <tr>
            <td>${item.product.name}</td>
            <td>${item.quantity}</td>
            <td>$${item.pricePerItem}</td>
            <td>$${item.pricePerItem * item.quantity}</td>
        </tr>`;
    subtotal += item.quantity * item.pricePerItem;
  });

  const html = `
    <html>
        <head>
            <style>
                * {
                    padding: 0;
                    margin: 0;
                }
                table, tr, th, td {
                    border:1px solid #000000; 
                    border-collapse: collapse;
                }
                td, th {
                    padding: 10px;
                }
                tr td:nth-child(n+2) {
                    text-align: center;
                    padding: 10px 30px;
                }
                th {
                    background-color: #DDD;
                }
                .last-row {
                    background-color: #DDD;
                }
            </style>
        <head/>
        <body>
            <h4>Order No: ${order.orderId} </h4>
            <h4>Order Date: ${new Date(
              order.createdAt
            ).toLocaleDateString()} </h4>
            <h4>Name: ${order.customer.name} </h4>
            <h4>Phone: ${order.contactInfo.phone} </h4>
            <h4>Email: ${order.contactInfo.email} </h4>
            <h4>Address: ${order.shippingAddress} </h4>
            <h4>Payment Method: ${order.paymentMethod} </h4>
            <br/>
            <table>
                <thead>
                    <tr>
          	            <th>Item name<br/>商品名稱</th>
                        <th>Price<br/>單價</th>
                        <th>Q'ty<br/>數量</th>
                        <th>Amount<br/>小計</th>
                    </tr>
                </thead>
                <tbody>
        	        ${itemData}
                    <tr>
            	        <td>合計 SubTotal:</td>
                        <td colspan="3">$${subtotal}</td>
                    </tr>
                    <tr>
            	        <td>運費 Delivery fee:</td>
                        <td colspan="3">$${order.fee}</td>
                    </tr>
                    <tr>
            	        <td>折扣 Discount:</td>
                        <td colspan="3">$0</td>
                    </tr>
                    <tr>
            	        <td class="last-row">總金額 Grand Total:</td>
                        <td colspan="3" class="last-row">$${
                          subtotal + order.fee
                        }</td>
                    </tr>
                </tbody>
            </table>
        <body>
    <html>
    `;

  await transporter.sendMail({
    from: order.contactInfo.email,
    to: process.env.EMAIL_USERNAME,
    subject: "Cotlife新訂單通知",
    html: html,
  });
};

export const EmailController = {
  ContactUs,
  NewOrder,
};
