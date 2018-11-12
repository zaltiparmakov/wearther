var passport = require('passport');

var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

var FacebookStrategy = require('passport-facebook');

const FACEBOOK_APP_ID = '185285312211372';
const FACEBOOK_APP_SECRET = '4abc143d79acbab4d21887a76a24494c';

module.exports = function(passport) {

  passport.serializeUser(function(user,done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
      done(err, user);
    });
  });

  /* Local Strategy Authorization */
  passport.use('local-register', new LocalStrategy({
    passReqToCallback: true
  },
    function(req, username, password, done) {
      process.nextTick(function() {
        User.getUserByUsername(username, function(err, user) {
          if(err) {
            return done(err);
          }

          if(user) {
            return done(null, false, { message: "Username is taken" });
          }

          var newUser = new User({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            address: req.body.address,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
          });

          User.addUser(newUser);

          return done(null, newUser);
        });
      });
    }
  ));

  passport.use('local-login', new LocalStrategy(
    function(username, password, done) {
      User.getUserByUsername(username, function(err, user) {
        if(err) {
          return done(err);
        }

        if(!user) {
          return done(null, false, { message: "No user found" });
        }

        if(!user.validPassword(password)) {
          return done(null, false, { message: "Wrong password" });
        }

        
        return done(null, user);
      });
    }
  ));

  /* Social Media Strategy Authorization */
  passport.use('facebook', new FacebookStrategy( {
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "https://parmak-feri.com/auth/facebook/callback"
  }, function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ facebookId: profile.id }, function(err, user) {
      return cb(err, user);
    });
  }));
}