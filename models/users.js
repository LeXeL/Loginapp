const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

var UserSchema = mongoose.Schema({
	username: {
		type: String,
		index:true
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


UserSchema.statics.createUser = function (newUser){
    var User = this;
    User.findOne({username:newUser.username}).then((doc)=>{
        console.log(doc);
        if(!doc){
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(newUser.password, salt, function(err, hash) {
                    newUser.password = hash;
                    return newUser;
                });
            });
        }
        return Promise.reject();
    });

}

var User = module.exports = mongoose.model('User', UserSchema);
