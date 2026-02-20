import express from 'express';
import User from "../models/User.js";
import Group from "../models/Group.js";
import Message from "../models/Message.js";
import Report from "../models/Report.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if admin credentials
    if (email !== 'bimal@admin.com' || password !== 'laliguras') {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }
    
    // Create admin token
    const token = jwt.sign(
      { email, role: 'admin' }, 
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );
    
    res.json({ token, role: 'admin' });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Middleware to verify admin token
const adminAuth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    
    if (decoded.email !== 'bimal@admin.com' || decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized as admin' });
    }
    
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Get all users with stats
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find({})
      .select('-password')
      .lean();
    
    // Get additional stats for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const messageCount = await Message.countDocuments({ senderId: user._id });
        const groupCount = await Group.countDocuments({ members: user._id });
        
        // Get last activity (last message sent)
        const lastMessage = await Message.findOne({ senderId: user._id })
          .sort({ createdAt: -1 })
          .lean();
        
        return {
          ...user,
          messageCount,
          groupCount,
          lastActivity: lastMessage?.createdAt || null,
          totalTimeSpent: Math.floor(Math.random() * 10000) + 1000 // Placeholder - would need actual tracking
        };
      })
    );
    
    res.json(usersWithStats);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user
router.delete('/users/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete user's messages
    await Message.deleteMany({ senderId: id });
    
    // Remove user from all groups
    await Group.updateMany(
      { members: id },
      { $pull: { members: id } }
    );
    
    // Delete the user
    await User.findByIdAndDelete(id);
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user details
router.get('/users/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id).select('-password').lean();
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get user's messages
    const messages = await Message.find({ senderId: id })
      .populate('receiverId', 'fullName email')
      .populate('groupId', 'name')
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    
    // Get user's groups
    const groups = await Group.find({ members: id })
      .select('name members createdAt')
      .lean();
    
    // Get stats
    const messageCount = await Message.countDocuments({ senderId: id });
    const groupCount = await Group.countDocuments({ members: id });
    
    res.json({
      user,
      messages,
      groups,
      stats: {
        messageCount,
        groupCount,
        totalTimeSpent: Math.floor(Math.random() * 10000) + 1000 // Placeholder
      }
    });
  } catch (error) {
    console.error('Get user details error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get dashboard stats
router.get('/dashboard/stats', adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalGroups = await Group.countDocuments();
    const totalMessages = await Message.countDocuments();
    
    // Get users with most time spent (placeholder data)
    const topUsersByTime = await User.find({})
      .select('fullName email')
      .lean()
      .then(users => users.map((user, index) => ({
        ...user,
        timeSpent: Math.floor(Math.random() * 10000) + 1000 - (index * 100)
      })))
      .then(users => users.sort((a, b) => b.timeSpent - a.timeSpent).slice(0, 10));
    
    // Get message activity over time (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const messagesByDay = await Message.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Get user registration trends
    const userRegistrations = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    res.json({
      totalUsers,
      totalGroups,
      totalMessages,
      topUsersByTime,
      messagesByDay,
      userRegistrations
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all reports
router.get('/reports', adminAuth, async (req, res) => {
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
    console.error('Get reports error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update report status
router.put('/reports/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "reviewed", "resolved"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
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
      return res.status(404).json({ message: "Report not found" });
    }

    res.json({
      message: "Report status updated successfully",
      report
    });
  } catch (error) {
    console.error('Update report status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete report
router.delete('/reports/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const report = await Report.findByIdAndDelete(id);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.json({ message: "Report deleted successfully" });
  } catch (error) {
    console.error('Delete report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
