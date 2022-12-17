const express =  require("express")
const multer = require("multer")
const jwt = require("jsonwebtoken")

const productRouter = express.Router()

const {ProductModel} = require("../model/products.model")


const Storage = multer.diskStorage({
    destination:'uploads',
    filename:(req,file,cb)=>{
        cb(null,Date.now+file.originalname)
    }
})

const upload = multer({
    storage:Storage
}).single('logo')
// /Adminproducts/xyz
//const jwt = require("jsonwebtoken")


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

    const editorID= req.body.editorID
    try {
            upload(req,res,async(err)=>{
                if(err){
                    console.log(err)
                }else{
                    const adminProd = new ProductModel({
                     logo:{
                        data:req.file.filename,
                        contentType:'image/png'
                     },
                        
                    title:req.body.title,
                    category:req.body.category,
                    type:req.body.type,
                    price:req.body.price,
                    rating:req.body.rating,
                    editorID:editorID
                     })
                   await adminProd.save()
        
                }   
                })
        res.send({"msg" : "product added  successfully"})
    } catch (error) {
        console.log(error)
        res.send({"err" : "Something went wrong"})
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