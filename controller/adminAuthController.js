import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AdminUser from "../model/adminModel.js"; // fixed: was "../models/adminModel.js"

export async function adminLogin(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  try {
    const admin = await AdminUser.findOne({ username });
    if (!admin) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      admin: { id: admin._id, username: admin.username },
    });
  } catch (err) {
    console.error("Admin login error:", err);
    return res.status(500).json({ error: "Server error during login" });
  }
}
