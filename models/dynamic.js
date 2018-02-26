const mongoose = require('mongoose');

// Article schema
const dynamicSchema = mongoose.Schema({
  date: { 
    type: Date, 
    default: Date.now 
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
    title:,
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

const Article = module.exports = mongoose.model('Article', articleSchema);