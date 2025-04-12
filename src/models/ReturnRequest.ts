import { model, Schema } from "mongoose";
import Order from "./Order"
import Customer from "./Customer";

const ReturnRequestSchema = new Schema({
    requestId: {
        type: Number,
        unique: true,
    },
    order: {
        type: Schema.Types.ObjectId,
        ref: Order
    },
    customer: {
        name: {
            type: String,
        },
        email: {
            type: String,
        },
        phone: {
            type: String,
        }
    },
    returnReason: {
        type: String
    },
    status: {
        type: String,
        default: "Pending",
        enum: ["Pending", "Complete", "Failed", "Rejected"]
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const ReturnRequest = model("returnrequests", ReturnRequestSchema);

export default ReturnRequest;