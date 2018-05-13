const express = require('express');
const router = express.Router();
const moment = require('moment');
const PerReview = require('../models/performance_review');
const User = require('../models/user');
const nodemailer = require('nodemailer');


//nodemailer set up
const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 25,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'performifyapp@gmail.com', // generated ethereal user
    pass: 'michellefyp999'  // generated ethereal password
  },
  tls:{
    rejectUnauthorized:false
  }
});



// new self review form
router.get('/add_self_review', function(req, res){
  res.render('add_self_review', {
    title: 'Add Self Review'
  });
});

// submit new article 
router.post('/add_self_review', function(req, res){
  // Express validator
  req.checkBody('teamwork', 'teamwork is required').notEmpty();
  req.checkBody('results', 'results is required').notEmpty();
  req.checkBody('communication', 'communication is required').notEmpty();
  req.checkBody('passion', 'passion is required').notEmpty();
  req.checkBody('development', 'development is required').notEmpty();
  req.checkBody('overallResult', 'overallResult is required').notEmpty();
  // req.checkBody('comments', 'comments is required').notEmpty();
  
  // Get errors
  let errors = req.validationErrors();

  if(errors){
    res.render('add_self_review', {
      title: 'Add Self Review',
      errors: errors
    });
  } else {
    let perReview = new PerReview();
    perReview.author = req.user.name;
    perReview.userSelected = req.user.name;
    perReview.authorTeam = req.user.team;
    perReview.authorRef = req.user.id;
    perReview.type = "Self Review";
    perReview.teamwork = req.body.teamwork;
    perReview.results = req.body.results;
    perReview.communication = req.body.communication;
    perReview.passion = req.body.passion;
    perReview.development = req.body.development;
    perReview.overallResult = req.body.overallResult;
    perReview.comments = req.body.comments;

    perReview.save(function(err){
      if(err) {
        console.error(err);
        return;
      } else {
        req.flash('success', 'Self Review Added');
        res.redirect('/home');
      }
    });
  }
});

// new per review form
router.get('/add_employee_review', function(req, res){
  User.find({team:req.user.team, role:"Employee"}, function(err, users){
    if(err){
      console.error(err);
    } else {
      console.log(users);
      res.render('add_employee_review', {
        title: 'add employee review',
        users:users
      });
    }
  });
});

// submit new review for employee
router.post('/add_employee_review', function(req, res){
  // Express validator
  req.checkBody('teamwork', 'teamwork is required').notEmpty();
  req.checkBody('results', 'results is required').notEmpty();
  req.checkBody('communication', 'communication is required').notEmpty();
  req.checkBody('passion', 'passion is required').notEmpty();
  req.checkBody('development', 'development is required').notEmpty();
  req.checkBody('overallResult', 'overallResult is required').notEmpty();
  // req.checkBody('comments', 'comments is required').notEmpty();
  
  // Get errors
  let errors = req.validationErrors();

  if(errors){
    res.render('add_employee_review', {
      title: 'Add Employee Review',
      // user:users,
      errors: errors
    });
  } else {
    // users:users
    console.log("------------", req.body , "-----------");
    let perReview = new PerReview();
    perReview.userSelected = req.body.userSelected;
    perReview.userEmail = req.body.userEmail;
    perReview.author = req.user.name;
    perReview.authorTeam = req.user.team;
    perReview.authorRef = req.user.id;
    perReview.type = "Performance Review";
    perReview.teamwork = req.body.teamwork;
    perReview.results = req.body.results;
    perReview.communication = req.body.communication;
    perReview.passion = req.body.passion;
    perReview.development = req.body.development;
    perReview.overallResult = req.body.overallResult;
    perReview.comments = req.body.comments;
    console.log(req.user.name);
    console.log(req.user.email);
    // console.log(req.users.email);
    console.log(req.body.email);
    console.log(req.body.userEmail);
    perReview.save(function(err){
      if(err) {
        console.error(err);
        return;
      } else {
        sendPerformanceReviewEmail(req.body.userSelected);
        req.flash('success', 'Employee Review Added for ' + req.body.userSelected);
        res.redirect('/managerdashboard');
      }
    });
  }
});



function sendPerformanceReviewEmail(userId) {
  console.log(userId)
  User.findOne({username:userId}).then((user) => {
    // console.log(user);
    const emailAddress = user.email;
    // console.log('Hello Patrick', emailAddress);
            // body of email
    const output = `
      <h1 style='color:blue;'>A new Performance Review has been uploaded</h1>
      <br>
      <h2> Login to view</h2>
      <a href="https://performify.herokuapp.com/"> Login </a> 
    `;
    //setting up to and from for the email
    let mailOptions = {
      from: '"Performify" <performifyapp@gmail.com>', // sender email address
      to: emailAddress, // receiver of email - new employee
      subject: 'A new Performance Review has been uploaded', // subject of email
      html: output // body of email 
    };
    //send mail and console the id
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
      console.log('User added, Email sent')
    });
  });
}

router.get('/add_manager_review', function(req, res){
  User.find({role:"Management"}, function(err, users){
    if(err){
      console.error(err);
    } else {
      res.render('add_manager_review', {
        title: 'add manager review',
        users:users
      });
    }
  });
});

// submit new review for employee
router.post('/add_manager_review', function(req, res){
  // Express validator
  req.checkBody('teamwork', 'teamwork is required').notEmpty();
  req.checkBody('results', 'results is required').notEmpty();
  req.checkBody('communication', 'communication is required').notEmpty();
  req.checkBody('passion', 'passion is required').notEmpty();
  req.checkBody('development', 'development is required').notEmpty();
  req.checkBody('overallResult', 'overallResult is required').notEmpty();
  // req.checkBody('comments', 'comments is required').notEmpty();
  
  // Get errors
  let errors = req.validationErrors();

  if(errors){
    res.render('add_manager_review', {
      title: 'Add Manager Review',
      errors: errors
    });
  } else {
    // users:users
    let perReview = new PerReview();
    perReview.userSelected = req.body.userSelected;
    perReview.author = req.user.name;
    perReview.team = req.user.team;
    perReview.type = "Performance Review";
    perReview.teamwork = req.body.teamwork;
    perReview.results = req.body.results;
    perReview.communication = req.body.communication;
    perReview.passion = req.body.passion;
    perReview.development = req.body.development;
    perReview.overallResult = req.body.overallResult;
    perReview.comments = req.body.comments;
    console.log(req.user.name + "jwjeje");
    console.log(req.body.name + "heheheh");
    perReview.save(function(err){
      if(err) {
        console.error(err);
        return;
      } else {
        sendPerformanceReviewEmail(req.body.userSelected);
        req.flash('success', 'Manager Review Added for ' + req.body.userSelected);
        res.redirect('/senior-dashboard');
      }
    });
  }
});

router.get('/add_senior_manager_review', function(req, res){
  User.find({"role":{$eq:"Senior Management"}, "name":{$ne:req.user.name } }, function(err, users){
    if(err){
      console.error(err);
    } else {
      res.render('add_senior_manager_review', {
        title: 'Add Senior Manager Review',
        users:users
      });
    }
  });
});

// submit new review for employee
router.post('/add_senior_manager_review', function(req, res){
  // Express validator
  req.checkBody('teamwork', 'teamwork is required').notEmpty();
  req.checkBody('results', 'results is required').notEmpty();
  req.checkBody('communication', 'communication is required').notEmpty();
  req.checkBody('passion', 'passion is required').notEmpty();
  req.checkBody('development', 'development is required').notEmpty();
  req.checkBody('overallResult', 'overallResult is required').notEmpty();
  // req.checkBody('comments', 'comments is required').notEmpty();
  
  // Get errors
  let errors = req.validationErrors();

  if(errors){
    res.render('add_senior_manager_review', {
      title: 'Add Senior Manager Review',
      // user:users,
      errors: errors
    });
  } else {
    // users:users
    let perReview = new PerReview();
    perReview.userSelected = req.body.userSelected;
    perReview.authorTeam = req.user.team;
    perReview.authorRef = req.user.id;
    perReview.type = "Performance Review";
    perReview.author = req.user.name;
    perReview.teamwork = req.body.teamwork;
    perReview.results = req.body.results;
    perReview.communication = req.body.communication;
    perReview.passion = req.body.passion;
    perReview.development = req.body.development;
    perReview.overallResult = req.body.overallResult;
    perReview.comments = req.body.comments;
    console.log(req.user.name + "jwjeje");
    console.log(req.body.name + "heheheh");
    perReview.save(function(err){
      if(err) {
        console.error(err);
        return;
      } else {
        sendPerformanceReviewEmail(req.body.userSelected);
        req.flash('success', 'Senior Manager Review Added for ' + req.body.userSelected);
        res.redirect('/senior-dashboard');
      }
    });
  }
});


// load edit form
// router.get('/edit/:id', function(req, res){
//   Article.findById(req.params.id, function(err, article){
//     res.render('edit_article', {
//       title: 'Edit Article',
//       article: article
//     });
//   });
// });

// update submit new article 
// router.post('/edit/:id', function(req, res){
//   let article = {};
//   article.teamwork = req.body.teamwork;
//   article.results = req.body.results;
//   article.communication = req.body.communication;
//   article.passion = req.body.passion;
//   article.development = req.body.development;
//   article.overallResult = req.body.overallResult;
//   article.comments = req.body.comments;


//   let query = {_id: req.params.id};

//   Article.update(query, article, function(err){
//     if(err) {
//       console.error(err);
//       return;
//     } else {
//       req.flash('success', 'Article Updated');
//       res.redirect('/');
//     }
//   })
// });

// Delete post
router.delete('/:id', function(req, res){
  let query = {_id: req.params.id};

  PerReview.remove(query, function(err){
    if(err) {
      console.error(err);
      return;
    } else {
      req.flash('success', 'Article Deleted')
      res.send('Success');
    }
  });
});

// get single review
router.get('/:id', function(req, res){
  PerReview.findById(req.params.id, function(err, perReviews){
    res.render('performance_review', {
      perReviews:perReviews,
      moment:moment
    });
  });
});

// app.get('/view-profile', (req, res) => {
//     PerReview.find({userSelected:req.user.name ,  type:"Performance Review"}, function(err, perReviews){
//       if(err) {/*error!!!*/}
//       PerReview.find({userSelected:req.user.name, type:"Self Review"}, function(err, perReviewss){
//        if(err) {/*error!!!*/}
//       res.render('manager-dashboard', {
//         perReviewss: perReviewss,
//         perReviews: perReviews,
//         users: users,
//         moment: moment
//       });
//     });
//   });
// });



module.exports = router;