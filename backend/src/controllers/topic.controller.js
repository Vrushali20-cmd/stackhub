import { Topic } from "../models/topic.model.js";
import { Category } from "../models/category.model.js";

/**
 * CREATE TOPIC (Protected)
 */
export const createTopic = async (req, res) => {
  try {
    const { title, content, codeSnippet, difficulty, categoryId } = req.body;

    if (!title || !content || !categoryId) {
      return res.status(400).json({
        success: false,
        message: "title, content and categoryId are required",
      });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const topic = await Topic.create({
      title,
      content,
      codeSnippet,
      difficulty,
      category: categoryId,
    });

    return res.status(201).json({
      success: true,
      message: "Topic created ✅",
      topic,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET TOPICS BY CATEGORY (Public)
 */
export const getTopicsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const search = req.query.search;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const query = {
      category: categoryId,
    };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    const totalTopics = await Topic.countDocuments(query);

    const topics = await Topic.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      topics,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



/**
 * GET SINGLE TOPIC BY ID (Public)
 */
export const getTopicById = async (req, res) => {
  try {
    const { topicId } = req.params;

    const topic = await Topic.findById(topicId).populate(
      "category",
      "name slug"
    );

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: "Topic not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Topic fetched ✅",
      topic,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * UPDATE TOPIC (Protected)
 */
export const updateTopic = async (req, res) => {
  try {
    const { topicId } = req.params;

    const topic = await Topic.findByIdAndUpdate(
      topicId,
      req.body,
      { new: true }
    );

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: "Topic not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Topic updated ✅",
      topic,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * DELETE TOPIC (Protected)
 */
export const deleteTopic = async (req, res) => {
  try {
    const { topicId } = req.params;

    const topic = await Topic.findByIdAndDelete(topicId);

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: "Topic not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Topic deleted ✅",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
