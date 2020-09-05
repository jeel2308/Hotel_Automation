const router = require('express').Router();
require('dotenv').config();
const publicKey = process.env.PUBLIC_KEY;
const privateKey = process.env.PRIVATE_KEY;
const owner = process.env.OWNER;
const hotelAcc = process.env.HOTEL;
const {mintICR,balanceOf,transfer} = require('../connect-blockchain/index');
const stripe = require('stripe')(privateKey);
const Booking = require('../models/Booking');
const Rooms = require("../models/Rooms");

// const {balanceOf} = require("../connect-blockchain/index");

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
        // await mintICR(owner,req.user.publicKey,req.body.price/100);
        res.json({message : 'Transfered Successfully'});
    }
    catch(e){
        res.sendStatus(500).end();
    }
});

router.get("/book-rooms",async function(req,res){
    if(req.isAuthenticated()) {
        try {
            const balance = await balanceOf(req.user.publicKey);
            res.render("book-rooms-form", {balance,loggedIn : true});
        } catch (e) {
            console.log(e);
        }
    }else{
        res.redirect("/sign-in");
    }
});

router.post("/book-rooms",async function(req,res){
   if(req.isAuthenticated()) {
       const bookingObj = {
           username: req.user.username,
           arrivalTime: req.body['arrival-time'],
           depTime: req.body['dep-time']
       };
       if (req.body['type-a-rooms']) bookingObj.typeARooms = Number(req.body['type-a-rooms']);
       if (req.body['type-b-rooms']) bookingObj.typeBRooms = Number(req.body['type-b-rooms']);
       if (req.body['type-c-rooms']) bookingObj.typeCRooms = Number(req.body['type-c-rooms']);

       try {
           await (new Booking(bookingObj)).save();
           // await transfer(req.user.publicKey, hotelAcc, Number(req.body.price));
           res.redirect("/profile");
       } catch (e) {
           console.log(e);
       }
   }else{
       res.redirect("/sign-in");
   }
});

router.get("/rooms",function(req,res){
    if(req.isAuthenticated()){
        res.render("book-rooms",{
            publicKey,loggedIn: true
        });
    }else{
        res.redirect("/sign-in");
    }
});








module.exports = router;