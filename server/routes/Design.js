import express from 'express';
import Design from '../models/Design.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get all designs for user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const designs = await Design.find({ userId: req.userId }).sort({ updatedAt: -1 });
    res.json(designs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create design
router.post('/', authMiddleware, async (req, res) => {
  try {
    const design = new Design({
      userId: req.userId,
      ...req.body
    });
    await design.save();
    res.status(201).json(design);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update design
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const design = await Design.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    if (!design) {
      return res.status(404).json({ message: 'Design not found' });
    }
    res.json(design);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete design
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const design = await Design.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!design) {
      return res.status(404).json({ message: 'Design not found' });
    }
    res.json({ message: 'Design deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;