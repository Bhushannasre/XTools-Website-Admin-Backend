

import Product from "../model/productModel.js";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
// Only JPG/JPEG accepted. This is the source of truth — enforced here
// independently of the frontend's own check, since a request can always
// bypass the browser's file picker. Keep this in sync with
// ALLOWED_IMAGE_TYPES in adminfrontend's src/pages/Products.jsx if you
// change which formats are allowed.
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/jpg"]);

function sanitizeProduct(product) {
  const item = product.toObject ? product.toObject() : { ...product };
  delete item.imageData;
  return {
    ...item,
    id: item._id?.toString?.() || item.id,
    link: item.downloadLink,
    imageUrl: item.imageUrl || "",
  };
}

function parseImage(image) {
  if (!image) return null;

  const { data, contentType } = image;

  if (!ALLOWED_IMAGE_TYPES.has(contentType)) {
    const error = new Error("Only JPG and JPEG images are accepted");
    error.status = 400;
    throw error;
  }

  const buffer = Buffer.from(data, "base64");

  if (!buffer.length || buffer.length > MAX_IMAGE_BYTES) {
    const error = new Error("Image must be smaller than 5 MB");
    error.status = 400;
    throw error;
  }

  return { buffer, contentType };
}

export async function getProducts(req, res) {
  try {
    const { search = "", status = "All" } = req.query;
    const filter = {};

    if (status !== "All") filter.status = status;

    if (search.trim()) {
      filter.$or = [
        { name: { $regex: search.trim(), $options: "i" } },
        { description: { $regex: search.trim(), $options: "i" } },
      ];
    }

    const products = await Product.find(filter)
      .select("-imageData")
      .sort({ createdAt: -1 });

    return res.status(200).json({ data: products.map(sanitizeProduct) });
  } catch (error) {
    console.error("Get products error:", error);
    return res.status(500).json({ error: "Failed to fetch products" });
  }
}

export async function createProduct(req, res) {
  try {
    const { name, description = "", link, status = "Active", image } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ error: "Product name is required" });
    }

    if (!link?.trim()) {
      return res.status(400).json({ error: "Product download link is required" });
    }

    const parsedImage = parseImage(image);

    const product = await Product.create({
      name: name.trim(),
      description: description?.trim() || "",
      downloadLink: link.trim(),
      status,
      ...(parsedImage
        ? {
            imageData: parsedImage.buffer,
            imageContentType: parsedImage.contentType,
            imageUrl: "",
          }
        : {}),
    });

    return res.status(201).json({
      message: "Product created successfully",
      data: sanitizeProduct(product),
    });
  } catch (error) {
    console.error("Create product error:", error);
    return res.status(error.status || 500).json({
      error: error.message || "Failed to create product",
    });
  }
}

export async function updateProduct(req, res) {
  try {
    const { name, description = "", link, status, image } = req.body;
    const product = await Product.findById(req.params.id).select("+imageData");

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (!name?.trim()) {
      return res.status(400).json({ error: "Product name is required" });
    }

    if (!link?.trim()) {
      return res.status(400).json({ error: "Product download link is required" });
    }

    product.name = name.trim();
    product.description = description?.trim() || "";
    product.downloadLink = link.trim();
    if (status) product.status = status;

    const parsedImage = parseImage(image);
    if (parsedImage) {
      product.imageData = parsedImage.buffer;
      product.imageContentType = parsedImage.contentType;
      product.imageUrl = "";
    }

    await product.save();

    return res.status(200).json({
      message: "Product updated successfully",
      data: sanitizeProduct(product),
    });
  } catch (error) {
    console.error("Update product error:", error);
    return res.status(error.status || 500).json({
      error: error.message || "Failed to update product",
    });
  }
}

export async function deleteProduct(req, res) {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete product error:", error);
    return res.status(500).json({ error: "Failed to delete product" });
  }
}