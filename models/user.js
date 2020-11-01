const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username : {
        index : true,
        type : String,
        required: true
    },
    email : {
        index : true,
        type : String,
        required: true
    },
    password : {
        type : String,
        required: true
    },
    shopList : {
        type : Array,
        default : []
    },
    myntraCoin : {
        type : Number,
        default : 0
    },
    recycledList : {
        type : Array,
        default : []
    }
});
const userModel = mongoose.model('user', userSchema);

module.exports = userModel;