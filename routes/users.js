const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local');

const User = require('../models/users');

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/register', (req, res) => {
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;

    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();
    if (!errors) {
        var newUser = new User({
            name: name,
            email: email,
            username: username,
            password: password
        });
        User.createUser(newUser).then((doc) => {
            req.flash('success_msg', 'You are registered and can now login');
            res.redirect('/users/login');
        }).catch((e) => {
            res.render('register', {
                errors: [{
                    param: 'username',
                    msg: 'Username all ready exists on the database'
                }]
            });
        });

    } else {
        res.render('register', {
            errors: errors
        });
    }
});
passport.use(new LocalStrategy((username, password, done) => {
    User.getUserByUsername(username).then((doc) => {
        if (!doc) {
            return done(null, false, {
                message: 'User not found'
            });
        }
              console.log(doc);
        var uu = User.comparePassword(doc, password);

            if (!uu) {
                return done(null, false, {
                    message: 'Invalid password'
                });
            }else{
              return done(null, doc);
            }

    });
}));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.getUserById(id).then((res) => {
        done(null, res);
    }).catch((e) => {
        console.log(e);
    });
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
}), (req, res) => {
    res.redirect('/');
});
module.exports = router;
