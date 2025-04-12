import { model, Schema } from "mongoose";
import Customer from "./Customer";

const ProviderSchema = new Schema({
  customer: {
    type: Schema.Types.ObjectId,
    ref: Customer
  },
  uid: {
    type: String
  },
  provider: {
    type: String,
    enum: ["Google"]
  }
});

const Provider = model("providers", ProviderSchema);

export default Provider;
