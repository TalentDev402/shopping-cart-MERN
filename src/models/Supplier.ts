import { model, Schema } from "mongoose";

const SupplierSchema = new Schema({
  name: {
    type: String,
  },
  contactName: {
    type: String,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  businessNumber: {
    type: String,
  },
  logo: {
    type: String,
  },
  bankInfo: {
    bankName: {
      type: String,
    },
    branch: {
      type: String,
    },
    accountNumber: {
      type: String,
    },
    accountName: {
      type: String,
    },
  },
  address: {
    country: {
      type: String,
    },
    address: {
      type: String,
    },
    zipCode: {
      type: String,
    },
  },
  website: {
    type: String,
  },
  remarks: {
    type: {
      type: String,
      enum: ["TEXT", "FILE"],
    },
    content: {
      type: String,
    },
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

const Supplier = model("suppliers", SupplierSchema);

export default Supplier;
