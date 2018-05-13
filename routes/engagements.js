const express = require('express');
const router = express.Router();
const moment = require('moment');
const User = require('../models/user');
const Engagement = require('../models/engagement_form');

// new self review form
router.get('/submit_engagement_survey', function(req, res){
  res.render('engagement_form', {
    title: 'Submit Engagement Form'
  });
});

// submit new survay 
router.post('/submit_engagement_survey', function(req, res){
  // Express validator
  req.checkBody('q1', 'An answer to question 1 is required').notEmpty();
  req.checkBody('q2', 'An answer to question 1 is required').notEmpty();
  req.checkBody('q3', 'An answer to question 1 is required').notEmpty();
  req.checkBody('q4', 'An answer to question 1 is required').notEmpty();
  req.checkBody('q5', 'An answer to question 1 is required').notEmpty();
  req.checkBody('q6', 'An answer to question 1 is required').notEmpty();
 
  // Get errors
  let errors = req.validationErrors();

  if(errors){
    res.render('enagagement_form', {
      title: 'Submit Engagement Form',
      errors: errors
    });
  } else {
    let engagement = new Engagement();
    engagement.author = req.user.name;
    engagement.authorTeam = req.user.team;
    engagement.q1 = req.body.q1;
    engagement.q2 = req.body.q2;
    engagement.q3 = req.body.q3;
    engagement.q4 = req.body.q4;
    engagement.q5 = req.body.q5;
    engagement.q6 = req.body.q6;

    engagement.save(function(err){
      if(err) {
        console.error(err);
        return;
      } else {
        req.flash('success', 'Engagement Survay Submitted');
        res.redirect('/home');
      }
    });
  }
});

// get single survay
router.get('/:id', function(req, res){
  Engagement.findById(req.params.id, function(err, engagements){
    res.render('engagement_view', {
      engagements:engagements,
      moment:moment
    });
  });
});


module.exports = router;