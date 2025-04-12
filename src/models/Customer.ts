import { model, Schema } from "mongoose";

const CustomerSchema = new Schema({
    email: {
        type: String,
        require: true,
    },
    password: {
        type: String,
    },
    name: {
        type: String,
    },
    points: {
        type: Number,
        default: 0,
    },
    phone: {
        type: String,
        default: ""
    },
    address: {
        type: String,
        default: ""
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Customer = model("customers", CustomerSchema);

export default Customer;