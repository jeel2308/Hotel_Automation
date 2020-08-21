const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookingSchema = new Schema({
   username : {
       type : String,
       required : true
   },
    roomType : {
       type : String,
        required : true
    }
});

const Booking = mongoose.model('booking',BookingSchema);
module.exports = Booking;

