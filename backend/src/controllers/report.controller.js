import Report from "../models/Report.js";
import User from "../models/User.js";

export const createReport = async (req, res) => {
  try {
    const { reportedUserId, title, description } = req.body;
    const reporterId = req.user._id;

    // Validate input
    if (!reportedUserId || !title?.trim() || !description?.trim()) {
      return res.status(400).json({ 
        error: "Reported user ID, title, and description are required" 
      });
    }

    // Check if reported user exists
    const reportedUser = await User.findById(reportedUserId);
    if (!reportedUser) {
      return res.status(404).json({ error: "Reported user not found" });
    }

    // Prevent self-reporting
    if (reportedUserId.toString() === reporterId.toString()) {
      return res.status(400).json({ error: "Cannot report yourself" });
    }

    // Create new report
    const report = new Report({
      reportedUserId,
      reporterId,
      title: title.trim(),
      description: description.trim(),
    });

    await report.save();

    // Populate user details for response
    await report.populate([
      { path: "reportedUserId", select: "fullName email" },
      { path: "reporterId", select: "fullName email" }
    ]);

    res.status(201).json({ 
      message: "Report submitted successfully",
      report 
    });
  } catch (error) {
    console.error("Error creating report:", error);
    res.status(500).json({ error: "Failed to submit report" });
  }
};

export const getAllReports = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = {};
    if (status && ["pending", "reviewed", "resolved"].includes(status)) {
      filter.status = status;
    }

    const reports = await Report.find(filter)
      .populate("reportedUserId", "fullName email")
      .populate("reporterId", "fullName email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Report.countDocuments(filter);

    res.json({
      reports,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
};

export const updateReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "reviewed", "resolved"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const report = await Report.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate([
      { path: "reportedUserId", select: "fullName email" },
      { path: "reporterId", select: "fullName email" }
    ]);

    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    res.json({
      message: "Report status updated successfully",
      report
    });
  } catch (error) {
    console.error("Error updating report status:", error);
    res.status(500).json({ error: "Failed to update report status" });
  }
};

export const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;

    const report = await Report.findByIdAndDelete(id);

    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    res.json({ message: "Report deleted successfully" });
  } catch (error) {
    console.error("Error deleting report:", error);
    res.status(500).json({ error: "Failed to delete report" });
  }
};
