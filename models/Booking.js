const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookingSchema = new Schema({
   username : {
       type : String,
       required : true
   },
    typeARooms : {
       type : Number,
    },
    typeBRooms : {
       type : Number,
    },
    typeCRooms : {
       type : Number,
    },
    arrivalTime : {
       type : String,
        required : true
    },
    depTime : {
       type : String,
        required : true
    }
});

const Booking = mongoose.model('booking',BookingSchema);
module.exports = Booking;

