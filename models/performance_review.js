const mongoose = require('mongoose');

// Article schema
const perReviewSchema = mongoose.Schema({
  date: { 
    type: Date, 
    default: Date.now 
  },
  type: {
    type: String
  },
  author: {
    type: String
  },
  authorRef: {
    type: String
  },
  authorTeam: {
    type: String
  },
  userSelected: {
    type: String,
    required: true
  },
  userEmail: {
    type: String
  },
  teamwork: {
    type: String,
    required: true
  },
  results: {
    type: String,
    required: true
  },
  communication: {
    type: String,
    required: true
  },
  passion: {
    type: String,
    required: true
  },
  development: {
    type: String,
    required: true
  },
  overallResult: {
    type: String,
    required: true
  },
  comments: {
    type: String,
    required: true
  }
});

const perReview = module.exports = mongoose.model('PerReview', perReviewSchema);