const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username : {
        type : String,
        required : true,
        min : 2
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true,
        min : 8
    },
    publicKey : {
        type : String,
        required : true,
    },
    privateKey : {
        type : String,
        required : true
    }

});

const User = mongoose.model('user',UserSchema);

module.exports = User;