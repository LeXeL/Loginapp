const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
    bcrypt.compare(password, user.password, (err, res) => {
		console.log(res);
    	return res;

    });
}

UserSchema.statics.getUserById = function(id) {
    var User = this;
    User.findById(id).then((doc) => {
        if (!doc) {
            return Promise.reject();
        }
        return Promise.resolve(doc);
    })
}
UserSchema.statics.getUserByUsername = function(username) {
    var User = this;
    return User.findOne({
        username
    }).then((doc) => {
        return doc;
    })

}

var User = module.exports = mongoose.model('User', UserSchema);
