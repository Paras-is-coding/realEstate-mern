const express = require("express");
const cookieParser = require('cookie-parser')

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

//before mounting router to express app 
//we parse the incomming routes body to take data using app middleware
app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.use(cookieParser())

//mounting router to express app
const router = require('../router/index.js');
app.use('/api',router);



//404 handler
app.use((req,res,next)=>{
    res.json({
        message:"404 page not found",
        result:false,
        meta:null
    })
})

//error handler middleware, program will come to this section when called with next(withparm)
app.use((err,req,res,next)=>{
    console.log(err)
    let code;
    if(err.code >=200 && err.code < 600){
        code = err.code;
    }else{
        code = 500;
    }
    const message = err.message ?? "Internal server error";
    const result = err.result ?? false;

     
 res.status(code).json({ 
    success:false,
    message,
    result
  });
})

module.exports = app;