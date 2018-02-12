const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// User model
const User = require('../models/user');

// Register form
// router.get('/register', function(req, res){
//   res.render('register');
// });

// // Register process
// router.post('/register', function(req, res){
//   const name = req.body.name;
//   const email = req.body.email;
//   const username = req.body.username;
//   const password = req.body.password;
//   const password2 = req.body.password2;
//   const role = req.body.role;
//   const team = req.body.team;
//   const title = req.body.title;

//   req.checkBody('name', 'Name is required').notEmpty();
//   req.checkBody('email', 'Email is required').notEmpty();
//   req.checkBody('email', 'Email is required').isEmail();
//   req.checkBody('username', 'Username is required').notEmpty();
//   req.checkBody('password', 'Password is required').notEmpty();
//   req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

//   let errors = req.validationErrors();

//   if(errors){
//     res.render('register', {
//       errors: errors
//     });
//   } else {
//     let newUser = new User({
//       name: name,
//       email: email,
//       username: username,
//       password: password,
//       role: role,
//       team: team,
//       title: title
//     });
//     bcrypt.genSalt(10, function(err, salt){
//       bcrypt.hash(newUser.password, salt, function(err, hash){
//         if(err){
//           console.error(err);
//         }
//         newUser.password = hash;

//         newUser.save(function(err){
//           if(err) {
//             console.error(err);
//             return;
//           } else {
//             req.flash('success', 'You are now registered and can log in');
//             res.redirect('/users/login');
//           }
//         });
//       });
//     })
//   }
// });

router.get('/add', function(req, res){
  res.render('add');
});

// Register process
router.post('/add', function(req, res){
  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const role = req.body.role;
  const team = req.body.team;
  const title = req.body.title;

  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is required').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('role', 'Role is required').notEmpty();
  req.checkBody('team', 'Team is required').notEmpty();
  req.checkBody('title', 'Title is required').notEmpty();

  let errors = req.validationErrors();

  if(errors){
    res.render('add', {
      errors: errors
    });
  } else {
    let user = new User();
      user.name = req.body.name;
      user.email = req.body.email;
      user.username = req.body.username;
      user.password = req.body.password;
      user.role = req.body.role;
      user.team = req.body.team;
      user.title = req.body.title;
      bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(user.password, salt, function(err, hash){
          if(err){
            console.error(err);
          }
          user.password = hash;

          user.save(function(err){
            if(err) {
              console.error(err);
              return;
            } else {
              console.log("employee added")
              req.flash('success', 'Employee added');
              res.redirect('/')
            }
          });
      });
    })
  }
});

router.get('/edit/:id', function(req, res){
  User.findById(req.params.id, function(err, article){
    res.render('edit_employee', {
      title: 'Edit Employee',
      user: user
    });
  });
});

// update submit new article 
router.post('/edit/:id', function(req, res){
  let user = {};
  name = req.body.name;
  email = req.body.email;
  username = req.body.username;
  password = req.body.password;
  role = req.body.role;
  team = req.body.team;
  title = req.body.title;

  let query = {_id: req.params.id};

  User.update(query, user, function(err){
    if(err) {
      console.error(err);
      return;
    } else {
      req.flash('success', 'User Updated');
      res.redirect('/');
    }
  })
});

// Delete post
router.delete('/:id', function(req, res){
  let query = {_id: req.params.id};

  User.remove(query, function(err){
    if(err) {
      console.error(err);
      return;
    } else {
      req.flash('success', 'USer Deleted')
      res.send('Success');
    }
  });
});

// // get single user
// router.get('/:id', function(req, res){
//   User.findById(req.params.id, function(err, article){
//     res.render('User', {
//       article: article
//     });
//   });
// });

// Login form
router.get('/login', function(req, res) {
  res.render('login');
});

// Login process
router.post('/login', function(req, res, next){
  passport.authenticate('local', { 
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout form
router.get('/logout', function(req, res) {
  req.logout();
  req.flash('success', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;