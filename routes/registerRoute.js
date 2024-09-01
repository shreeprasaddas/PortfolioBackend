import express from "express";
import register from "../authentication/register.js";
import "dotenv/config.js";


const registerRouter= express.Router();

registerRouter.post("/",(req,res,next)=>{
    console.log("its registerroute");
    const {email, password , secret}= req.body;
    if (secret == process.env.SECRET){
        next();
    }
    else{
        return res.json({
            validKey:false
        })
    }
    
})
export default registerRouter;

