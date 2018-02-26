const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const config = require('../config/database');
const bcrypt = require('bcryptjs');
const expressValidator = require('express-validator');
const express = require('express');
const app = express();
app.use(expressValidator());

module.exports = function (passport) {
  // Local strategy
  passport.use('local-login', new LocalStrategy(
    function (username, password, done) {
      // match username
      let query = {
        username: username
      };
      User.findOne(query, function (err, user) {
        if (err) throw err;

        if (!user) {
          return done(null, false, {
            message: 'No user found'
          });
        }

        // Match password
        bcrypt.compare(password, user.password, function (err, isMatch) {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, {
              message: 'Wrong password'
            });
          }
        });
      })
    }));

  // passport.use('local-signup', new LocalStrategy({
  //     passReqToCallback: true // allows us to pass back the entire request to the callback
  //   },
  //   function (req, username, password, done) {

  //     findOrCreateUser = function () {
  //       // find a user in Mongo with provided username
  //       User.findOne({
  //         'username': username
  //       }, function (err, user) {
  //         // In case of any error, return using the done method
  //         if (err) {
  //           console.log('Error in SignUp: ' + err);
  //           return done(err);
  //         }
  //         // already exists
  //         if (user) {
  //           console.log('User already exists with username: ' + username);
  //           return done(null, false, req.flash('message', 'User Already Exists'));
  //         } else {
  //           // if there is no user with that email
  //           // create the user
  //           var newUser = new User();

  //           // set the user's local credentials
  //           newUser.username = username;
  //           newUser.password = createHash(password);
  //           newUser.email = req.param('email');
  //           newUser.firstName = req.param('firstName');
  //           newUser.lastName = req.param('lastName');

  //           // save the user
  //           newUser.save(function (err) {
  //             if (err) {
  //               console.log('Error in Saving user: ' + err);
  //               throw err;
  //             }
  //             console.log('User Registration succesful');
  //             return done(null, newUser);
  //           });
  //         }
  //       });
  //     };
  //     // Delay the execution of findOrCreateUser and execute the method
  //     // in the next tick of the event loop
  //     process.nextTick(findOrCreateUser);
  //   }));


  // passport.use('local-signup', new LocalStrategy({
  //   usernameField: 'email',
  //   passwordField: 'password',
  //   passReqToCallback: true,
  // },
  // function(req, email, password, done) {
  //   process.nextTick(function() {
  //     User.findOne({ 'local.email':  email }, function(err, user) {
  //       if (err)
  //           return done(err);
  //       if (user) {
  //         return done(null, false, req.flash('signupMessage', 'That email is already in use.'));
  //       } else {
  //         var newUser = new User();
  //         newUser.local.email = email;
  //         newUser.local.password = newUser.generateHash(password);
  //         newUser.save(function(err) {
  //           if (err)
  //             throw err;
  //           return done(null, newUser);
  //         });
  //       }
  //     });
  //   });
  // }));

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};
