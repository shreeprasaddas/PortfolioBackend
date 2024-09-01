import e, { Router } from "express";
import multer from 'multer';
import cookieValidation from "../middleware/cookieValidatin.js";

const postRouter= e.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`)
    }
  })
  
  const upload = multer({ storage: storage })


postRouter.post("/",cookieValidation,upload.single("img"),(req,res,next)=>{
    req.body.imgLink= req.file.path.toString();
    console.log(req.body.imgLink);
    next();
});
postRouter.get("/",cookieValidation);

export default postRouter;