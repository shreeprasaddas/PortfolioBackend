import { signToken } from "../authentication/verifyToken.js";

const loginController= async(req,res)=>{
    const token= await signToken(req.body);
    console.log("Token generated:", !!token);
    console.log("Login request body (email):", req.body.email);
    
    if(token){
        const isProduction = process.env.NODE_ENV === 'production';
        
        // Set cookie with appropriate settings
        res.cookie('uid', token.toString(), { 
            httpOnly: false,  // Allow JS to read (for verification), but we use Bearer header
            secure: isProduction,  // HTTPS in production
            sameSite: isProduction ? 'none' : 'lax',  // 'none' for cross-origin (requires Secure)
            maxAge: 24 * 60 * 60 * 1000  // 24 hours
        });
        
        // Also set Secure flag explicitly in production for Vercel
        if (isProduction) {
            res.setHeader('Set-Cookie', `uid=${token.toString()}; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=${24 * 60 * 60}`);
        }
        
        console.log("Cookie set with secure:", isProduction);
        console.log("Token returned in response body");
        
        // Return token in body so frontend can store in localStorage
        res.status(200).json({ 
            success: true,
            token: token.toString(),
            message: "Login successful"
        });
    }
    else{
        console.log("Token generation failed");
        res.status(401).json({
            success: false,
            Token: false,
            message: "Invalid credentials"
        });
    }
};

export default loginController;
