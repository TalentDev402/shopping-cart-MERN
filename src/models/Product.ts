import { model, Schema } from "mongoose";
import Supplier from "./Supplier";
import Tag from "./Tag";
import Category from "./Category";

const ProductSchema = new Schema({
  itemNo: {
    type: String,
    require: true,
    unique: true,
  },
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  supplier: {
    type: Schema.Types.ObjectId,
    ref: Supplier,
  },
  photo: {
    type: String,
  },
  thumbnails: [{
    type: String
  }],
  alertQuantity: {
    type: Number,
    default: 0
  },
  quantity: {
    type: Number,
    default: 0,
  },
  currency: {
    type: String,
  },
  category: {
    category: {
      type: Schema.Types.ObjectId,
      ref: Category,
    },
    pos: [],
  },
  tags: [
    {
      type: Schema.Types.ObjectId,
      ref: Tag,
    },
  ],
  purchasePrice: {
    type: Number,
    default: 0,
  },
  sellingPrice: {
    type: Number,
    default: 0,
  },
  status: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = model("products", ProductSchema);

export default Product;
