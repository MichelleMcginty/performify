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
  var allowedOrigins = ['https://performify.herokuapp.com/'];
  var origin = req.headers.origin;
  if(allowedOrigins.indexOf(origin) > -1){
      res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  User.find({name:req.user.name}, function (err, user) {
    if (err) {
      res.status(500).send(err);
      console.error(err);
    } else {
      res.json(user);
    }
  });
});

router.get('/listTeamAverage' , function (req, res) {
  var allowedOrigins = ['https://performify.herokuapp.com/'];
  var origin = req.headers.origin;
  if(allowedOrigins.indexOf(origin) > -1){
      res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  const reviewsToScore = {'Unsatisfactory':1, 'Needs Improvement':2 , 'Meets Expectations': 3, 'Exceeds Expectations':4, 'outstanding':5};
  const reviews = ['', 'Unsatisfactory','Needs Improvement','Meets Expectations','Exceeds Expectations','outstanding'];
  PerReview.find({authorTeam:req.user.team, type:"Performance Review"}).sort('-date').exec(function(err, perReviews){
    if (err) {
      res.status(500).send(err);
      console.error(err);
    } else { 
      let average = 0;
      for (perReview of perReviews){
        average += reviewsToScore[perReview.overallResult];
      }
      average /= perReviews.length;
      averageReview = Math.round(average);
      averageScore = reviews[averageReview];
      console.log(average);
      res.json(averageScore);
    }
  });
});



router.get('/listCompanyAverage' , function (req, res) {
  var allowedOrigins = ['https://performify.herokuapp.com/'];
  var origin = req.headers.origin;
  if(allowedOrigins.indexOf(origin) > -1){
      res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  const reviewsToScore = {'Unsatisfactory':1, 'Needs Improvement':2 , 'Meets Expectations': 3, 'Exceeds Expectations':4, 'outstanding':5};
  const reviews = ['', 'Unsatisfactory','Needs Improvement','Meets Expectations','Exceeds Expectations','outstanding'];
  PerReview.find({type:"Performance Review"}).sort('-date').exec(function(err, perReviews){
    if (err) {
      res.status(500).send(err);
      console.error(err);
    } else { 
      let average = 0;
      for (perReview of perReviews){
        average += reviewsToScore[perReview.overallResult];
      }
      average /= perReviews.length;
      averageReview = Math.round(average);
      averageScore = reviews[averageReview];
      console.log(average);
      res.json(averageScore);
    }
  });
});

function reviewsToAverageScores(perReviews) {
  var allowedOrigins = ['https://performify.herokuapp.com/'];
  var origin = req.headers.origin;
  if(allowedOrigins.indexOf(origin) > -1){
      res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  const reviewsToScore = {'Unsatisfactory':1, 'Needs Improvement':2 , 'Meets Expectations': 3, 'Exceeds Expectations':4, 'outstanding':5};
  const reviews = ['', 'Unsatisfactory','Needs Improvement','Meets Expectations','Exceeds Expectations','outstanding'];
  let average = 0;
  for (perReview of perReviews){
    average += reviewsToScore[perReview];
  }
  average /= perReviews.length;
  let averageReview = Math.round(average);
  let averageScore = reviews[averageReview];
  return averageScore;
}

router.get('/getAverageForEachTeam' , function (req, res) {
  var allowedOrigins = ['https://performify.herokuapp.com/'];
  var origin = req.headers.origin;
  if(allowedOrigins.indexOf(origin) > -1){
      res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  userToTeam = {};
  teamReviews = {}
  User.find().then((users) => {
    for(user of users) {
      userToTeam[user.username] = user.team;
    }
    return PerReview.find();
  }).then( reviews => {
    for(review of reviews) {
      reviewsTeam = userToTeam[review.userSelected];
      reviewValue = review.overallResult;
      
      if (typeof teamReviews[reviewsTeam] === 'undefined') {
        teamReviews[reviewsTeam]  = [reviewValue];
        delete teamReviews.undefined;
      } else {
        teamReviews[reviewsTeam].push(reviewValue);
      }
    }
    for (team in teamReviews) {
      teamReviews[team] = reviewsToAverageScores(teamReviews[team]);
    }
    console.log('so fancy', teamReviews);
    res.json(teamReviews);
  }).catch(err => {
    console.log(err);
  })
});


router.get('/getUserDetails' ,function (req, res) {
  var allowedOrigins = ['https://performify.herokuapp.com/'];
  var origin = req.headers.origin;
  if(allowedOrigins.indexOf(origin) > -1){
      res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  User.find({username:req.params.username}, function (err, users) {
    res.render('view_profile', {
      users: users
    });
    res.json(users[0].name);
  });
});
//// Gender Chart
router.get('/listUsers' ,function (req, res) {
  var allowedOrigins = ['https://performify.herokuapp.com/'];
  var origin = req.headers.origin;
  if(allowedOrigins.indexOf(origin) > -1){
      res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
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
  var allowedOrigins = ['https://performify.herokuapp.com/'];
  var origin = req.headers.origin;
  if(allowedOrigins.indexOf(origin) > -1){
      res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
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
  var allowedOrigins = ['https://performify.herokuapp.com/'];
  var origin = req.headers.origin;
  if(allowedOrigins.indexOf(origin) > -1){
      res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  User.find({team:req.user.team, role:"Employee"}, function(err, users){
    if (err) {
      res.status(500).send(err);
      console.error(err);
    } else {
      res.json(users);
    }
  });
});
router.get('/teamOverallResult', function (req, res) {
  var allowedOrigins = ['https://performify.herokuapp.com/'];
  var origin = req.headers.origin;
  if(allowedOrigins.indexOf(origin) > -1){
      res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  // .limit(3)
  User.find({team:req.user.team, role:"Employee"}, function(err, users){
    if (err) {
      res.status(500).send(err);
      console.error(err);
    } else {
      const usersPromises = users.map(user => { 
        return PerReview.find({userSelected:user.username, type:"Performance Review"}).limit(3).sort('-date')
      })
      Promise.all(usersPromises).then( reviews => {
        for(let i = 0; i < users.length; i++ ) {
          users[i].reviews = reviews[i];
        }
        res.json(users);
      });
      }
    });
  });

  router.get('/managerOverallResult', function (req, res) {
    var allowedOrigins = ['https://performify.herokuapp.com/'];
    var origin = req.headers.origin;
    if(allowedOrigins.indexOf(origin) > -1){
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', true);
    // .limit(3)
    User.find({role:"Management"}, function(err, users){
      if (err) {
        res.status(500).send(err);
        console.error(err);
      } else {
        const usersPromises = users.map(user => { 
          return PerReview.find({userSelected:user.username, type:"Performance Review"}).limit(3).sort('-date')
        })
        Promise.all(usersPromises).then( reviews => {
          for(let i = 0; i < users.length; i++ ) {
            users[i].reviews = reviews[i];
          }
          res.json(users);
        });
        }
      });
    });

  
  router.get('/getUserReviews', function (req, res) {
    var allowedOrigins = ['https://performify.herokuapp.com/'];
    var origin = req.headers.origin;
    if(allowedOrigins.indexOf(origin) > -1){
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', true);
    PerReview.find({userSelected:req.user.username , type:"Performance Review"}).sort('-date').limit(3).exec(function(err, perreviews){
      if (err) {
        res.status(500).send(err);
        console.error(err);
      } else 
      res.json(perreviews);
    });
  });

  router.get('/getUserReviews/:username', function (req, res) {
    var allowedOrigins = ['https://performify.herokuapp.com/'];
    var origin = req.headers.origin;
    if(allowedOrigins.indexOf(origin) > -1){
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', true);
    const userId = req.params.username;
    PerReview.find({userSelected:userId , type:"Performance Review"}).sort('-date').limit(3).exec(function(err, perreviews){
      if (err) {
        res.status(500).send(err);
        console.error(err);
      } else 
      res.json(perreviews);
    });
  });

router.get('/engagmentTeamAverage', function (req, res) {
  var allowedOrigins = ['https://performify.herokuapp.com/'];
  var origin = req.headers.origin;
  if(allowedOrigins.indexOf(origin) > -1){
      res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  Engagement.find({authorTeam:req.user.team}).sort('-date').limit(8).exec(function(err, engagements){
    if (err) {
      res.status(500).send(err);
      console.error(err);
    } else
    var value = [];
    let average = 0;
    for (i of engagements){
      average += parseInt(i.q1) + parseInt(i.q2) + parseInt(i.q3) + parseInt(i.q4) + parseInt(i.q5) + parseInt(i.q6);
    }
    average /= engagements.length * 6;
    average = average.toFixed(2);
    res.json(average);
  });
});

router.get('/engagmentCompanyAverage', function (req, res) {
  var allowedOrigins = ['https://performify.herokuapp.com/'];
  var origin = req.headers.origin;
  if(allowedOrigins.indexOf(origin) > -1){
      res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  Engagement.find({}).sort('-date').exec(function(err, engagements){
    if (err) {
      res.status(500).send(err);
      console.error(err);
    } else
    var value = [];
    let average = 0;
    for (i of engagements){
      average += parseInt(i.q1) + parseInt(i.q2) + parseInt(i.q3) + parseInt(i.q4) + parseInt(i.q5) + parseInt(i.q6);
    }
    average /= engagements.length * 6;
    average = average.toFixed(2);
    res.json(average);
  });
});


router.get('/getLastTenEnagagements', function (req, res) {
  var allowedOrigins = ['https://performify.herokuapp.com/'];
  var origin = req.headers.origin;
  if(allowedOrigins.indexOf(origin) > -1){
      res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  Engagement.find({}).sort('-date').limit(10).exec(function(err, engagements){
    if (err) {
      res.status(500).send(err);
      console.error(err);
    } else 
    res.json(engagements);
  });
});


module.exports = router;