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

function requireLogin (req, res, next) {
  if (!req.user) {
    req.flash('success', 'Sorry you need to be logged in to view this page');
    res.redirect('/users/login');
  } else {
    next();
  }
};

app.get('/' ,function (req, res) {
  res.render('index', {
    title: 'Index', 
    moment: moment
  });
});

app.get('/home' ,function (req, res) {
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


app.get('/employeedashboard', requireLogin,(req, res) => {
  PerReview.find({userSelected:req.user.name, type:"Performance Review"}, function(err, perReviews){
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
    } else {
      // users.sort(sortBy('name'));
      
      // users = data;
      // console.log(data);
      res.render('list_employees',{
        users: users
      });
      console.log(users[0].name);
      // var ctx = document.getElementById('myCharto').getContext('2d');
      // var users = users;
      // var usersName = users.name;
      // var chart = new Chart(ctx, {
      //     // The type of chart we want to create
      //     type: 'bar',
          
      //     // The data for our dataset
      //     data: {
      //         labels: [usersName],
      //         datasets: [{
      //             label: "My First dataset",
      //             backgroundColor: 'rgb(255, 99, 132)',
      //             borderColor: 'rgb(255, 99, 132)',
      //             data: [usersName],
      //         }]
      //     },

      //     // Configuration options go here
      //     options: {}
      //   });
        
    }
  });
});


// var chartData;
// $(function(){
//   $.AJAX({
//     url: 'http://localhost:3333/listUsers',
//     type: 'GET',
//     success : function(data) {
//       chartData = data;
//       console.log(data);
//     }
//   });
// });


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

app.use('/users', users);
app.use('/perReviews', perReviews);
app.use('/engagements', engagements);

// app.listen(3333, function(){
//   console.log(`Server started on port 3333`);
// });

http.listen(process.env.PORT || 3333, function(){
  console.log('listening on', http.address().port);
});