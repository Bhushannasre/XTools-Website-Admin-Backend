import User from "../model/userModel.js";

export async function getUsers(req, res) {
  try {
    const { search } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // password is select:false on the schema, so it's already excluded by
    // default — .select("-password") here is just belt-and-suspenders in
    // case someone later adds .select("+password") upstream.
    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({ data: users });
  } catch (err) {
    console.error("Error fetching users:", err);
    return res.status(500).json({ error: "Failed to fetch users" });
  }
}

export async function deleteUser(req, res) {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ message: "User deleted" });
  } catch (err) {
    console.error("Error deleting user:", err);
    return res.status(500).json({ error: "Failed to delete user" });
  }
}