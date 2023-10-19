const { response } = require('express');
const  errorHandler  = require('../utils/error.js');
const User = require('./authModels/user.model.js')
const bcryptjs = require('bcryptjs') // for enc of psw
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

class authController{
    signUp = async (req,res,next)=>{
        //saving incomming data to database
        const {username,email,password} =req.body;
        const hashedPassword = bcryptjs.hashSync(password,10); //sync func waits for result
        const newUser = new User({username,email,password:hashedPassword}) // create new instance of user

        try{
            await newUser.save();
            res.status(201).json({success:true,message:"User created successfully!"})
        }
        catch(error){
            // res.status(500).json(error.message);
            next(error)
        }
    

        // let payload = req.body
        // res.json({
        //     username:payload.username,
        //     email:payload.email
        // })
    }

    signIn = async (req,res,next) =>{
        const {email,password} = req.body;
        try{
            // logic to check email and psw in dbase
            // check for email
            const validUser = await User.findOne({email:email}) //return user or false
            console.log(validUser)
            if(!validUser){ return  next(errorHandler(404,"User not found!")) }
            //check for psw
            const validPassword = bcryptjs.compareSync(password,validUser.password)
            console.log(validPassword)
            if(!validPassword){ return next(errorHandler(401,"Wrong credintials!"))}

            //now if both are correct we authenticate user by adding cookie in browser
            //but we'll hash first > packge is JWT or JSON web token
            const token = jwt.sign({id:validUser._id},process.env.JWT_SECRET)
            //save token as cookie
            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + 12); // Add 12 days to the current date
            const {password:ps,...rest} = validUser._doc;
            res.cookie('access_token',token,{httpOnly:true,expires : expirationDate}).status(200).json(rest) //expires opt , httpOnly for safety
        }catch(error){
            next(error);
        }
    }

    google = async (req,res,next) =>{
        try{    
            // see if user exist - then just sign in
            const user = await User.findOne({email:req.body.email})
            if(user){
                const token = jwt.sign({id:user._id},process.env.JWT_SECRET);
                const {password:pass,...rest} = user._doc;
                res.cookie('access_token',token,{httpOnly:true}).status(200).json(rest);
            }
            else{
                // add new user to dbase if already not found
                // now we donot have password field value so we create one
                 const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
                 const hashedPassword = bcryptjs.hashSync(generatedPassword,10);
                 let username = req.body.name.split(" ").join("").toLowerCase()+parseInt(Math.random()*4);
                 const newUser = new User({
                    username:username,
                    email:req.body.email,
                    password:hashedPassword,
                    avatar:req.body.photo
                 })

                 await newUser.save();
                 const token = jwt.sign({id:newUser._id},process.env.JWT_SECRET)
                 const{password:pass,...rest} = newUser._doc;
                 response.cookie('access_token',token,{httpOnly:true}).status(200).json(rest);

            }
        }catch(error){
            next(error)
        }
    }

    signOut = (req,res,next)=>{
        try{
            res.clearCookie('access_token');
            res.status(200).json("User has been logged out!");
        }catch(except){
            next(except)
        }
    }
}

const authCtrl = new authController();
module.exports = authCtrl;