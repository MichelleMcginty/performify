const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database');
const moment = require('moment');
const cookieParser = require('cookie-parser');
const app = express();
const MongoStore = require('connect-mongo')(session);
// Article model
const Article = require('./models/article');
const User = require('./models/user');
const Dynamic = require('./models/dynamic');
const PerReview = require('./models/performance_review');


mongoose.connect(config.database);
const db = mongoose.connection;

// Check connection
db.once('open', function(){
  console.log('Connected to MongoDB');
});

// Check for db errors
db.on('error', function(err){
  console.error(err);
});

// View engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

// Express Session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  // store: new MongoStore({ url: dbURL })
}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Passport config
require('./config/passport')(passport);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});

app.get('/' ,function (req, res) {
  Article.find({}, function(err, articles){
    if(err){
      console.error(err);
    } else {
      res.render('index', {
        title: 'Articles', 
        articles: articles,
        moment: moment
      });
    }
  });
});

// var isAuthenticated = function (req, res, next) {
//   if (req.isAuthenticated())
//     return next();
//   res.redirect('/');
// }
// if (err) {
//   res.status(500).send(err);
//   console.error(err);
// } else {
// res.render('view_profile', {
//     users: users
//   });
//   console.log(users);
// }
app.get('/managerdashboard', (req, res) => {
    User.find({team:req.user.team, role:"Employee" }, function(err, users){
      if(err){
        res.status(500).send(err);
        console.log(err);
        res.render('/login');
      } else {
        res.render('manager-dashboard', {
          users: users
        });
      } 
      // console.log(req.user.userid);
      // console.log(req.user._id);
      // console.log(req.user.id);
    });

    // delete session object
    // req.session.destroy(function(err) {
    //   if(err) {
    //     return next(err);
    //   } else {
    //     return res.redirect('/users/login');
    //   }
    // });
  // User.find({team:req.user._id}, function(err, users){
  //   User.find({team:req.user.team}, function(err, users){
  //   if(err){
  //     res.status(500).send(err);
  //     console.log(err);
  //     res.render('/login');
  //   } else {
  //     res.render('manager-dashboard', {
  //       users: users
  //     });
  //   } 
  //   // console.log(req.user.userid);
  //   // console.log(req.user._id);
  //   // console.log(req.user.id);
  // });
});


app.get('/employeedashboard', (req, res) => {
  Article.find({author:req.user.name}, function(err, articles){
    if (err) {
      res.status(500).send(err);
      console.error(err);
    } 
    PerReview.find({userSelected:req.user.name}, function(err, perReviews){
      if (err) {
        res.status(500).send(err);
        console.error(err);
      } 
      res.render('manager-dashboard', {
        perReviews: perReviews,
        articles: articles,
        users: users,
        moment: moment
      });
    });
  });
});
// outer.get('/list', function (req, res) {
//   User.find((err, users) => {
//     if (err) {
//       res.status(500).send(err);
//       console.error(err);
//     } else {
//       users.sort(sortBy('name'));
//       res.render('list_employees', {
//         users: users.sort(sortBy('name'))
//       });
//     }
//   });
// });

app.get('/admin-employee-dashboard', (req, res) => {
  User.find((err, users) => {
    if (err) {
      res.status(500).send(err);
      console.error(err);
    } 
    else {
      res.render('manager-dashboard', {
        // perReviews: perReviews,
        // articles: articles,
        users: users,
        moment: moment
      });
    }
  });
});


// app.get('/senior-dashboard', (req, res) => {
//   User.find((err, users) => {
//     if (err) {
//       res.status(500).send(err);
//       console.error(err);
//     } 
//     else {
//       res.render('manager-dashboard', {
//         perReviews: perReviews,
//         articles: articles,
//         users: users,
//         moment: moment
//       });
//     }
//   });
// });

app.get('/senior-dashboard', (req, res) => {
  User.find({team:req.user.team, role:"Management" }, function(err, users){
    if(err){
      res.status(500).send(err);
      console.log(err);
      res.render('/login');
    }
    Article.find({author:req.user.name}, function(err, articles){
      if (err) {
        res.status(500).send(err);
        console.error(err);
      } 
    // PerReview.find({userSelected:req.user.name}, function(err, perReviews){
    //   if (err) {
    //     res.status(500).send(err);
    //     console.error(err);
    //   } 
      res.render('manager-dashboard', {
        perReviews: perReviews,
        articles: articles,
        users: users,
        moment: moment
      });
    });
  });
});


// app.get('/users/:name', function (req, res) {
//   User.find({user:req.params.name}, function (err, users) {
//     if(err) {
//       console.error(err);
//       res.render('/');
//     }
//     else {
//       res.render('view_profile', {
//         users: users
//       });
//     }
//   });
//   console.log(req.params.name + " - selected name");
// });

// console.log(req.user.userid);
// console.log(req.user._id);
// console.log(req.user.id);

// Route Files
let articles = require('./routes/articles');
let users = require('./routes/users');
let dynamics = require('./routes/dynamics');
let perReviews = require('./routes/perReviews');
// Any routes that goes to '/articles' will go to the 'articles.js' file in route
app.use('/articles', articles);
app.use('/users', users);
app.use('/dynamics', dynamics);
app.use('/perReviews', perReviews);

app.listen(3333, function(){
  console.log(`Server started on port 3333`);
});