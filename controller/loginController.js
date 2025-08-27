import { signToken } from "../authentication/verifyToken.js";



const loginController= async(req,res)=>{
    const token= await signToken(req.body);
    console.log(token);
    console.log(req.body);
    if(token){

        res.cookie('uid', token.toString(), { 
            httpOnly: false, 
            secure: false, // Set to true in production with HTTPS
            sameSite: 'lax', // Allow cross-origin requests
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });
        res.status(200).json({token:token });
        console.log("this is cookie form :"+ token.toString());

        
    }
    else{
        res.json({
            Token:false,
            validUser:true
        })
    }
    
};


export default loginController;