const mongoose = require('mongoose');

// Review schema
const dynamicSchema = mongoose.Schema({
  date: { 
    type: Date, 
    default: Date.now 
  },
  questionOne:{
    title: String,
    description: String,
    one: String,
    two: String,
    three: String,
    four: String,
    five: String
    },
  questionTwo:{
    title: String,
    description: String,
    one: String,
    two: String,
    three: String,
    four: String,
    five: String
  },
  comments: String
  // possibleAnswers_id: String
  // answer2: String,
  // answer3: String,
  // answer4: String,
  // answer5: String
  // possibleAnswers:{
    
  // }
});

const Dynamic = module.exports = mongoose.model('Dynamic', dynamicSchema);



// question1:{
//   title: String,
//   description: String,
//   a1: String,
//   a2: String,
//   a3: String,
//   a4: String,
//   a5: String
// },
// question2:{
//   title: String,
//   description: String,
//   a1: String,
//   a2: String,
//   a3: String,
//   a4: String,
//   a5: String
// },
// question3:{
//   title: String,
//   description: String,
//   a1: String,
//   a2: String,
//   a3: String,
//   a4: String,
//   a5: String
// },
// question4:{
//   title: String,
//   description: String,
//   a1: String,
//   a2: String,
//   a3: String,
//   a4: String,
//   a5: String
// },
// question5:{
//   title: String,
//   description: String,
//   a1: String,
//   a2: String,
//   a3: String,
//   a4: String,
//   a5: String
// },
// question6:{
//   title: String,
//   description: String,
//   a1: String,
//   a2: String,
//   a3: String,
//   a4: String,
//   a5: String
// },
// comments: String


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