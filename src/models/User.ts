import { model, Schema } from "mongoose";

const UserSchema = new Schema({
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  avatar: {
    type: String,
  },
  status: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ["SUPER_ADMIN", "ADMIN"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = model("users", UserSchema);

export default User;
