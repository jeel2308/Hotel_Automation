const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require("../models/User");
const bcrypt = require('bcryptjs');

passport.serializeUser(function (user,done) {
   done(null, user.id);
});

passport.use(new localStrategy({usernameField: 'username',passwordField: 'password'},async function (username,password,done) {
   try {
       const user = await User.findOne({username});
       if (!user) return done(null, false,{message : 'Incorrect username or password'});
       const isMatch = await bcrypt.compare(password,user.password);
       if (!isMatch) return done(null, false,{message : "Incorrect Password"});
       return done(null, user);
   }
   catch(e){
       return done(e);
   }
}));

passport.deserializeUser(async function (id,done) {
    const user = await User.findById(id);
    done(null, user);
});