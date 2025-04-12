import { model, Schema } from "mongoose";
import Product from "./Product";
import Customer from "./Customer";

const OrderSchema = new Schema({
    orderId: {
        type: Number,
        unique: true,
    },
    customer: {
        type: Schema.Types.ObjectId,
        ref: Customer
    },
    contactInfo: {
        phone: {
            type: String,
        },
        email: {
            type: String
        }
    },
    shippingAddress: {
        type: String
    },
    paymentMethod: {
        type: String // PayPal, WeChat, Alipay
    },
    transactionId: {
        type: String
    },
    orderStatus: {
        type: String,
        enum: ["Pending", "Complete", "Failed", "Rejected"]
    },
    orderTrackStatus: {
        type: String,
        enum: ["ordered", "picked_by_courier", "on_the_way", "ready_for_pickup", "delivered"]
    },
    paymentStatus: {
        type: String,
        enum: ["Complete", "Pending", "Failed"]
    },
    items: [{
        _id: false,
        product: {
            type: Schema.Types.ObjectId,
            ref: Product
        },
        quantity: {
            type: Number
        },
        pricePerItem: {
            type: Number
        }
    }],
    fee: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Order = model("orders", OrderSchema);

export default Order;