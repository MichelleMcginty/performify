const mongoose = require('mongoose');

// Review schema
const dynamicSchema = mongoose.Schema({
  title: String,
  description: String,
  answer1: String,
  answer2: String,
  answer3: String,
  answer4: String,
  answer5: String
  // possibleAnswers:{
  //   a1: String,
  //   a2: String,
  //   a3: String,
  //   a4: String,
  //   a5: String
  // }
});

const Dynamic = module.exports = mongoose.model('Dynamic', dynamicSchema);




// name: {
  //       first: String,
  //       last: { type: String, trim: true }
  //     },
  // communication: {
  //   type: String,
  //   required: true
  // },
  // passion: {
  //   type: String,
  //   required: true
  // },
  // development: {
  //   type: String,
  //   required: true
  // },
  // overallResult: {
  //   type: String,
  //   required: true
  // },
  // comments: {
  //   type: String,
  //   required: true
  // }