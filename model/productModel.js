import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [2, "Product name must be at least 2 characters"],
      maxlength: [120, "Product name must be at most 120 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, "Description must be at most 2000 characters"],
      default: "",
    },
    downloadLink: {
      type: String,
      required: [true, "Product download link is required"],
      trim: true,
      match: [/^https?:\/\/\S+$/i, "Download link must be a valid HTTP(S) URL"],
    },
    imageUrl: {
      type: String,
      trim: true,
      default: "",
    },
    imageData: {
      type: Buffer,
      select: false,
    },
    imageContentType: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
      index: true,
    },
  },
  {
    timestamps: true,
    collection: "products",
  }
);

productSchema.index({ createdAt: -1 });
productSchema.index({ status: 1, createdAt: -1 });

const Product = mongoose.model("Product", productSchema);

export default Product;
