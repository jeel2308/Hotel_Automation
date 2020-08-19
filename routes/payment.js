const router = require('express').Router();
require('dotenv').config();
const publicKey = process.env.PUBLIC_KEY;
const privateKey = process.env.PRIVATE_KEY;
const owner = process.env.OWNER;
const hotelAcc = process.env.HOTEL;
const {mintICR,balanceOf,transfer} = require('../connect-blockchain/index');
const stripe = require('stripe')(privateKey);

router.get("/buy-icr",function(req,res){
    if(req.isAuthenticated()){
        res.render("buy-icr",{
            publicKey
        });
    }else{
        res.redirect("/sign-in");
    }
});

router.post("/buy-icr",async function(req,res){
    try{
        console.log(req.body);
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
        res.render("book-rooms");
    }else{
        res.redirect("/");
    }
});

router.post("/book-room",async function(req,res){
    const {price} = req.body;
    const {publicKey} = req.user;
    try{
        const balance = await balanceOf(publicKey);
        if(balance>=price){
            await transfer(publicKey,hotelAcc,price);
            res.json({success : "Room Booked"});
        }else{
            res.json({warning : "Insufficient Balance"});
        }
    }
    catch(e){
        res.json({warning : e.message});
    }

});

module.exports = router;