

const jwt = require("jsonwebtoken")


const authen = (req,res,next)=>{
    const token = req.headers?.authorization.split(" ")[1]
    console.log(token);

    if(token){
        const decoded = jwt.verify(token,"push")
        console.log(decoded)

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

module.exports = {authen}