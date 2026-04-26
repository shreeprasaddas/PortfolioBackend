import { verfyToken } from "../authentication/verifyToken.js";

const loginValidation= async(req,res,next)=>{
    // Accept token from cookie OR Authorization header (for cross-domain deployments)
    const cookie = req.cookies.uid;
    const authHeader = req.headers['authorization'];
    const bearerToken = authHeader && authHeader.startsWith('Bearer ') 
        ? authHeader.slice(7) 
        : null;

    const tokenToVerify = cookie || bearerToken;
    
    console.log("cookie from loginValidation:", cookie ? 'present' : 'absent');
    console.log("bearer token:", bearerToken ? 'present' : 'absent');
    
    if(!tokenToVerify){
        console.log("No auth token found, rejecting request");
        return res.status(401).json({
            validUser:false,
            message: "Authentication required"
        });
    }
    
    const isCookie= await verfyToken(tokenToVerify);
    console.log("verifyToken result: "+ (isCookie ? 'valid' : 'invalid'));

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

export default loginValidation;