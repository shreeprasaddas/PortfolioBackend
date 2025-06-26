import e from "express";
import getPortfolio from "../controller/portfolioContentFetchController.js";
import cookieValidation from "../middleware/cookieValidatin.js";

const portfolioFetchRoute= e.Router();

portfolioFetchRoute.get("/",getPortfolio);
portfolioFetchRoute.post("/",getPortfolio);


export default portfolioFetchRoute;