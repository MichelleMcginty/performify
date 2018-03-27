const express = require('express');
const router = express.Router();
const moment = require('moment');
// Article model
const Article = require('../models/article');

// new article form
router.get('/add', function(req, res){
  res.render('add_article', {
    title: 'Add Article'
  });
});

// submit new article 
router.post('/add', function(req, res){
  // Express validator
  req.checkBody('teamwork', 'teamwork is required').notEmpty();
  req.checkBody('results', 'results is required').notEmpty();
  req.checkBody('communication', 'communication is required').notEmpty();
  req.checkBody('passion', 'passion is required').notEmpty();
  req.checkBody('development', 'development is required').notEmpty();
  req.checkBody('overallResult', 'overallResult is required').notEmpty();
  // req.checkBody('comments', 'comments is required').notEmpty();
  
  // Get errors
  let errors = req.validationErrors();

  if(errors){
    res.render('add_article', {
      title: 'Add Article',
      errors: errors
    });
  } else {
    let article = new Article();
    article.author = req.user.name;
    article.authorTeam = req.user.team;
    article.teamwork = req.body.teamwork;
    article.results = req.body.results;
    article.communication = req.body.communication;
    article.passion = req.body.passion;
    article.development = req.body.development;
    article.overallResult = req.body.overallResult;
    article.comments = req.body.comments;

    article.save(function(err){
      if(err) {
        console.error(err);
        return;
      } else {
        req.flash('success', 'Self Review Added');
        res.redirect('/employeedashboard');
      }
    });
  }
});

// load edit form
router.get('/edit/:id', function(req, res){
  Article.findById(req.params.id, function(err, article){
    res.render('edit_article', {
      title: 'Edit Article',
      article: article
    });
  });
});

// update submit new article 
router.post('/edit/:id', function(req, res){
  let article = {};
  article.teamwork = req.body.teamwork;
  article.results = req.body.results;
  article.communication = req.body.communication;
  article.passion = req.body.passion;
  article.development = req.body.development;
  article.overallResult = req.body.overallResult;
  article.comments = req.body.comments;


  let query = {_id: req.params.id};

  Article.update(query, article, function(err){
    if(err) {
      console.error(err);
      return;
    } else {
      req.flash('success', 'Article Updated');
      res.redirect('/');
    }
  })
});

router.get('/mySelfReview', function(req, res){
  Article.find({author:req.user.id}, function(err, article){
    res.render('index', {
      article: article
    });
  });
});

// Delete post
router.delete('/:id', function(req, res){
  let query = {_id: req.params.id};

  Article.remove(query, function(err){
    if(err) {
      console.error(err);
      return;
    } else {
      req.flash('success', 'Article Deleted')
      res.send('Success');
    }
  });
});

// get single article
router.get('/:id', function(req, res){
  Article.findById(req.params.id, function(err, article){
    res.render('article', {
      article: article
    });
  });
});

module.exports = router;