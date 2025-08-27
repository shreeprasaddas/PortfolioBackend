import { Schema } from "mongoose";
import DataBase from "../databaseConnection/database_connection.js";

const solutionSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    features: [{ type: String }], // Array of feature strings
    technologies: [{ type: String }], // Array of technology strings
    imgLink: { type: String, required: true },
    link: { type: String }, // Optional link to demo/details
    category: { type: String, required: true }, // e.g., "Web Development", "Mobile App", "AI/ML"
    status: { type: String, enum: ['Active', 'Completed', 'In Progress'], default: 'Active' },
    date: { type: Date, default: Date.now }
});

const solution = DataBase.model('solution', solutionSchema);

export default solution;
