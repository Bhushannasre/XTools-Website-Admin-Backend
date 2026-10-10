import mongoose from "mongoose";

// This schema is shared with the public backend (XtoolsBackend/models/contactModel.js)
// via the same "Contact" collection. Keep both files identical when changing fields.
const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Invalid email format"],
    },
    phone: {
      type: String,
      required: [true, "Phone Number is required"],
      validate: {
        validator: (v) => /^\d{10}$/.test(v),
        message: "Phone number must be exactly 10 digits",
      },
    },
    message: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["open", "pending", "closed"],
      default: "open",
    },
  },
  { timestamps: true }
);

export const Contact = mongoose.model("Contact", contactSchema);
