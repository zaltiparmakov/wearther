var express = require('express');
var router = express.Router();
var passport = require('passport');
var local = require('../config/passport-strategy');
var User = require('../models/user');
var UserController = require('../controllers/userController');

/* Display login form if user is not logged in, user profile if authorized */
router.get('/login', function(req,res) {
    if(req.user) {
      res.redirect('/users/profile/');
    }
    else {
      res.send('Login form');
    }
});

router.get('/register', UserController.register_user);

/* Display login form if user is not logged in, user profile if authorized */
router.post('/login', passport.authenticate('local-login', {
  successRedirect: '/users/profile', // success if done(null, user) is returned from local-login strategy
  failureRedirect: '/users/login',  // otherwise failure
  })
);

/* Register user and open new session */
router.post('/register', passport.authenticate('local-register', {
  successRedirect: '/users/profile',
  failureRedirect: '/users/register',
  })
);

/* If authorized access to own user profile, go to home page otherwise */
router.get('/profile', function(req, res, next) {
  if(req.user) {
    res.send('User profile ' + req.user.username);
  } else {
    res.redirect('/');
  }
});

router.get('/logout', function(req, res) {
  req.session.destroy();
  res.redirect('/');
});

/* Authenticate Requests */
router.get('/auth/facebook', passport.authenticate('facebook'));

router.get('/auth/facebook', passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
});

module.exports = router;
