import Subscriber from "../model/subscriptionsModel.js";

export async function getSubscribers(req, res) {
  try {
    const { search } = req.query;
    const filter = {};
    if (search) {
      filter.email = { $regex: search, $options: "i" };
    }

    const subscribers = await Subscriber.find(filter)
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({ data: subscribers });
  } catch (err) {
    console.error("Error fetching subscribers:", err);
    return res.status(500).json({ error: "Failed to fetch subscribers" });
  }
}

export async function updateSubscriberStatus(req, res) {
  try {
    const { isActive } = req.body;
    if (typeof isActive !== "boolean") {
      return res.status(400).json({ error: "isActive must be true or false" });
    }

    const updated = await Subscriber.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).populate("userId", "name email");

    if (!updated) {
      return res.status(404).json({ error: "Subscriber not found" });
    }

    return res.status(200).json({ message: "Subscriber updated", data: updated });
  } catch (err) {
    return res.status(500).json({ error: "Failed to update subscriber" });
  }
}

export async function deleteSubscriber(req, res) {
  try {
    const deleted = await Subscriber.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Subscriber not found" });
    }
    return res.status(200).json({ message: "Subscriber deleted" });
  } catch (err) {
    return res.status(500).json({ error: "Failed to delete subscriber" });
  }
}
