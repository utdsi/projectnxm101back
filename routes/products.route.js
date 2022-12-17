const express =  require("express")

const jwt = require("jsonwebtoken")

const productRouter = express.Router()

const {ProductModel} = require("../model/products.model")







const authen = (req,res,next)=>{
    const token = req.headers?.authorization.split(" ")[1]
    //console.log(token);

    if(token){
        const decoded = jwt.verify(token,"admin")
        //console.log(decoded)

        if(decoded){
            const editorID  = decoded.editorID
            req.body.editorID = editorID
            next()
        }else{
            res.send({"msg":"please login"})
        }
    }else{
        res.send({"msg":"please login"})
    }
}

productRouter.use(authen)

productRouter.get("/",async(req,res)=>{
    let editorID = req.body.editorID
    const data = await ProductModel.find({"editorID":editorID})
    res.send(data)
});



productRouter.post("/post",async (req,res)=>{

    try {
        const payload= req.body
        console.log(payload)

    const product_admin = new ProductModel(payload)

        await product_admin.save()
        console.log(product_admin)

        res.send("product added successfully")
    } catch (error) {
        res.send("error in posting the data")
        console.log(error)
    }

    


    
    })

    productRouter.patch("/update/:productID", async (req, res) => {
        const productID = req.params.productID
        const editorID = req.body.editorID
        const payload = req.body
        //console.log(payload);
        const note = await ProductModel.findOne({_id:productID})
        if(editorID !== note.editorID){
            res.send("Not authorised")
        }
        else{
            await ProductModel.findByIdAndUpdate({_id : productID},payload)
            res.send({"msg" : "cart updated successfully"})
        }
})

productRouter.delete("/delete/:productID",async(req,res)=>{

    try {
        const productID = req.params.productID
    const editorID = req.body.editorID

    const cart = await ProductModel.findOne({_id:productID})

    if(editorID !== cart.editorID){
        res.send("not authorised")
        
    }else{
        await ProductModel.findByIdAndDelete({_id:productID})
        res.send("cart deleted successfully")
    }
    } catch (error) {
        console.log(error)
    }
    
    

})

module.exports = {productRouter}