const express = require("express");

const mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config();
mongoose.connect(process.env.MONGODB_URL).then(()=>{
    console.log("MongoDB connected succcessfully!");
}).catch((err)=>{
    console.log(err);
})


const router = require('../router/index');
const app = express();

app.use(router)

module.exports = app;