const mongoose = require('mongoose');
const PerReview = require('./performance_review');

// User Schema
const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  username: {
    type: String,
    unique:true,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  team: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  reviews: [{
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PerReview'
    },
    date: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PerReview'
    },
    userSelected:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PerReview'
    },
    overallRes: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PerReview'
    }
  }]
});

const User = module.exports = mongoose.model('User', UserSchema);