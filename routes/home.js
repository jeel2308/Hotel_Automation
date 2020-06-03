const router = require('express').Router();

router.get("/home",function(req,res){
    const loggedIn = !!req.isAuthenticated();
    res.render("home",{loggedIn});
});

router.get("/about-us",function(req,res){
    const loggedIn = !!req.isAuthenticated();
    res.render("about-us",{loggedIn});
});

router.get("/profile",function(req,res){
    const loggedIn = !!req.isAuthenticated();
    res.render("profile",{loggedIn});
});

router.get("/register",function(req,res){
    const loggedIn = !!req.isAuthenticated();
    res.render("sign-up",{loggedIn});
});

router.get("/login",function(req,res){
    const loggedIn = !!req.isAuthenticated();
    res.render("sign-in",{loggedIn});
});

module.exports = router;