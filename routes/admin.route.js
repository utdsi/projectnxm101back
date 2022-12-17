const express =  require("express")
const bcrypt =  require("bcrypt")
const jwt = require("jsonwebtoken")

const adminRouter = express.Router()

const {AdminModel} = require("../model/admin.model.js")
//const {UserModel} = require("../model/users.model.js")

adminRouter.post("/signup",async(req,res)=>{

    const {Name,email,password,role} = req.body
    const adminPresent = await AdminModel.findOne({email})

    if(adminPresent){
        res.send({"msg":"try logging in admin already present"})
    }
    try {
        bcrypt.hash(password, 6, async function(err, hash) {
            // Store hash in your password DB.
            const admin  = new AdminModel({Name,email,password:hash,role})
            await admin.save()
            res.send({"msg":"signup successfull"})
        });
    } catch (error) {
        console.log("error in signing up")
        console.log(error)
    }
})


adminRouter.post("/login",async(req,res)=>{
    const {email,password} = req.body

    try {
        const admin = await AdminModel.find({email})
        //console.log(admin);
        const hash_password  = admin[0].password
        if(admin.length>0){
            
            
            if(admin[0].role == "admin"){
                bcrypt.compare(password, hash_password, function(err, result) {
                    // result == true
                    if(result){
                        const token = jwt.sign({"editorID":admin[0]._id},"admin")
                        res.send({"msg":"admin login successfull","token":token,role:"admin"})
                    }else{
                        res.send({"msg":"login failed"})
                    }
                });
            }else if(admin[0].role == "user"){
                bcrypt.compare(password, hash_password, function(err, result) {
                    // result == true
                    if(result){
                        const token = jwt.sign({"Userid":admin[0]._id},"hush")
                        res.send({"msg":"user login successfull","token":token,role:"user"})
                    }else{
                        res.send({"msg":"login failed"})
                    }
                });

            }
            
        }else {
            res.send({"msg":"login failed"})
            //await UserModel.find({email})


        }
    } catch (error) {
        res.send({"msg":"Something went wrong, please try again later"})
    }
})

module.exports = {adminRouter}