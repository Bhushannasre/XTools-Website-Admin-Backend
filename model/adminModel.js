import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"], // stored as a bcrypt hash, never plaintext
    },
    role: {
      type: String,
      default: "admin",
      enum: ["admin"],
    },
  },
  { timestamps: true }
);

const AdminUser = mongoose.model("AdminUser", adminSchema);

export default AdminUser;
