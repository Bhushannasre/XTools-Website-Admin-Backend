import mongoose from "mongoose";

// NOTE: this is a minimal read-side mirror of the public backend's real
// userModel.js, needed here only so this backend can run User.countDocuments()
// and populate(subscriber.userId) against the SAME "users" collection.
// strict:false means it won't strip fields that aren't declared below, so
// populate("userId","name email") still works even if the public schema's
// real field names differ slightly from this guess — but please verify the
// actual field name for a user's display name against your public
// XtoolsBackend/models/userModel.js and adjust the populate() calls in
// subscriberController.js if it isn't "name".
const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String },
  },
  { timestamps: true, strict: false }
);

const User = mongoose.model("User", userSchema);

export default User;
