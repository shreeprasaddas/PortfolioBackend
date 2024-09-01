
import express from "express";

const app=express();
app.use(express.urlencoded({extended:false}));

app.use((req,res,next)=>{
    let iparr=[];

    
})