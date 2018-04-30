const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const sortBy = require('sort-by');
const expressValidator = require('express-validator');
const app = express();
var mongoose = require('mongoose');
const moment = require('moment');
app.use(expressValidator());

// models
const User = require('../models/user');
const PerReview = require('../models/performance_review');
const Engagement = require('../models/engagement_form');



router.post('/login', function (req, res, next) {
  passport.authenticate('local-login', {  
    successRedirect: '/home',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout form
router.get('/logout', function (req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function(err) {
      if(err) {
        return next(err);
      } else {
        return res.redirect('/home');
      }
    });
  }
  // req.logout();
  // req.flash('success', 'You are logged out');
  // res.redirect('/users/login');
});


router.get('/login', function (req, res) {
  res.render('login');
});


// new article form
router.get('/add', function (req, res) {
  res.render('add_employee', {
    title: 'Add Employee'
  });
});

// // submit new article 
router.post('/add', (req, res)  => {
  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;
  const role = req.body.role;
  const team = req.body.team;
  const title = req.body.title;
  // const reviews = reviews._id;
  // _id: new mongoose.Types.ObjectId();



  // Express validator
  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is required').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('username', 'Username already in use').notEmpty();
  req.checkBody('password', 'Password is required, Password should have both numbers and letters and minimum length of 4 and maximum of 20 characters').isAlphanumeric().isLength({
    min: 4,
    max: 20
  }).notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
  req.checkBody('role', 'Role is required').notEmpty();
  req.checkBody('team', 'Team is required').notEmpty();
  req.checkBody('title', 'Title is required').notEmpty();

  // Get errors
  let errors = req.validationErrors();

  if (errors) {
    res.render('add_employee', {
      errors: errors
    });
    console.log('Error in SignUp: ' + errors);
  } else {
    let user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.username = req.body.username;
    user.password = req.body.password;
    user.role = req.body.role;
    user.team = req.body.team;
    user.title = req.body.title;
    user.gender = req.body.gender;
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) {
          console.error(err);
        }
        user.password = hash;
        user.save(function (err) {
          if (err) {
            console.error(err);
            console.log("User already in database");
            req.flash('error', 'Username already in the DB');
            res.redirect('/users/add')
          } else {
            req.session.userId = user._id;
            console.log("Employee added")
            console.log("Registering user: " + req.body.name);
            req.flash('success', req.body.name + ' has been added');
            res.redirect('/home')
          }
        });
      });
    })
  }
});



  // load edit form
router.get('/edit/:id', function (req, res) {
  User.findById(req.params.id, function (err, users) {
    res.render('edit_employee', {
      title: 'Edit Employee',
      users: users
    });
  });
});


// router.get('/view/:name', function (req, res) {
//   User.find({name:req.params.name}, function (err, users) {
//     res.render('view_profile', {
//       users: users
//     });
//     console.log(users[0].name + "view");
//   });
// });

// router.get('/profile/:name', function (req, res) {
//   User.find({name:req.params.name}, function (err, users) {
//     res.render('view_profile', {
//       users: users
//     });
//     console.log(users[0].name + "view");
//   });
// });


router.get('/view/edit/:username', function (req, res) {
  User.find({username:req.params.username}, function (err, users) {
    res.render('edit_profile', {
      users: users
    });
    console.log(users[0].name);
  });
});

router.get('/list', function (req, res) {
  User.find((err, users) => {
    if (err) {
      res.status(500).send(err);
      console.error(err);
    } else {
      users.sort(sortBy('name'));
      res.render('list_employees', {
        users: users.sort(sortBy('name'))
      });
    }
  });
});

// router.get('/test', function (req, res) {
//   User.findOne({ id: req.params.id }, function(error, user) {
//     if (error) {
//       return handleError(error);
//     }
//     user.reviews = reviews;
//     console.log(user.reviews.type); // prints "Ian Fleming"
//   });
// });
// router.get('/test', function (req, res) {
//   User.findById(req.params.id)
//     .populate('reviews')
//     .exec(function (err, user, docs) {
//     // if (err) return handleError(err);
//       console.log(docs);
//       // console.log(user.reviews);
//     // prints "The author is Ian Fleming"
//   });
// });



// router.get('/getUser', function (req, res) {
//   User.findById(req.params.id, function (err, user) {
//     .populate('reviews')
// 		res.render('profile', { 
//       user: user
//     }); 
//     console.log(user.reviews);
// 	}); 
// });


router.get('/:id', function (req, res) {
  User.findById(req.params.id, function (err, user) {
    PerReview.find({userSelected:user.name , type:"Performance Review"}, function(err, perReviews){
      if (err) {
        res.status(500).send(err);
        console.error(err);
      }
      PerReview.find({author:user.name, type:"Self Review"}, function(err, perReviewss){
        if (err) {
          res.status(500).send(err);
          console.error(err);
        }
        Engagement.find({author:user.name}).sort('-date').exec(function(err, engagements){
          if (err) {
            res.status(500).send(err);
            console.error(err);
          }
          // Engagement.find({author:user.name}, function(err, engagements){
          //   if (err) {
          //     res.status(500).send(err);
          //     console.error(err);
          //   }
          res.render('profile', {
            engagements: engagements,
            perReviewss:perReviewss,
            perReviews: perReviews,
            user: user,
            moment: moment
          });
        });
      });
    });
    console.log(user.name + " viewing profile");
  });
});

router.get('/view/:username', function (req, res) {
  User.find({username:req.params.username}, function (err, users) {
    res.render('view_profile', {
      users: users
    });
    console.log(users[0].name + "view");
  });
});




// router.get('/profile/:id', (req, res) => {
//   User.find({id:req.params.id}, function (err, users) {
//     if(err) {/*error!!!*/}
//     PerReview.find({userSelected:req.params.name}, function(err, perReviews){
//       if(err) {/*error!!!*/}
//       Article.find({author:req.params.name}, function(err, articles){
//         if(err) {/*error!!!*/}
//         res.render('view_profile', {
//           perReviews: perReviews,
//           articles: articles,
//           users: users,
//           moment: moment
//         });
//         console.log("hello three" + user.name);
//       });
//       // console.log("hello two" + users[0].name);
//     });
//     // console.log("hello one" + user.name);
//   });
// });

router.get('/profile/:username', function (req, res) {
  User.find({username:req.params.username}, function (err, users) {
    if (err) {
      res.status(500).send(err);
      console.error(err);
    }
    PerReview.find({userSelected:users[0].name , type:"Performance Review"}, function(err, perReviews){
      if (err) {
        res.status(500).send(err);
        console.error(err);
      }
      PerReview.find({author:users[0].name, type:"Self Review"}, function(err, perReviewss){
        if (err) {
          res.status(500).send(err);
          console.error(err);
        }
        res.render('view_profile', {
          perReviewss: perReviewss,
          perReviews: perReviews,
          users: users,
          moment: moment
        });
      });
    });
    console.log(users[0].name + " - selected name");
  });
});

// router.get('view_profile/:name', function (req, res) {
//   User.find({name:req.params.name}, function (err, users) {
//     res.render('view_profile', {
//       users: users
//     });
//   });
//   console.log(users.name);
//   console.log(users.name);
// });

// update submit new user 
router.post('/edit/:id', function (req, res) {
  let user = {};
  user.name = req.body.name;
  user.email = req.body.email;
  user.username = req.body.username;
  user.role = req.body.role;
  user.team = req.body.team;
  user.title = req.body.title;
  user.gender = req.body.gender;

  let query = {
    _id: req.params.id
  };

  User.update(query, user, function (err) {
    if (err) {
      console.error(err);
      return;
    } else {
      req.flash('success', 'User Updated');
      res.redirect('/home');
    }
  })
});

router.post('/view/edit/:username', function (req, res) {
  let users = {};
  users.name = req.body.name;
  users.email = req.body.email;
  // users.username = req.body.username;
  users.role = req.body.role;
  users.team = req.body.team;
  users.title = req.body.title;
  // users.gender = req.body.gender;
  // console.log(req.body.title + "check one");
  // console.log(req.params.title + "check two");
  
  let query = {
    username: req.body.username
  };

  User.update(query, users, function (err) {
    if (err) {
      console.error(err);
      return;
    } else {
      req.flash('success', users.name + " Details Updated");
      res.redirect('/admin-employee-dashboard');
    }
  })
});


// Delete post
router.delete('/:id', function (req, res) {
  let query = {
    id: req.params.id
  };

  User.remove(query, function (err) {
    if (err) {
      console.error(err);
      return;
    } else {
      req.flash('success', 'User Deleted ' + req.params.name)
      res.send('Success');
    }
  });
});

router.delete('/view/:username', function (req, res) {
  let query = {username: req.params.username};
  User.remove(query, function (err) {
    if (err) {
      console.error(err);
      return;
    } else {
      console.log(req.params.name);
      req.flash('success', 'User Deleted ' + req.params.name)
      res.send('Success');
    }
  });
});

module.exports = router;