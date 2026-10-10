import { Contact } from "../model/contactModel.js";

export async function getContacts(req, res) {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    // Empty list is not an error — always 200 so the frontend can show a
    // proper empty state instead of an error screen.
    return res.status(200).json({ data: contacts });
  } catch (err) {
    return res.status(500).json({ error: "Error occurred while fetching contacts." });
  }
}

export async function getContactById(req, res) {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: "Contact not found." });
    }
    return res.status(200).json({ data: contact });
  } catch (err) {
    return res.status(500).json({ error: "Error occurred while fetching contact." });
  }
}

export async function updateContact(req, res) {
  try {
    const { name, email, phone, message, status } = req.body;

    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, message, status },
      { new: true, runValidators: true }
    );

    if (!updatedContact) {
      return res.status(404).json({ error: "Contact not found." });
    }

    return res.status(200).json({ message: "Contact updated successfully.", data: updatedContact });
  } catch (err) {
    return res.status(500).json({ error: "Error occurred while updating contact." });
  }
}

export async function deleteContact(req, res) {
  try {
    const deletedContact = await Contact.findByIdAndDelete(req.params.id);
    if (!deletedContact) {
      return res.status(404).json({ error: "Contact not found." });
    }
    return res.status(200).json({ message: "Contact deleted successfully." });
  } catch (err) {
    return res.status(500).json({ error: "Error occurred while deleting contact." });
  }
}
