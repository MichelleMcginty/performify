const express = require('express');
const router = express.Router();
// dynamic review model
const Dynamic = require('../models/dynamic');
// new dynamic review form
router.get('/add', function(req, res){
  Dynamic.find((err, dynamics) => {
    if (err) {
      res.status(500).send(err);
      console.error(err);
    }
     else {
      res.render('add_dynamic-review', {
        dynamics: dynamics
      });
    } console.log(dynamics[0,1])
  });
});



// router.get('/add', function(req, res){
//   // res.render('add_dynamic-review', {
//   //   title: 'Add Review Dynamicly',
//   //   dynamics: dynamics
//   // });
//   Dynamic.find((err, dynamics) => {
//     if (err) {
//       res.status(500).send(err);
//       console.error(err);
//     }
//      else {
//       res.render('add_dynamic-review', {
//         dynamics: dynamics
//       });
//     }
//     // console.log(dynamics.title[0]);
//   });
// });


// User.find((err, users) => {
//     if (err) {
//       res.status(500).send(err);
//       console.error(err);
//     } else {
//       users.sort(sortBy('name'));
//       res.render('list_employees', {
//         users: users.sort(sortBy('name'))
//       });
//     }
//   });
// submit new dynamic review
router.post('/add', function(req, res){
  // Express validator
  req.checkBody('question', 'question is required').notEmpty();
  // req.checkBody('results', 'results is required').notEmpty();
  // req.checkBody('communication', 'communication is required').notEmpty();
  // req.checkBody('passion', 'passion is required').notEmpty();
  // req.checkBody('development', 'development is required').notEmpty();
  // req.checkBody('overallResult', 'Overall Result is required').notEmpty();
  // req.checkBody('comments', 'Comments is required').notEmpty();
  
  // Get errors
  let errors = req.validationErrors();

  if(errors){
    res.render('add_dynamic-review', {
      title: 'Add Review Dynamicly',
      errors: errors
    });
  } else {
    let dynamic = new Dynamic();
    dynamic.question = req.body.question;
    // dynamic.results = req.body.results;
    // dynamic.communication = req.body.communication;
    // dynamic.passion = req.body.passion;
    // dynamic.development = req.body.development;
    // dynamic.overallResult = req.body.overallResult;
    // dynamic.comments = req.body.comments;

    dynamic.save(function(err){
      if(err) {
        console.error(err);
        return;
      } else {
        req.flash('success', 'Dynamic Form Added');
        res.redirect('/');
      }
    });
  }
});

// load edit form
router.get('/edit/:id', function(req, res){
  Dynamic.findById(req.params.id, function(err, dynamic){
    res.render('edit-dynamic-review', {
      title: 'Edit Review',
      dynamic: dynamic
    });
  });
});

// update review
router.post('/edit/:id', function(req, res){
  let dynamic = {};
  dynamic.question = req.body.question;
  // dynamic.results = req.body.results;
  // dynamic.communication = req.body.communication;
  // dynamic.passion = req.body.passion;
  // dynamic.development = req.body.development;
  // dynamic.overallResult = req.body.overallResult;
  // dynamic.comments = req.body.comments;


  let query = {_id: req.params.id};

  Dynamic.update(query, dynamic, function(err){
    if(err) {
      console.error(err);
      return;
    } else {
      req.flash('success', 'Dynamic Review Updated');
      res.redirect('/');
    }
  })
});

// Delete post
router.delete('/:id', function(req, res){
  let query = {_id: req.params.id};

  Dynamic.remove(query, function(err){
    if(err) {
      console.error(err);
      return;
    } else {
      req.flash('success', 'Dynamic Review Deleted')
      res.send('Success');
    }
  });
});

// get single review


router.get('/list-review', function (req, res) {
  Dynamic.find((err, dynamics) => {
    if (err) {
      res.status(500).send(err);
      console.error(err);
    } else {
      // users.sort(sortBy('name'));
      res.render('list_dynamic_review', {
        dynamics: dynamics
      });
    }
  });
});

router.get('/:id', function(req, res){
  Dynamic.findById(req.params.id, function(err, dynamic){
    res.render('dynamic-review', {
      dynamic: dynamic
    });
  });
});

module.exports = router;