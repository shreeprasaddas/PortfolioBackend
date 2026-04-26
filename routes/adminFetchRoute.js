import cookieValidation from "../middleware/cookieValidatin.js";
import express from "express";
import getAdmin from "../controller/adminDataFetchController.js";


const adminFetchRouter= express.Router();


adminFetchRouter.get("/", cookieValidation, (req, res) => {
    res.json({ message: "Use POST to fetch admin data" });
});
adminFetchRouter.post("/",cookieValidation,getAdmin);

export default adminFetchRouter;