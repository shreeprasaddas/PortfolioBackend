import { Schema } from "mongoose";
import DataBase from "../databaseConnection/database_connection.js";

const projectSchema = new Schema({
    tittle: { type: String, required: true },
    link: { type: String },
    imgLink: { type: String, required: false, default: null },  // Optional - can add image later
    paragraph: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

const project = DataBase.model('project', projectSchema);

export default project;