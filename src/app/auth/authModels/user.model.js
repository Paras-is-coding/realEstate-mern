const mongoose = require("mongoose");

//create rows or schema
const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    } ,
    avatar:{
        type:String,
        default:"https://static.vecteezy.com/system/resources/thumbnails/005/545/335/small/user-sign-icon-person-symbol-human-avatar-isolated-on-white-backogrund-vector.jpg"
    },  
},

{timestamps:true});

//create model 
const User = mongoose.model('User',userSchema);

module.exports =  User;
