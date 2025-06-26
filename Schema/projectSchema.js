import { Schema } from "mongoose";
import DataBase from "../databaseConnection/database_connection.js";


const projectSchema= new Schema({
    tittle:{
        type:String,
        require:true
    },
    link:{
        type:String
    },
    imgLink:{
        type:String,
        require:true
    },
    paragraph:{
        type:String,
        require:true
    },
    date:{
        type:Date,
        default:Date.now
    }
});

const porject = DataBase.model('project',projectSchema);

export default porject;