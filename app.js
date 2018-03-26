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
const perReview = require('./models/performance_review');

// app.set('port', process.env.PORT || 3333);
// app.use(cookieParser());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// var dbHost = process.env.DB_HOST || '127.0.0.1'
// var dbPort = process.env.DB_PORT || 27017;
// var dbName = process.env.DB_NAME || 'performify-start';
// var dbURL = 'mongodb://'+dbHost+':'+dbPort+'/'+dbName;


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

app.get('/form', (req, res) => {
  res.render('add_review_dyna');
});

app.get('/create', (req, res) => {
  res.render('create_form');
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

app.get('/manager-dashboard', (req, res) => {
  // User.find({team:req.user._id}, function(err, users){
    User.find({team:"markeing"}, function(err, users){
    if(err){
      console.error(err);
    } else {
      res.render('manager-dashboard', {
        users: users
      });
    } 
    // console.log(req.user.userid);
    // console.log(req.user._id);
    // console.log(req.user.id);
  });
});


// var userArray = [];
// app.get("/", function(req, res) {
//   db.collection(users).find({}).toArray(function(err, docs) {
//     if (err) {
//       handleError(res, err.message, "Failed to get sections.");
//     } else {
//       // res.status(200).json(docs);
//       userArray = docs;
//       console.log(userArray)
//     }
//   });
// });


// Route Files
let articles = require('./routes/articles');
let users = require('./routes/users');
let dynamics = require('./routes/dynamics');
// Any routes that goes to '/articles' will go to the 'articles.js' file in route
app.use('/articles', articles);
app.use('/users', users);
app.use('/dynamics', dynamics);

app.listen(3333, function(){
  console.log(`Server started on port 3333`);
});