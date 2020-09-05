const router = require('express').Router();
const Rooms = require('../models/Rooms');
require('dotenv').config();
const hotelAcc = process.env.HOTEL;
const {transfer} = require("../connect-blockchain/index");
const fetch = require('node-fetch');
const routeMapping = {
    "101" : "http://localhost:8080/",
    "102" : "http://localhost:8081/",
    "103" : "http://localhost:8082/",
    "104" : "http://localhost:8083/",
    "105" : "http://localhost:8084/",
    "106" : "http://localhost:8085/"
}
const status = {};

router.post("/find-room",async function(req,res){
    const {aDate,dDate} = req.body;
    try{
        let rooms = await Rooms.find({
            $or : [{
                arrivalTime : {
                    $gte : dDate
                }
            },{
                depTime : {
                    $lt : aDate
                }
            }]
        },"roomNo");
        rooms = rooms.map((obj)=>obj.roomNo);
        res.json(rooms);
    }
    catch(e){
        console.log(e);
    }
});

router.post("/book-room",async function(req,res){
    if(req.isAuthenticated()) {
        const {rooms }= req.body;
        let roomsPromise = rooms.map(function(room){
           let roomNo = Number(room);
           return new Promise(function(resolve,reject){
               Rooms.findOneAndUpdate({roomNo},{
               arrivalTime : new Date(req.body.arrivalTime),
               depTime : new Date(req.body.depTime),
               username : req.user.username
           },function(err,res){
               if(err) reject(err);
               else resolve(res);
           });
           });
        });
        try{
            await Promise.all(roomsPromise);
            // await transfer(req.user.publicKey, hotelAcc, Number(req.body.price));
            res.json({status : "success"});
        }catch(e){
            console.log(e);
        }
    }else{
        res.redirect("/sign-in");
    }

});

router.get("/booked-rooms",async function(req,res){
    if(req.isAuthenticated()) {
        const roomPromise = new Promise(function (resolve, reject) {
            Rooms.find({username: req.user.username},"roomNo arrivalTime depTime", function (err, rooms) {
                if (err) reject(err);
                else resolve(rooms);
            });
        });
        try {
            let rooms = await roomPromise;
            if(rooms.length) {
                const {arrivalTime, depTime} = rooms[0];
                const roomTypes = rooms.map((room)=>room.roomNo);
                res.render("rooms", {roomTypes, loggedIn: true, arrivalTime, depTime,arrived : !!status[req.user.username]});
            }else{
                const roomTypes = [];
                res.render("rooms",{roomTypes,loggedIn : true});
            }
        } catch (e) {
            console.log(e);
        }
    }else{
     res.redirect("/sign-in");
    }
});

router.get("/checkout",async function(req,res){
   if(req.isAuthenticated()){
       const updatePromise = new Promise(function(resolve,reject){
          Rooms.updateMany({username : req.user.username},{username : "",depTime : new Date()},function(err,res){
            if(err) reject(err);
            else resolve(res);
          });
       });
       try{
           await updatePromise;
           res.redirect("/profile");
       }
       catch(e){
           console.log(e);
       }
   } else{
       res.redirect("/sign-in");
   }
});

router.get("/appliances/:room",async function(req,res){
    const loggedIn = !!req.isAuthenticated();
    if(loggedIn){
        const roomPromise = new Promise(function(resolve,reject){
            Rooms.find({username : req.user.username},function(err,rooms){
                if(err) reject(err);
                else resolve(rooms);
            });
        });
        try{
            const rooms = await roomPromise;
            if(!rooms.length) res.redirect("/book-room");
            else res.render("appliances",{loggedIn,room : req.params.room});
        }
        catch(e){
            console.log(e);
        }
    }
    else res.redirect("/sign-in");
});

router.get("/switch/:room/:id",async function(req,res){
    if(req.isAuthenticated()) {
        const url = routeMapping[req.params.room] + "switch/" + req.params.id;
        const toggleSwitchPromise = fetch(url);
        try {
            const statePromise = await toggleSwitchPromise;
            const state = await statePromise.json();
            console.log("switch " + req.params.id + " in " + req.params.room + " is " + (state.switch[req.params.id] ? "ON" : "OFF"));
        } catch (e) {
            console.log(e);
        } finally {
            res.send("DONE");
        }
        // res.send("DONE");
    }else{
        res.redirect("/sign-in");
    }
});

router.get("/fan/1/:room/:level",async function(req,res){
    if(req.isAuthenticated()) {
        const url = routeMapping[req.params.room] + "fan/1/" + req.params.level;
        const toggleFanPromise = fetch(url);
        try {
            const statePromise = await toggleFanPromise;
            const state = await statePromise.json();
            console.log(" fan level in " + req.params.room + " is " + state.fan['1']);
        } catch (e) {
            console.log(e);
        } finally {
            res.send("DONE");
        }
        // res.send("DONE");
    }else{
        res.redirect("/sign-in");
    }
});

router.get("/activate-booking",function(req,res){
    status[req.user.username] = true;
    res.send("");
});


module.exports = router;
