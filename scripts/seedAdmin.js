// Run this ONCE from adminbackend root: node scripts/seedAdmin.js  (or: npm run seed:admin)
// Then don't expose this file as a route — it's a one-time setup script only.

import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import AdminUser from "../model/adminModel.js";

dotenv.config();

const ADMIN_USERNAME = "AtulPusam"; // change this
const ADMIN_PASSWORD = "AtulPusam@123"; // change this

async function seedAdmin() {
  await mongoose.connect(process.env.MONGO_URI);

  const existing = await AdminUser.findOne({ username: ADMIN_USERNAME });
  if (existing) {
    console.log("⚠️  Admin already exists, skipping seed.");
    await mongoose.connection.close();
    return;
  }

  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await AdminUser.create({ username: ADMIN_USERNAME, password: hashedPassword });

  console.log("✅ Admin user created successfully.");
  await mongoose.connection.close();
}

seedAdmin().catch((err) => {
  console.error("❌ Failed to seed admin:", err.message);
  process.exit(1);
});
