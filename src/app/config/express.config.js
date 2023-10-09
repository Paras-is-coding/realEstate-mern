const express = require("express");

//connecting to mongoose database
const mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config();
mongoose.connect(process.env.MONGODB_URL).then(()=>{
    console.log("MongoDB connected succcessfully!");
}).catch((err)=>{
    console.log(err);
})


//creating express app
const app = express();

//mounting router to express app
const router = require('../router/index');
app.use('/api',router);

module.exports = app;