import { model, Schema } from "mongoose";
import Product from "./Product";

const AdjustmentSchema = new Schema({
    adjustmentId: {
        type: Number,
        unique: true,
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: Product
    },
    quantity: {
        type: Number,
        default: 0,
    },
    reason: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Adjustment = model("adjustments", AdjustmentSchema);

export default Adjustment;
