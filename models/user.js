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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PerReview',
    required: false
  }]
});

// module.exports.getAll = function(callback){ 
// 	User.find().exec(callback);	
// }

// module.exports.getUser= function(req,id, callback){
//   User.findOne(req.params.id)
//     .populate('reviews')
//     .exec(callback);
// }

const User = module.exports = mongoose.model('User', UserSchema);