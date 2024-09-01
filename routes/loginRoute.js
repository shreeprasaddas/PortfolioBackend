import express from "express";
import checkUser from "../authentication/login.js";
import { hashCheck, hashConvert } from "../validation/hashConversion.js";


const loginRouter= express.Router();

loginRouter.post("/",async (req,res,next)=>{
    const {email,password} = req.body;
    const dbPass= await checkUser(email);
    if(dbPass){
        const isValidUser= await hashCheck(password,dbPass.userPassword);
        if(isValidUser){
            next();
        }
        else{
            return res.json({
                validUser:false
            })
        }

    }
    else{
        return res.json({
            validUser:false
        })
    }
   


});


export default loginRouter;