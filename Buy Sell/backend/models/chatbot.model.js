import mongoose from 'mongoose';

const ChatBot = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  history: [{
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true
    },
    text: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  lastActivity: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export const ChatSession = mongoose.model('ChatSession', ChatBot);