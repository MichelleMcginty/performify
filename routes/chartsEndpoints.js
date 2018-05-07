const express = require('express');
const router = express.Router();
const moment = require('moment');
const User = require('../models/user');
const PerReview = require('../models/performance_review');
const Engagement = require('../models/engagement_form');

function requireLoginTest (req, res, next) {
  if (!req.user) {
    req.flash('success', 'Sorry you need to be logged in to view this page Test');
    res.redirect('/users/login');
  } else {
    next();
  }
};
//get user
router.get('/getUser', requireLoginTest , function (req, res) {
  User.find({name:req.user.name}, function (err, user) {
    if (err) {
      res.status(500).send(err);
      console.error(err);
    } else {
      console.log(user[0].team);
      res.json(user);
    }
  });
});

//// Gender Chart
router.get('/listUsers' ,function (req, res) {
  User.find((err, users) => {
    if (err) {
      res.status(500).send(err);
      console.error(err);
    } else {
      res.json(users);
    }
  });
});

router.get('/listUsers2', requireLoginTest ,function (req, res) {
  User.find({"role":{$ne:req.user.role }}, function(err, users){
    if (err) {
      res.status(500).send(err);
      console.error(err);
    } else {
      res.json(users);
    }
  });
});

router.get('/team',requireLoginTest, function (req, res) {
  User.find({team:req.user.team, role:"Employee"}, function(err, users){
    if (err) {
      res.status(500).send(err);
      console.error(err);
    } else {
      // console.log(users);
      res.json(users);
    }
  });
});
// Engagement.find({author:req.user.name}).sort('-date').exec(function(err, engagements){
router.get('/teamOverallResult', function (req, res) {
  // .limit(3)
  let color = [];
  let colors = ['rgba(234, 128, 252, 0.5)', 'rgba(0, 102, 204, 0.5)', 'rgba(0, 150, 233, 0.5)', 'rgba(255, 128, 171, 0.5)', 'rgba(140, 158, 255, 0.5)', 'rgba(128, 203, 196, 0.5)', 'rgba(101, 225, 105, 0.5)', 'rgba(255, 183, 77, 0.5)','rgba(24, 255, 255, 0.5)', 'rgba(213, 0, 249, 0.5)', 'rgba(0, 102, 204, 0.5)', 'rgba(255, 255, 0, 0.5)']
  // for (i in colors){
  //   console.log(colors[i]);
  // }
  User.find({team:req.user.team, role:"Employee"}, function(err, users){
    if (err) {
      res.status(500).send(err);
      console.error(err);
    } else {
      // console.log(users);
      const usersPromises = users.map(user => { 
        console.log(user.name);
        return PerReview.find({userSelected:user.name});
      })
      Promise.all(usersPromises).then( reviews => {
        for(let i = 0; i < users.length; i++ ) {
          users[i].reviews = reviews[i];
          // console.log(colors[i]);
        }
        res.json(users);
      });
    }
  });
  });

  // PerReview.find({authorTeam:req.user.team, type:"Performance Review" ,"userSelected":{$ne:req.user.name }}).sort({name:-1}).exec(function(err, perreviews){
  //   if (err) {
  //     res.status(500).send(err);
  //     console.error(err);
  //   } else {
  //     var test = null;
  //     for (var i = 0; i < perreviews.length; i++) {
  //       var names = perreviews[i].userSelected;
  //       // var test = 0;
  //       console.log(perreviews[i].userSelected);
  //       // if (g[i].userSelected === g[i].userSelected) {
  //       //   console.log("hi")
  //       // }
  //     }
  //     // console.log(test);
  //     // console.log(users);
  //     res.json(perreviews);
  //   }
  // });
// });

module.exports = router;