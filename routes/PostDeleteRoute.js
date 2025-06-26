import cookieValidation from "../middleware/cookieValidatin.js";
import { Router } from "express";

const postDeleteRouter = Router();
postDeleteRouter.post("/", cookieValidation)
    

export default postDeleteRouter;