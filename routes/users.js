const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Article model
const User = require('../models/user');

// new article form
router.get('/add', function(req, res){
  res.render('add', {
    title: 'Add Employee'
  });
});

// submit new article 
router.post('/add', function(req, res){
  // Express validator
  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is required').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('role', 'Role is required').notEmpty();
  req.checkBody('team', 'Team is required').notEmpty();
  req.checkBody('title', 'Title is required').notEmpty();
  
  // Get errors
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


// load edit form
router.get('/edit/:id', function(req, res){
  User.find(req.params.id, function(err, users){
    res.render('edit_employee', {
      title: 'Edit Employee',
      user: user
    });
  });
});

router.get('/list', function (req, res) {
  User.find((err, users) => {  
    if (err) {
        // Note that this error doesn't mean nothing was found,
        // it means the database had an error while searching, hence the 500 status
        res.status(500).send(err);
        console.error(err);
    } else {
        res.render('list_employees', {
        users: users
      });
    }
  });
});

// update submit new article 
router.post('/edit/:id', function(req, res){
  let user = {};
  user.name = req.body.name;
  user.email = req.body.email;
  user.username = req.body.username;
  user.role = req.body.role;
  user.team = req.body.team;
  user.title = req.body.title;

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
      req.flash('success', 'User Deleted')
      res.send('Success');
    }
  });
});

//issue with login if there is content in user.pug
router.get('/:id', function(req, res){
  User.find(req.params.id, function(err, user){
    res.render('user', {
      user: user
    });
  });
});

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