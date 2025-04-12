import { Schema, model } from "mongoose";

const TagSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
});

const Tag = model("tags", TagSchema);

export default Tag;
