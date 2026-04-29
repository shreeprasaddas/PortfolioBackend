import { signToken } from "../authentication/verifyToken.js";

const loginController= async(req,res)=>{
    const token= await signToken(req.body);
    console.log("Token generated:", !!token);
    console.log("Login request body (email):", req.body.email);
    
    if(token){
        const isProduction = process.env.NODE_ENV === 'production';
        
        // Token expiry: 24 hours
        const tokenExpiry = 24 * 60 * 60 * 1000; // milliseconds
        
        // Set cookie with appropriate settings for persistence
        res.cookie('uid', token.toString(), { 
            httpOnly: false,  // Allow JS to read for verification
            secure: isProduction,  // HTTPS in production
            sameSite: isProduction ? 'none' : 'lax',  // 'none' for cross-origin (requires Secure)
            maxAge: tokenExpiry,  // 24 hours
            path: '/'  // Available across entire domain
        });
        
        // Also set explicit Set-Cookie header in production for Vercel
        if (isProduction) {
            res.setHeader('Set-Cookie', `uid=${token.toString()}; Path=/; Secure; SameSite=None; Max-Age=${24 * 60 * 60}`);
        }
        
        console.log("✅ Cookie set successfully - Expires in 24 hours");\n        console.log("Cookie secure:", isProduction);
        console.log("Token returned in response body for localStorage storage");
        
        // Return token in body so frontend can store in localStorage (primary storage)
        // and cookies (fallback/backup)
        res.status(200).json({ 
            success: true,
            token: token.toString(),
            message: "Login successful - Session will persist for 24 hours",
            expiresIn: 24 * 60 * 60  // seconds
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
