const mongoose = require('mongoose');

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
});

const User = module.exports = mongoose.model('User', UserSchema);