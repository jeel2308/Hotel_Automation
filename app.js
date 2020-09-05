const express = require('express');
const app = express();
const mongoose = require('mongoose');
const homeRoutes = require("./routes/home");
const membershipRoutes = require("./routes/membership");
const paymentRoute = require("./routes/payment");
const session = require("express-session");
const passport = require('passport');
const flash = require('connect-flash');
const roomRoutes = require('./routes/rooms');

const url = encodeURI("mongodb+srv://Jeel:Jeel@@2308@cluster0-erkx1.mongodb.net/test?retryWrites=true&w=majority");
mongoose.connect(url, {
    useNewUrlParser : true,
    useUnifiedTopology : true,
    useFindAndModify: false
});

mongoose.connection.once('open',function () {
   console.log("mongodb is running");
});

app.set('view engine','ejs');

app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(function (req,res,next) {
   res.locals.success_msg = req.flash('success_msg');
   res.locals.error = req.flash('error');
   next();
});

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static("assets"));
app.use("/appliances",express.static("assets"));
app.use(homeRoutes);
app.use(membershipRoutes);
app.use(paymentRoute);
app.use(roomRoutes);

app.listen(3000,()=>{
    console.log("server has started on port 3000");
});