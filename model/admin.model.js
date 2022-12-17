const mongoose = require("mongoose")

const adminSchema = mongoose.Schema({
    Name:String,
    email:String,
    password:String,
    role:{
        type:String,
    enum:["admin","user"],
    required:true}
})

const AdminModel = mongoose.model("admin",adminSchema)

module.exports = {AdminModel}