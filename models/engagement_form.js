const mongoose = require('mongoose');

// Article schema
const engagementSchema = mongoose.Schema({
  date: { 
    type: Date, 
    default: Date.now 
  },
  author: {
    type: String
  },
  authorTeam: {
    type: String
  },
  q1: {
    type: String,
    required: true
  },
  q2: {
    type: String,
    required: true
  },
  q3: {
    type: String,
    required: true
  },
  q4: {
    type: String,
    required: true
  },
  q5: {
    type: String,
    required: true
  },
  q6: {
    type: String,
    required: true
  }
});

const engagement = module.exports = mongoose.model('Engagement', engagementSchema);