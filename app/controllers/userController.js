var User = require('../models/user');


exports.user_list = function(req, res) {
  User.find(function(err, users) {
    if(err) {
      return res.status(500).send(err);
    }

    res.json(users);
  });
}

exports.register_user = function(req, res) {
  var user = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    firstname: req.body.title,
    lastname: req.body.description,
    birthday: req.body.picture,
    gender: req.body.start_date,
    city: req.body.end_date,
    country: req.body.location,
  });

  user.save(function(err, user) {
    if(err) {
      return res.status(500).send(err);
    }

    res.json(user);
  });
}

exports.update_user = function(req, res) {
  var user = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    firstname: req.body.title,
    lastname: req.body.description,
    birthday: req.body.picture,
    gender: req.body.start_date,
    city: req.body.end_date,
    country: req.body.location,
    _id: req.params.user_id
  })

  User.findByIdAndUpdate(req.params.user_id, user, {}, function(err, user) {
    if(err) {
      return next(err);
    }

    res.json(user);
  });
}

exports.delete_user = function(req, res) {
  User.findByIdAndRemove(req.params.user_id, function(err, user) {
    if(err) {
      return res.status(500).send(err);
    }

    let response = {
      message: "User successfully deleted",
      id: user._id
    };

    res.json(response);
  });
}

exports.getUserById = function(id, callback) {
    User.findById(id, callback);
}

exports.getUserByUsername = function(username, callback) {
    const querry = {username: username}
    User.findOne(querry, callback);
}