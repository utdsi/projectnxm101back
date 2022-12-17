
const express =  require("express")
const multer = require("multer")
const jwt = require("jsonwebtoken")

const cartRouter = express.Router()

const {CartModel} = require("../model/cart.model.js")


const Storage = multer.diskStorage({
    destination:'uploads',
    filename:(req,file,cb)=>{
        cb(null,Date.now+file.originalname)
    }
})

const upload = multer({
    storage:Storage
}).single('logo')

const authentication = (req,res,next)=>{
    const token = req.headers?.authorization.split(" ")[1]

    if(token){
        const decoded = jwt.verify(token,"hush")
        console.log(decoded)

        if(decoded){
            const Userid  = decoded.Userid
            req.body.Userid = Userid
            next()
        }else{
            res.send({"msg":"please login"})
        }
    }else{
        res.send({"msg":"please login"})
    }
}
cartRouter.use(authentication)
cartRouter.get("/",async(req,res)=>{
    const Userid = req.body.Userid
    

    const data = await CartModel.find({"Userid":Userid})
    res.send(data)
})



cartRouter.post("/post",async (req,res)=>{

    try {
        
        const Userid= req.body.Userid

            upload(req,res,async(err)=>{

                if(err){
                    console.log(err)
                }else{
                    const new_cart = new CartModel({
                     logo:{
                        data:req.file.filename,
                        contentType:'image/png'
        
                     },
                        
                    title:req.body.title,
                    category:req.body.category,
                    type:req.body.type,
                    price:req.body.price,
                    rating:req.body.rating,
                    Userid:Userid
                    
                        })
                        await new_cart.save()
        
                }
                    
                })
            
        
    

   


        

        res.send({"msg" : "added to cart successfully"})
    } catch (error) {
        console.log(error)
        res.send({"err" : "Something went wrong"})
    }
    })

    

cartRouter.delete("/delete",async(req,res)=>{

    try {
        //const cartID = req.params.cartID
    const Userid = req.body.Userid

     await CartModel.deleteMany({"Userid":Userid})

   
        res.send("item deleted successfully")
    
    } catch (error) {
        console.log(error)
    }
    
    

})

module.exports = {cartRouter}