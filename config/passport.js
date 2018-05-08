const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const config = require('../config/database');
const bcrypt = require('bcryptjs');
const expressValidator = require('express-validator');
const express = require('express');
const app = express();
app.use(expressValidator());

module.exports = function (passport) {
  passport.use('local-login', new LocalStrategy(
    function (username, password, done) {
      let query = { username: username}; // Match username
      User.findOne(query, function (err, user) { // Find user in db
        if (err) throw err;
        if (!user) { //If there isnt a user found with the user creditals then return an error message
          return done(null, false, {
            message: 'No user found'
          });
        }
        bcrypt.compare(password, user.password, function (err, isMatch) { // Match password
          if (err) throw err;
          if (isMatch) {  //if passwords match success
            return done(null, user);
          } else {
            return done(null, false, { //if passwords do not match return error message
              message: 'Wrong Credientals'
            });
          }
        });
      })
    }));

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};

