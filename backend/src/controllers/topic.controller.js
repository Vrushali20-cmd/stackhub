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
    const sort = req.query.sort || "latest";

    const skip = (page - 1) * limit;

    // base query
    const query = {
      category: categoryId,
    };

    // search filter (optional)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    // sorting logic
    let sortQuery = { createdAt: -1 }; // default = latest

    if (sort === "oldest") {
      sortQuery = { createdAt: 1 };
    }

    if (sort === "difficulty") {
      sortQuery = { difficulty: 1 };
    }

    const totalTopics = await Topic.countDocuments(query);

    const topics = await Topic.find(query)
      .sort(sortQuery)
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      message: "Topics fetched ✅",
      pagination: {
        totalTopics,
        currentPage: page,
        totalPages: Math.ceil(totalTopics / limit),
        limit,
      },
      topics,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
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
