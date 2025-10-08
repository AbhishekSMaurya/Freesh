import mongoose from 'mongoose';

const designSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    default: 'Untitled Design'
  },
  elements: {
    type: Array,
    default: []
  },
  thumbnailUrl: {
    type: String,
    default: ''
  },
  canvasData: {
    type: Object,
    default: {}
  }
}, { timestamps: true });

export default mongoose.model('Design', designSchema);