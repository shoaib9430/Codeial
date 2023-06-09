var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth2').Strategy;
const crypto = require('crypto');
const User = require('../models/user');


// tell passport to use  a new strategy for google login
passport.use(new GoogleStrategy ({
        clientID: "658894926718-lal7jmnk58msf1h72k7c6bl2ut1j1ipa.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: "http://localhost:8000/users/auth/google/callback",
    },
    function(accessToken, refreshToken, profile, done) {
        // find a user
        User.findOne({email: profile.emails[0].value}).exec(function(err, user) {
            if(err) {
                console.log('error in google strategy-passport', err);
                return;
            }
            console.log(accessToken, refreshToken);
            console.log(profile);

            if(user) {
                // if  found, set this user as req.user
                return done(null, user);            
            }else {
                // if  not found, set this user it as req.user
                User.create( {
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                }, function(err, user) {
                    if(err) {
                        console.log('error in creating in google strategy-passport', err);
                        return;
                    }
                    return done(null, user);
                });
            }
        });
    }
    
));

module.exports = passport;