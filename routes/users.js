const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const sortBy = require('sort-by');
const expressValidator = require('express-validator');
const app = express();
app.use(expressValidator());

// Article model
const User = require('../models/user');


router.post('/login', function (req, res, next) {
  passport.authenticate('local-login', {
    successRedirect: '/',
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
        return res.redirect('/users/login');
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
  res.render('add', {
    title: 'Add Employee'
  });
});

// router.use(expressValidator({
//   customValidators: {
//     isUsernameAvailable(username) {
//       return new Promise((resolve, reject) => {
//         User.findOne({
//           username: username
//         }, (err, user) => {
//           console.log(username);
//           if (err) throw err;
//           if (user == null) {
//             resolve();
//           } else {
//             console.log('rejecting username @' + " " + username);
//             reject();
//           }
//         });
//       });
//     }
//   }
// }));

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
    res.render('add', {
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
            console.log("employee added")
            console.log("Registering user: " + req.body.name);
            req.flash('success', 'Employee added');
            res.redirect('/')
          }
        });
      });
    })
  }
});



// router.post('/add', (req, res) => {
//   const name = req.body.name;
//   const email = req.body.email;
//   const username = req.body.username;
//   const password = req.body.password;
//   const password2 = req.body.password2;
//   const role = req.body.role;
//   const team = req.body.team;
//   const title = req.body.title;

//   // Express validator
//   req.checkBody('name', 'Name is required').notEmpty();
//   req.checkBody('email', 'Email is required').notEmpty();
//   req.checkBody('email', 'Email is required').isEmail();
//   req.checkBody('username', 'Username is required').notEmpty();
//   req.checkBody('username', 'Username already in use').isUsernameAvailable();
//   req.checkBody('password', 'Password is required, Password should have both numbers and letters and minimum length of 4 and maximum of 20 characters').isAlphanumeric().isLength({
//     min: 4,
//     max: 20
//   }).notEmpty();
//   req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
//   req.checkBody('role', 'Role is required').notEmpty();
//   req.checkBody('team', 'Team is required').notEmpty();
//   req.checkBody('title', 'Title is required').notEmpty();


//   let errors = req.getValidationResult();
//   // let errors = req.validationErrors();

//   if (errors) {
//     res.render('add', {
//       errors: errors
//     });
//     console.log("1")
//     console.log('Error in SignUp: ' + errors);
//   }
//   else {
//     let user = new User();
//     user.name = req.body.name;
//     user.email = req.body.email;
//     user.username = req.body.username;
//     user.password = req.body.password;
//     user.role = req.body.role;
//     user.team = req.body.team;
//     user.title = req.body.title;
//     bcrypt.genSalt(10, function (err, salt) {
//       bcrypt.hash(user.password, salt, function (err, hash) {
//         if (err) {
//           console.error(err);
//           console.log("2")
//           req.flash('error', 'uhoh');
//         }
//         user.password = hash;
//         user.save(function (err) {
//           if (err) {
//             console.error(err);
//             res.redirect('/login')
//             console.log("2")
//             return;
//           } else {
//             console.log("3");
//             console.log("employee added")
//             console.log("Registering user: " + req.body.name);
//             req.flash('success', 'Employee added');
//             res.redirect('/')
//           }
//         });
//       });
//     })
//   }
// });

  
//   req.asyncValidationErrors().then(() => {
//     //no errors, create user
//     let newUser = new User({
//       name: name,
//       email: email,
//       username: username,
//       password: password,
//       role: role,
//       team: team,
//       title: title
//     });
//     console.log("hello 1");
//     User.createUser(newUser, (err, user) => {
//       res.json({
//         status: 'success',
//         errors: null,
//       })
//       console.log("New user:", newUser);
//     });
//   }).catch((errors) => {
//     if (errors) {
//       return res.json({
//         success: false,
//         errors: errors,
//       })
//       console.log("errors");
//       console.log("hello 2");
//     };
//   });
// });
  // Get errors
  // let errors = req.validationErrors();

  // if (errors) {
  //   res.render('add', {
  //     errors: errors
  //   });
  //   console.log('Error in SignUp: ' + errors);
  // }
  // if (user) {
  //   console.log('User already exists with username: ' + username);
  //   return done(null, false, req.flash('message', 'User Already Exists'));
  // } else {
  //   let user = new User();
  //   user.name = req.body.name;
  //   user.email = req.body.email;
  //   user.username = req.body.username;
  //   user.password = req.body.password;
  //   user.role = req.body.role;
  //   user.team = req.body.team;
  //   user.title = req.body.title;
  //   bcrypt.genSalt(10, function (err, salt) {
  //     bcrypt.hash(user.password, salt, function (err, hash) {
  //       if (err) {
  //         console.error(err);
  //       }
  //       user.password = hash;
  //       user.save(function (err) {
  //         if (err) {
  //           console.error(err);
  //           return;
  //         } else {
  //           console.log("employee added")
  //           console.log("Registering user: " + req.body.name);
  //           req.flash('success', 'Employee added');
  //           res.redirect('/')
  //         }
  //       });
  //     });
  //   })
  // }


  // load edit form
router.get('/edit/:id', function (req, res) {
  User.findById(req.params.id, function (err, users) {
    res.render('edit_employee', {
      title: 'Edit Employee',
      users: users
    });
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



router.get('/:id', function (req, res) {
  User.findById(req.params.id, function (err, user) {
    res.render('profile', {
      user: user
    });
  });
});

// update submit new article 
router.post('/edit/:id', function (req, res) {
  let user = {};
  user.name = req.body.name;
  user.email = req.body.email;
  user.username = req.body.username;
  user.role = req.body.role;
  user.team = req.body.team;
  user.title = req.body.title;

  let query = {
    _id: req.params.id
  };

  User.update(query, user, function (err) {
    if (err) {
      console.error(err);
      return;
    } else {
      req.flash('success', 'User Updated');
      res.redirect('/');
    }
  })
});

// Delete post
router.delete('/:id', function (req, res) {
  let query = {
    _id: req.params.id
  };

  User.remove(query, function (err) {
    if (err) {
      console.error(err);
      return;
    } else {
      req.flash('success', 'User Deleted')
      res.send('Success');
    }
  });
});


// router.get('/login', function(req, res) {
//   res.render('login');
// });

// Login process


module.exports = router;