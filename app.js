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
var http = require('http').Server(app);
var Chart = require('chart.js');
const nodemail = require('nodemailer');

const User = require('./models/user');
const Engagement = require('./models/engagement_form')
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
app.set('views', path.join(__dirname, '/app/views'));
app.set('view engine', 'pug');

// Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'app')));

// Express Session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({ url: "mongodb://michellemcginty:Carrignavar95@ds229909.mlab.com:29909/performify-start" })
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

function requireLogin (req, res, next) {
  if (!req.user) {
    req.flash('success', 'Sorry you need to be logged in to view this page');
    res.redirect('/');
  } else {
    next();
  }
};

app.get('/' ,function (req, res) {
  res.render('login', {
    title: 'Index', 
    moment: moment
  });
});

app.get('/home' , requireLogin ,function (req, res) {
  if (req.user.role == "Employee"){
    PerReview.find({userSelected:req.user.username, type:"Performance Review"}).sort('-date').limit(5).exec(function(err, perReviews){
      if (err) {
        res.status(500).send(err);
        console.error(err);
      }
      PerReview.find({author:req.user.name, type:"Self Review"}).limit(5).sort('-date').exec(function(err, perReviewss){
        if (err) {
          res.status(500).send(err);
          console.error(err);
        } 
        Engagement.find({author:req.user.name}).sort('-date').exec(function(err, engagements){
          if (err) {
            res.status(500).send(err);
            console.error(err);
          }
          res.render('home', {
            engagements:engagements,
            perReviewss: perReviewss,
            perReviews: perReviews,
            users: users,
            moment: moment
          });
        });
      });
    });
  } 
  else
  res.render('home', {
    title: 'Home', 
    moment: moment
  });
});

app.get('/engagement_form' ,function (req, res) {
  res.render('engagement_form', {
    title: 'Enagement Survey', 
    // moment: moment
  });
});

app.get('/engagement_dashboard', requireLogin ,function(req, res){
  if (req.user.role == "Management"){
    Engagement.find({authorTeam:req.user.team}).sort('-date').limit(5).exec(function(err, engagements){
      if (err) {
        res.status(500).send(err);
        console.error(err);
      } else
      console.log(engagements);
      res.render('engagement_dashboard', {
        engagements:engagements,
        moment:moment
      });
    });
  }
  else{
    Engagement.find({authorTeam:req.user.team}).sort('-date').limit(10).exec(function(err, engagements){
      if (err) {
        res.status(500).send(err);
        console.error(err);
      } else
      console.log(engagements);
      res.render('engagement_dashboard', {
        engagements:engagements,
        moment:moment
      });
    });
  }
});


app.get('/managerdashboard', requireLogin, (req, res) => {
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
    });
});


app.get('/employeedashboard', requireLogin,(req, res) => {
  PerReview.find({userSelected:req.user.username, type:"Performance Review"}).sort('-date').exec(function(err, perReviews){
    if (err) {
      res.status(500).send(err);
      console.error(err);
    }
    PerReview.find({author:req.user.name, type:"Self Review"}).sort('-date').exec(function(err, perReviewss){
      if (err) {
        res.status(500).send(err);
        console.error(err);
      } 
      Engagement.find({author:req.user.name}).sort('-date').exec(function(err, engagements){
        if (err) {
          res.status(500).send(err);
          console.error(err);
        }
        res.render('manager-dashboard', {
          engagements:engagements,
          perReviewss: perReviewss,
          perReviews: perReviews,
          users: users,
          moment: moment
        });
      });
    });
  });
});

// app.get('/employee', requireLogin,(req, res) => {
//   PerReview.find({userSelected:req.user.username, type:"Performance Review"}).sort('-date').exec(function(err, perReviews){
//     if (err) {
//       res.status(500).send(err);
//       console.error(err);
//     }
//     PerReview.find({author:req.user.name, type:"Self Review"}).sort('-date').exec(function(err, perReviewss){
//       if (err) {
//         res.status(500).send(err);
//         console.error(err);
//       } 
//       Engagement.find({author:req.user.name}).sort('-date').exec(function(err, engagements){
//         if (err) {
//           res.status(500).send(err);
//           console.error(err);
//         }
//         res.render('home', {
//           engagements:engagements,
//           perReviewss: perReviewss,
//           perReviews: perReviews,
//           users: users,
//           moment: moment
//         });
//       });
//     });
//   });
// });


app.get('/admin-employee-dashboard', requireLogin,(req, res) => {
  User.find({"role":{$ne:req.user.role }}, function(err, users){
    if (err) {
      res.status(500).send(err);
      console.error(err);
    } 
    else {
      res.render('manager-dashboard', {
        users: users,
        moment: moment
      });
    }
  });
});

app.get('/listUsers', function (req, res) {
  User.find((err, users) => {
    if (err) {
      res.status(500).send(err);
      console.error(err);
    } 
    else {
      var genders = []
      for (var i = 0; i < users.length; i++) {
        genders.push(users[i].gender)
      }
      var g = genders
      res.render('list_employees',{
        users: users,
        genders:genders
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
//         users: users,
//         moment: moment
//       });
//     }
//   });
// });

app.get('/senior-dashboard', requireLogin,(req, res) => {
  User.find({role:"Management" }, function(err, users){
    if(err){
      res.status(500).send(err);
      console.log(err);
    }
    User.find({"role":{$eq:"Senior Management"}, "name":{$ne:req.user.name } }, function(err, use){
      if(err){
        res.status(500).send(err);
        console.log(err);
      }
      PerReview.find({userSelected:req.user.name}, function(err, perReviews){
        if (err) {
          res.status(500).send(err);
          console.error(err);
        }
        PerReview.find({author:req.user.name, type:"Self Review"}, function(err, perReviewss){
          if (err) {
            res.status(500).send(err);
            console.error(err);
          }  
          res.render('manager-dashboard', {
            perReviewss: perReviewss,
            perReviews: perReviews,
            users: users,
            use: users,
            moment: moment
          });
        });
        // console.log("Users:" + users);
      });
      // console.log("Seniors:" + seniors);
    });
  });
});


app.get('/list-senior-managers', requireLogin,(req, res) => {
  User.find({role:"Senior Management"}, function(err, users){
    if (err) {
      res.status(500).send(err);
      console.error(err);
    } 
    else {
      res.render('list-senior-managers', {
        users: users,
        moment: moment
      });
    console.log("hello" + users);
    }
    // console.log("hello");
  });
});

// Route Files
let users = require('./routes/users');
let perReviews = require('./routes/perReviews');
let engagements = require('./routes/engagements');
let chartsEndpoints = require('./routes/chartsEndpoints');

app.use('/users', users);
app.use('/perReviews', perReviews);
app.use('/engagements', engagements);
app.use('/chartsEndpoints', chartsEndpoints);

// app.listen(3333, function(){
//   console.log(`Server started on port 3333`);
// });

http.listen(process.env.PORT || 3333, function(){
  console.log('listening on', http.address().port);
});