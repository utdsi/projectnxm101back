const mongoose = require("mongoose")

const cartSchema = mongoose.Schema({
    logo:{
        
        contentType:String
    },
    
    title:String,
    category:String,
    type:String,
    price:Number,
    rating:Number,
    Userid:String
})

const CartModel = mongoose.model("cart",cartSchema)

module.exports = {CartModel}