import { verfyToken } from "../authentication/verifyToken.js";


const cookieValidation= async(req,res,next)=>{
    const cookie = req.cookies.uid;
    console.log("cookie from cookieVAlidation:"+cookie);
    const isCookie= await verfyToken(cookie);
    console.log("verifyToken data: "+ isCookie);

    if(isCookie){
        next();
    }
    else{
        res.json({
            validUser:false
        })
    }
}

export default cookieValidation;