import e from "express";
import cookieValidation from "../middleware/cookieValidatin.js";




const loginPageRouter= e.Router();


loginPageRouter.get("/",cookieValidation);

// Auth verification endpoint — used by the frontend PrivateRoute component
// Returns { validUser: true } if the cookie is valid, else 401
loginPageRouter.get("/verify", cookieValidation, (req, res) => {
    res.status(200).json({ validUser: true });
});

export default loginPageRouter;