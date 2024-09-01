import { Schema } from "mongoose";
import DataBase from "../databaseConnection/database_connection.js";

const formSchema= new Schema({
    firstName:{
        type:String,
        require:true,
    },
    middleName:{
        type:String,
        require:false
    },
    lasName:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    phoneNumber:{
        type:String,
        require:true,
    },
    adderess:{
        type:String,
        require:true
    },
    message:{
        type:String,
        require:true
    }
    
});


const form = DataBase.model("formData",formSchema);

export default form;

