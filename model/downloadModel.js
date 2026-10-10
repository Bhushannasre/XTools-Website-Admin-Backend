import mongoose from "mongoose";

// Read-side mirror of the public Xtools backend's downloads collection.
// Both applications connect to the same MongoDB database.
const downloadSchema = new mongoose.Schema(
  {
    // Matches XtoolsBackend's downloadModel.js: the public id is the
    // product's Mongo ObjectId string, not a number.
    productId: { type: String },
    productName: { type: String },
    downloadLink: { type: String },
  },
  {
    timestamps: true,
    collection: "downloads",
    strict: false,
  }
);

const Download = mongoose.model("Download", downloadSchema);

export default Download;
