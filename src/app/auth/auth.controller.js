const User = require('./authModels/user.model.js')
const bcryptjs = require('bcryptjs')

class authController{
    signIn = async (req,res,next)=>{
        //saving incomming data to database
        const {username,email,password} =req.body;
        const hashedPassword = bcryptjs.hashSync(password,10); //sync func waits for result
        const newUser = new User({username,email,password:hashedPassword}) // create new instance of user

        try{
            await newUser.save();
            res.status(201).json({message:"User created successfully!"})
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
}

const authCtrl = new authController();
module.exports = authCtrl;