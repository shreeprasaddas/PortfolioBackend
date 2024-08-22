import express from 'express';
import cors from 'cors';


const app=express();

app.use(cors());
app.use(express.json());


app.get("/api",(req,res)=>{
    res.json({"key":"hello"});
});



app.listen(9000,(err)=>{
    if(err){
        console.log("faild to listen the server");
    }
    else{
        console.log("listning.........");
    }
})