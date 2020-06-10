const router = require('express').Router();
const User = require("../models/User");

const bcrypt = require("bcryptjs");
const passport = require("passport");
require('../config/passport_config');
const Web3 = require('web3');
const web3 = new Web3("HTTP://127.0.0.1:7545");
const {loginSchema,registerSchema} = require("../validation_schemas/membership");


async function validateLogin(req,res,next){
    const errors = {}
    try {
        await loginSchema.validateAsync(req.body);
        next();
    }
    catch(e){
        for (let detail of e.details){
            errors[detail.context.label] = detail.message
        }
        res.render("sign-in",{
            errors,
            loggedIn : false,
            username : req.body.username
        })
    }
}

async function addUser(req,res) {
    const errors = {};
    try{
        const value = await registerSchema.validateAsync(req.body);
        const emailExists = await User.findOne({email : req.body.email});
        if (emailExists) throw new Error("email already exists");
        const passwordSalt = await bcrypt.genSalt(10);
        value.password = await bcrypt.hash(value.password, passwordSalt);
        const pKeySalt = await bcrypt.genSalt(10);
        value.privateKey = await bcrypt.hash(value.privateKey,pKeySalt);
        const user = new User(value);
        await user.save();
        req.flash("success_msg","You are logged in");
        res.redirect("/sign-in");
    }
    catch(e){
        if (e.details){
            for (let detail of e.details){
                errors[detail.context.label] = detail.message
            }
        }
        else if (e.message){
            errors.message = e.message;
        }
        else{
            errors.other = e;
        }
        res.render('sign-up',{
            errors,
            loggedIn : false,
            username : req.body.username,
            email : req.body.email,
            publicKey : req.body.publicKey
        });
    }
}

async function showProfile(req,res) {
    if (req.isAuthenticated()) {
        let balance = await web3.eth.getBalance(req.user.publicKey);
        balance = web3.utils.fromWei(balance, 'ether');
        res.render('profile', {
            balance, username: req.user.username, loggedIn: true
        });
    }
    else{
        res.redirect("/");
    }
}

router.get("/sign-up",function(req,res){
    if (!req.isAuthenticated())
        res.render("sign-up",{loggedIn : false});
    else
        res.redirect("/");
});

router.post("/sign-up",addUser);

router.get("/sign-in",function (req,res) {
    if (!req.isAuthenticated())
       res.render("sign-in",{loggedIn:false});
    else
       res.redirect("/");
});

router.post("/sign-in",validateLogin,function (req,res,next){
    passport.authenticate('local',{
        successRedirect : '/profile',
        failureRedirect : '/sign-in',
        failureFlash : true
    })(req, res, next);
  }
);

router.get("/logout",function (req,res) {
    if (req.isAuthenticated()) {
        req.logout();
    }
    res.redirect("/");
});

router.get("/profile",showProfile);

module.exports = router;