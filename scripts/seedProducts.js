import dotenv from "dotenv";
import mongoose from "mongoose";
import Product from "../model/productModel.js";

dotenv.config();

const products = [
  {
    name: "Xvox",
    description:
      "XVox is a tempo based compressor, a perfect tool for creating tight and upfront vocal signals. It works on tempo given by user, based on that it automatically calculates attack and release times for accurate compressed signals.",
    downloadLink:
      "https://www.mediafire.com/file/lglma2l0w34gi36/XVOX.zip/file",
    imageUrl: "/xvox.jpg",
    status: "Active",
  },
  {
    name: "Switcher",
    description:
      "Switcher is a stereo signal enhancement and testing plugin. It contains all essential switches for left and right channels. A small but powerful plugin for mixing engineer to test left and right channel's signal in all possible ways.",
    downloadLink:
      "https://www.mediafire.com/file/7y647yjt5890czr/Switcher.zip/file",
    imageUrl: "/switcher.jpg",
    status: "Active",
  },
];

async function seed() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in .env");
    }

    await mongoose.connect(process.env.MONGO_URI);

    for (const product of products) {
      const existing = await Product.findOne({ name: product.name });

      if (existing) {
        console.log(`⚠️  ${product.name} already exists, skipping.`);
        continue;
      }

      await Product.create(product);
      console.log(`✅ Seeded ${product.name}`);
    }
  } catch (error) {
    console.error("❌ Product seed failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seed();
