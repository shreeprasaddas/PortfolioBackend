import express from "express";
import newRegister from "../controller/registerController.js";

const registerRouter= express.Router();

registerRouter.post("/", (req, res, next) => {
    console.log("=== Registration Route Hit ===");
    console.log("Request body:", req.body);
    console.log("Environment ADMIN_SECRET_KEY exists:", !!process.env.ADMIN_SECRET_KEY);
    console.log("Environment SECRET exists:", !!process.env.SECRET);
    next();
});

registerRouter.post("/", newRegister);

export default registerRouter;

