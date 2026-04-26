import jwt from "jsonwebtoken";
import 'dotenv/config.js';


const signToken= async(Obj)=>{
    let Token;
    try{
        Token=await jwt.sign({email:Obj.email,password:Obj.password},process.env.SECRET,{expiresIn: '24h'});
    }
    catch{
        Token=false;
    }
    return Token;
    
}

const verfyToken= async(key)=>{
     let result;
     try{
        result= await jwt.verify(key,process.env.SECRET);
     }
     catch{
        result=false;
     }
   
     return result;
}


export {
    signToken,
    verfyToken
}