import User from "../model/userModel.js";          // fixed path + filename
import Subscriber from "../model/subscriptionsModel.js"; // fixed path + filename
import { Contact } from "../model/contactModel.js";
import Download from "../model/downloadModel.js";

export const getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalSubscriptions, totalContacts, totalDownloads] = await Promise.all([
      User.countDocuments(),
      Subscriber.countDocuments(),
      Contact.countDocuments(),
      Download.countDocuments(),
    ]);

    return res.status(200).json({
      totalUsers,
      totalSubscriptions,
      totalContacts,
      totalDownloads,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getDashboardGraphData = async (req, res) => {
  try {
    const result = [];

    for (let i = 6; i >= 0; i--) {
      const start = new Date();
      start.setDate(start.getDate() - i);
      start.setHours(0, 0, 0, 0);

      const end = new Date(start);
      end.setHours(23, 59, 59, 999);

      const [newUsers, newSubscribers, newDownloads] = await Promise.all([
        User.countDocuments({ createdAt: { $gte: start, $lte: end } }),
        Subscriber.countDocuments({ createdAt: { $gte: start, $lte: end } }),
        Download.countDocuments({ createdAt: { $gte: start, $lte: end } }),
      ]);

      result.push({
        date: start.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        newUsers,
        newSubscribers,
        newDownloads,
      });
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
