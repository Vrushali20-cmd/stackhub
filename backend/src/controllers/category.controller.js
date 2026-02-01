import { Category } from "../models/category.model.js";

export const createCategory = async (req, res) => {
  try {
    const { name, slug } = req.body;

    if (!name || !slug) {
      return res.status(400).json({
        success: false,
        message: "name and slug are required",
      });
    }

    const existed = await Category.findOne({ $or: [{ name }, { slug }] });

    if (existed) {
      return res.status(409).json({
        success: false,
        message: "Category already exists",
      });
    }

    const category = await Category.create({ name, slug });

    return res.status(201).json({
      success: true,
      message: "Category created ✅",
      category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Categories fetched ✅",
      categories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
