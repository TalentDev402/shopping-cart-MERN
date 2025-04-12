import { Schema, model } from "mongoose";
import Customer from "./Customer";
import Product from "./Product";

const CartSchema = new Schema({
    customer: {
        type: Schema.Types.ObjectId,
        ref: Customer
    },
    items: [{
        _id: false,
        product: {
            type: Schema.Types.ObjectId,
            ref: Product
        },
        quantity: {
            type: Number
        }
    }]
});

const Cart = model("carts", CartSchema);

export default Cart;
