const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// const Promise = require('bluebird');
var UserSchema = mongoose.Schema({
    username: {
        type: String,
        index: true
    },
    password: {
        type: String
    },
    email: {
        type: String
    },
    name: {
        type: String
    }
});


UserSchema.statics.createUser = function(newUser) {
    var User = this;
    return User.findOne({
        username: newUser.username
    }).then((doc) => {
        if (doc) {
            return Promise.reject();
        } else {
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(newUser.password, salt, function(err, hash) {
                    newUser.password = hash;
                    newUser.save();
                    return Promise.resolve(newUser);
                });
            })

        }
    });
}

UserSchema.statics.comparePassword = function(user, password) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, user.password, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });

}

UserSchema.statics.getUserById = function(id) {
    var User = this;
    return User.findById(id);
}
UserSchema.statics.getUserByUsername = function(username) {
    var User = this;
    return User.findOne({
        username
    });
}

var User = module.exports = mongoose.model('User', UserSchema);
