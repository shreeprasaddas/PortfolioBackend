import { signToken } from "../authentication/verifyToken.js";



const loginController= async(req,res)=>{
    const token= await signToken(req.body);
    console.log(token);
    console.log(req.body);
    if(token){
        const isProduction = process.env.NODE_ENV === 'production';
        res.cookie('uid', token.toString(), { 
            httpOnly: false, 
            secure: isProduction,       // true in production (HTTPS required for sameSite:'none')
            sameSite: isProduction ? 'none' : 'lax', // 'none' required for cross-domain cookies
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });
        // Return token in body so frontend can store in localStorage as fallback
        res.status(200).json({ token: token.toString() });
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