
const mongoose = require("mongoose")

const productSchema = mongoose.Schema({
    logo:String,
    title:String,
    category:String,
    type:String,
    price:Number,
    rating:Number,
    editorID:String,
})

const ProductModel = mongoose.model("product",productSchema)

module.exports = {ProductModel}