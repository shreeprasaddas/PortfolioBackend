import { verfyToken } from "../authentication/verifyToken.js";



const loginValidation= async(req,res,next)=>{
    const cookie = req.cookies.uid;
    
    if(!cookie){
        return res.status(401).json({
            validUser:false,
            message: "Authentication required"
        });
    }
    
    const isCookie= await verfyToken(cookie);

    if(isCookie){
        next();
    }
    else{
        res.status(401).json({
            validUser:false,
            message: "Invalid token"
        })
    }
}

export default loginValidation;