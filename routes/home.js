const router = require('express').Router();

router.get("/home",function(req,res){
    const loggedIn = !!req.isAuthenticated();
    res.render("home",{loggedIn});
});

router.get("/about-us",function(req,res){
    const loggedIn = !!req.isAuthenticated();
    res.render("about-us",{loggedIn});
});

module.exports = router;