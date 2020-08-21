const router = require('express').Router();
require('dotenv').config();
const publicKey = process.env.PUBLIC_KEY;
const privateKey = process.env.PRIVATE_KEY;
const owner = process.env.OWNER;
const hotelAcc = process.env.HOTEL;
const {mintICR,balanceOf,transfer} = require('../connect-blockchain/index');
const stripe = require('stripe')(privateKey);
const Booking = require('../models/Booking');
const fetch = require('node-fetch');

router.get("/buy-icr",function(req,res){
    if(req.isAuthenticated()){
        res.render("buy-icr",{
            publicKey,loggedIn: true
        });
    }else{
        res.redirect("/sign-in");
    }
});

router.post("/buy-icr",async function(req,res){
    try{
        const chargePromise = stripe.charges.create({
            amount : req.body.price,
            source : req.body.id,
            currency : 'inr'
        });
        await chargePromise;
        await mintICR(owner,req.user.publicKey,req.body.price/100);
        res.json({message : 'Transfered Successfully'});
    }
    catch(e){
        res.sendStatus(500).end();
    }
});

router.get("/book-room",function(req,res){
    if(req.isAuthenticated()){
        res.render("book-rooms",{
            publicKey,loggedIn: true
        });
    }else{
        res.redirect("/sign-in");
    }
});

router.post("/book-room",async function(req,res){
    if(req.isAuthenticated()) {
        const {price, roomType} = req.body;
        const {publicKey} = req.user;
        try {
            const balance = await balanceOf(publicKey);
            // const balance = 5;
            if (balance >= price) {
                await transfer(publicKey, hotelAcc, price);
                const roomBooking = {
                    username: req.user.username,
                    roomType
                }
                const newRoom = new Booking(roomBooking);
                await newRoom.save();
                res.redirect('/rooms');
            } else {
                res.json({warning: "Insufficient Balance"});
            }
        } catch (e) {
            res.json({warning: e.message});
        }
    }else{
        res.redirect("/sign-in");
    }

});

router.get("/rooms",async function(req,res){
    if(req.isAuthenticated()) {
        const roomPromise = new Promise(function (resolve, reject) {
            Booking.find({username: req.user.username}, function (err, rooms) {
                if (err) reject(err);
                else resolve(rooms);
            });
        });
        try {
            const rooms = await roomPromise;
            const roomTypes = rooms.map((room) => room.roomType);
            res.render("rooms", {roomTypes,publicKey,loggedIn: true});
        } catch (e) {
            console.log(e);
        }
    }else{
     res.redirect("/sign-in");
    }
});

router.get("/switch/:id",async function(req,res){
    if(req.isAuthenticated()) {
        const toggleSwitchPromise = fetch('http://localhost:8080/switch/' + req.params.id);
        try {
            const statePromise = await toggleSwitchPromise;
            const state = await statePromise.json();
            console.log("switch " + req.params.id + " is " + (state.switch[req.params.id] ? "ON" : "OFF"));
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

router.get("/fan/1/:level",async function(req,res){
    if(req.isAuthenticated()) {
        const toggleFanPromise = fetch('http://localhost:8080/fan/1/' + req.params.level);
        try {
            const statePromise = await toggleFanPromise;
            const state = await statePromise.json();
            console.log(" fan level is " + state.fan['1']);
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

module.exports = router;