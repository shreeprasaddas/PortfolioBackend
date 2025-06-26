import { signToken } from "../authentication/verifyToken.js";



const loginController= async(req,res)=>{
    const token= await signToken(req.body);
    console.log(token);
    console.log(req.body);
    if(token){

        res.cookie('uid', token.toString(), { httpOnly: false});
        res.status(200).send({token:token });
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