import jwt from "jsonwebtoken";

export function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Please sign in as admin to continue" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({ error: "Admin access only" });
    }

    req.admin = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Session expired, please sign in again" });
  }
}
