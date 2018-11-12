var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

/* User schema:
    -first name,
    -last name,
    -address,
    -username,
    -e-mail,
    -password */
var UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    birthday: {
      type: String,
    },
    gender: {
      type: String,
    },
    city: {
        type: String,
    },
    country: {
      type: String,
    },
});

UserSchema.methods.validPassword = function(pass) {
  return bcrypt.compareSync(pass, this.password);
}

// export
var User = mongoose.model('User', UserSchema);

module.exports = User;

module.exports.getUserById = function(id, callback) {
    User.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback) {
    const querry = {username: username}
    User.findOne(querry, callback);
}

module.exports.addUser = function(newUser, callback) {
    bcrypt.genSalt(10, function(error, salt) {
        bcrypt.hash(newUser.password, salt, function(error, hash) {
            if(error) throw error;
            newUser.password = hash;
            newUser.save(callback);
        })
    });
}