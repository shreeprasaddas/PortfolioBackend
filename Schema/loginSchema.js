import { Schema } from "mongoose";
import DataBase from "../databaseConnection/database_connection.js";




const loginSchema= new Schema({
    email:{
         type:String,
         require:true
    },
    userPassword:{
        type:String,
        require:true
    }
});


const login= DataBase.model('adminLogin',loginSchema);


export default login;
