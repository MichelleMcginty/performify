const express = require('express');
const router = express.Router();
const moment = require('moment');
// Performance review for managers model
const PerReview = require('../models/performance_review');
const User = require('../models/user');

// app.get('/' ,function (req, res) {
//   Article.find({}, function(err, articles){
//     if(err){
//       console.error(err);
//     } else {
//       res.render('index', {
//         title: 'Articles', 
//         articles: articles,
//         moment: moment
//       });
//     }
//   });
// });

// new article form
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
        res.redirect('/');
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
    let perReview = new PerReview();
    perReview.userSelected = req.body.userSelected;
    perReview.author = req.user.name;
    perReview.type = "Performance Review";
    perReview.teamwork = req.body.teamwork;
    perReview.results = req.body.results;
    perReview.communication = req.body.communication;
    perReview.passion = req.body.passion;
    perReview.development = req.body.development;
    perReview.overallResult = req.body.overallResult;
    perReview.comments = req.body.comments;
    console.log(req.user.name);
    perReview.save(function(err){
      if(err) {
        console.error(err);
        return;
      } else {
        req.flash('success', 'Employee Review Added for ' + req.body.userSelected);
        res.redirect('/managerdashboard');
      }
    });
  }
});

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
      // user:users,
      errors: errors
    });
  } else {
    // users:users
    let perReview = new PerReview();
    perReview.userSelected = req.body.userSelected;
    perReview.author = req.user.name;
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

// // Delete post
// router.delete('/:id', function(req, res){
//   let query = {_id: req.params.id};

//   Article.remove(query, function(err){
//     if(err) {
//       console.error(err);
//       return;
//     } else {
//       req.flash('success', 'Article Deleted')
//       res.send('Success');
//     }
//   });
// });

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
//   Article.find({author:req.user.name}, function(err, articles){
//     if(err) {/*error!!!*/}
//     PerReview.find({userSelected:req.user.name}, function(err, perReviews){
//       if(err) {/*error!!!*/}
//       res.render('manager-dashboard', {
//         perReviews: perReviews,
//         articles: articles,
//         users: users,
//         moment: moment
//       });
//     });
//   });
// });



module.exports = router;