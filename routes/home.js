const router = require('express').Router();

router.get("/",function(req,res){
    const loggedIn = !!req.isAuthenticated();
    res.render("home",{loggedIn});
});

router.get("/about-us",function(req,res){
    const loggedIn = !!req.isAuthenticated();
    res.render("about-us",{loggedIn});
});

router.get("/appliances",function(req,res){
    const loggedIn = !!req.isAuthenticated();
    res.render("appliances",{loggedIn});
});

module.exports = router;