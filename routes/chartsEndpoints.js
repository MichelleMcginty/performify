const express = require('express');
const router = express.Router();
const moment = require('moment');
const User = require('../models/user');
const PerReview = require('../models/performance_review');
const Engagement = require('../models/engagement_form');

function requireLoginTest (req, res, next) {
  if (!req.user) {
    req.flash('success', 'Sorry you need to be logged in to view this page Test');
    res.redirect('/');
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
      // console.log(user[0].team);
      res.json(user);
    }
  });
});

router.get('/listTeamAverage' , function (req, res) {
  PerReview.find({authorTeam:req.user.team}, function (err, perreviews) {
    if (err) {
      res.status(500).send(err);
      console.error(err);
    } else { 
      var test = [];
      for (i of perreviews){
        console.log(i.overallResult);
        test += i.overallResult;
      }
      function frequent(number){
        var count = 0;
        var sortedNumber = number.sort();
        var start = number[0], item;
        for(var i = 0 ;  i < sortedNumber.length; i++){
          if(start === sortedNumber[i] || sortedNumber[i] === sortedNumber[i+1]){
             item = sortedNumber[i]
          }
        }
        return item
      }
      
      // console.log(frequent([i.overallResult]));
      res.json(frequent([i.overallResult]));
    }
  });
});
router.get('/getUserDetails' ,function (req, res) {
  User.find({username:req.params.username}, function (err, users) {
    res.render('view_profile', {
      users: users
    });
    res.json(users[0].name);
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
  User.find({team:req.user.team, role:"Employee"}, function(err, users){
    if (err) {
      res.status(500).send(err);
      console.error(err);
    } else {
      // console.log(users);
      const usersPromises = users.map(user => { 
        // console.log(user.name);
        return PerReview.find({userSelected:user.username}).limit(3).sort('-date')
      })
      Promise.all(usersPromises).then( reviews => {
        for(let i = 0; i < users.length; i++ ) {
          users[i].reviews = reviews[i];
          // console.log(users[i].reviews);
        }
        console.log(users.reviews);
        res.json(users);
      });
      }
    });
  });
  
  router.get('/getUserReviews', function (req, res) {
    PerReview.find({userSelected:req.user.username , type:"Performance Review"}).sort('-date').limit(3).exec(function(err, perreviews){
      if (err) {
        res.status(500).send(err);
        console.error(err);
      } else 
      res.json(perreviews);
    });
  });

  router.get('/getUserReviews/:username', function (req, res) {
    const userId = req.params.username;
    PerReview.find({userSelected:userId , type:"Performance Review"}).sort('-date').limit(3).exec(function(err, perreviews){
      if (err) {
        res.status(500).send(err);
        console.error(err);
      } else 
      res.json(perreviews);
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

router.get('/engagmentTeamAverage', function (req, res) {
  Engagement.find({authorTeam:req.user.team}).sort('-date').limit(8).exec(function(err, engagements){
    if (err) {
      res.status(500).send(err);
      console.error(err);
    } else
    var value = [];
    let average = 0;
    for (i of engagements){
      console.log(i.q1, i.q2, i.q3, i.q4, i.q5, i.q6 );
      average += parseInt(i.q1) + parseInt(i.q2) + parseInt(i.q3) + parseInt(i.q4) + parseInt(i.q5) + parseInt(i.q6);
    }
    average /= engagements.length * 6;
    average = average.toFixed(2);
    res.json(average);
  });
});

// router.get('/engagementChart', function (req, res) {
//   Engagement.find({authorTeam:req.user.team}).sort('-date').limit(8).exec(function(err, engagements){
//     if (err) {
//       res.status(500).send(err);
//       console.error(err);
//     } else
//     var value = [];
//     let average = 0;
//     for (i of engagements){
//       console.log(i.q1, i.q2, i.q3, i.q4, i.q5, i.q6 );
//       average += parseInt(i.q1) + parseInt(i.q2) + parseInt(i.q3) + parseInt(i.q4) + parseInt(i.q5) + parseInt(i.q6);
//     }
//     average /= engagements.length * 6;
//     average = average.toFixed(2);
//     res.json(average);
//   });
// });

module.exports = router;