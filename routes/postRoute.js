import e, { Router } from "express";
import multer from 'multer';
import cookieValidation from "../middleware/cookieValidatin.js";

const postRouter= e.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const dest = process.env.NODE_ENV === 'production' ? '/tmp' : './public';
      cb(null, dest);
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`)
    }
  })
  
  const upload = multer({ 
    storage: storage,
    limits: {
      fileSize: 50 * 1024 * 1024, // 50MB limit
      fieldSize: 50 * 1024 * 1024  // 50MB field size limit
    }
  })


postRouter.post("/",cookieValidation,upload.single("img"),(req,res,next)=>{
    const filename = req.file ? `/${req.file.filename}` : "";
    req.body.imgLink = filename;
    console.log("img link in postroute: " + filename);
    next();
});


export default postRouter;