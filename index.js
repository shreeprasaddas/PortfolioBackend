
import cors from 'cors';
import express from 'express';
import formValidate from './middleware/formValidate.js';
import addFrom from './validation/addForm.js';
import loginRouter from './routes/loginRoute.js';
import loginController from './controller/loginController.js';
import registerRouter from './routes/registerRoute.js';
import newRegister from './controller/registerController.js';
import cookieParser from 'cookie-parser';
import postRouter from './routes/postRoute.js';
import { postAdd,postDelete,postUpdate } from './controller/postController.js';
import loginPageRouter from './routes/loginPageRoute.js';
import loginPageController from './controller/loginPageController.js';
import adminFetchRouter from './routes/adminFetchRoute.js';
import portfolioFetchRoute from './routes/portfolioFetchRoute.js';
import getAdmin from './controller/adminDataFetchController.js';
import postDeleteRouter from './routes/PostDeleteRoute.js';
import updateRouter from './routes/postUpdate.js';


const app=express();

app.use(express.urlencoded({extended:false}));
app.use(cors());
app.use(cookieParser());
app.use(express.json());


app.use(express.static('./public'))
app.use("/login",loginRouter,loginController);
app.use("/register",registerRouter,newRegister);
app.use("/login",loginPageRouter,loginPageController);
app.use("/addPost",postRouter,postAdd);
app.use("/deletePost",postDeleteRouter,postDelete);
app.use("/updatePost",updateRouter,postUpdate);

app.use("/getAdmin",adminFetchRouter);
app.use("/getPortfolio",portfolioFetchRoute);

app.get("/api",(req,res)=>{
    res.json({"key":"hello"});
});

app.post("/form",formValidate,async(req,res)=>{
    const {name,middle,last,email,phone,adderess,message}= req.body;
    const isFormAdded= await addFrom(name,middle,last,email,phone,adderess,message);
    console.log(isFormAdded);
    res.json({err:!isFormAdded});
    
    
})


app.listen(9000,(err)=>{
    if(err){
        console.log("faild to listen the server");
    }
    else{
        console.log("listning.........");
    }
})