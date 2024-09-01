import { verfyToken } from "../authentication/verifyToken.js";



const loginValidation= (req,res,next)=>{
    const cookie = req.body.cookie;
    const isCookie= verfyToken(cookie.toSting());

    if(isCookie){
        next();
    }
    else{
        res.json({
            validUser:false
        })
    }
}

export default loginValidation;