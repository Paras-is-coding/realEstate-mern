class authController{
    register = (req,res,next)=>{
        let payload = req.body
        res.json({
            "message":"Yo API for route created!",
            "sender":"paras"
        })
    }
}

const authCtrl = new authController();
module.exports = authCtrl;