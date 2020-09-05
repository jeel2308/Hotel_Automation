const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoomSchema = new Schema({
   roomType : {
       type : String,
       required : true
   },
   roomNo : {
       type : Number,
       required : true
   },
    username : {
      type : String,
    },
   arrivalTime : {
       type : Date,
   },
   depTime : {
       type : Date
   }
});

const Rooms = mongoose.model('room',RoomSchema);
module.exports = Rooms;