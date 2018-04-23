const express = require('express');
const router = express.Router();
const moment = require('moment');
const User = require('../models/user');
const PerReview = require('../models/performance_review');
const Engagement = require('../models/engagement_form');

//// Gender

router.get('/add_self_review', function(req, res){
  res.render('add_self_review', {
    title: 'Add Self Review'
  });
});

router.get('/listUsersGen', function (req, res) {
  User.find((err, users) => {
    if (err) {
      res.status(500).send(err);
      console.error(err);
    } else {
      res.json(users);
    }
  });
});

module.exports = router;