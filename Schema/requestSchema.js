import { Schema } from "mongoose";
import DataBase from "../databaseConnection/database_connection.js";


const requestSchema= new Schema({
    ipAdderess:{
        type:String,
        require:true
    },
    requesType:{
        type:String,
        require:true,
    }
});


const reqData= DataBase.model('requestData',requestSchema);

export default reqData;