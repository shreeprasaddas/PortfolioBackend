import e from "express";
import cookieValidation from "../middleware/cookieValidatin.js";




const loginPageRouter= e.Router();


loginPageRouter.get("/",cookieValidation);

export default loginPageRouter;