import cookieValidation from "../middleware/cookieValidatin.js";
import express from "express";
import getAdmin from "../controller/adminDataFetchController.js";


const adminFetchRouter= express.Router();


adminFetchRouter.get("/",cookieValidation,(req,res,next)=>{
    next();
});
adminFetchRouter.post("/",cookieValidation,getAdmin);

export default adminFetchRouter;