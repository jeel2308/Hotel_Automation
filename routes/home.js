const router = require('express').Router();

router.get("/",function(req,res){
    const loggedIn = !!req.isAuthenticated();
    res.render("home",{loggedIn});
});

router.get("/about-us",function(req,res){
    const loggedIn = !!req.isAuthenticated();
    res.render("about_us",{loggedIn});
});

module.exports = router;