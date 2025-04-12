import { Schema, model } from "mongoose";

const CategorySchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  subCategory: [],
});

const Category = model("categories", CategorySchema);

export default Category;
