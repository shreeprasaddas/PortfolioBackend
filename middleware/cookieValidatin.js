import { verfyToken } from "../authentication/verifyToken.js";


const cookieValidation= async(req,res,next)=>{
    const cookie = req.cookies.uid;
    console.log("cookie from cookieVAlidation:"+cookie);
    
    if(!cookie){
        console.log("No cookie found, rejecting request");
        return res.status(401).json({
            validUser:false,
            message: "Authentication required"
        });
    }
    
    const isCookie= await verfyToken(cookie);
    console.log("verifyToken data: "+ isCookie);

    if(isCookie){
        next();
    }
    else{
        console.log("Invalid token, rejecting request");
        res.status(401).json({
            validUser:false,
            message: "Invalid token"
        })
    }
}

export default cookieValidation;