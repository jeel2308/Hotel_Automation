const router = require('express').Router();
const Booking = require("../models/Booking");

router.get("/",function(req,res){
    const loggedIn = !!req.isAuthenticated();
    res.render("home",{loggedIn});
});

router.get("/about-us",function(req,res){
    const loggedIn = !!req.isAuthenticated();
    res.render("about-us",{loggedIn});
});

router.get("/appliances",async function(req,res){
    const loggedIn = !!req.isAuthenticated();
    if(loggedIn){
        const roomPromise = new Promise(function(resolve,reject){
            Booking.find({username : req.user.username},function(err,rooms){
                if(err) reject(err);
                else resolve(rooms);
            });
        });
        try{
            const rooms = await roomPromise;
            if(!rooms.length) res.redirect("/book-room");
            else res.render("appliances",{loggedIn});
        }
        catch(e){
            console.log(e);
        }
    }
    else res.redirect("/sign-in");
});

module.exports = router;