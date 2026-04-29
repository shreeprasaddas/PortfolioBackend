import e, { Router } from "express";
import multer from 'multer';
import cookieValidation from "../middleware/cookieValidatin.js";
import { postAdd } from "../controller/postController.js";

const postRouter = e.Router();

// Use memory storage for Vercel compatibility (no disk writes)
const storage = multer.memoryStorage();

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB limit
        fieldSize: 50 * 1024 * 1024  // 50MB field size limit
    },
    fileFilter: function (req, file, cb) {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(file.originalname.toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});

// Handle POST /addPost - Upload file and add post
postRouter.post("/", cookieValidation, upload.single("img"), async (req, res) => {
    try {
        if (req.file) {
            // Convert file buffer to base64 for Vercel compatibility
            const base64String = req.file.buffer.toString('base64');
            const dataUri = `data:${req.file.mimetype};base64,${base64String}`;
            
            req.body.imgLink = dataUri;
            req.body.fileName = req.file.originalname;
            req.body.fileMimeType = req.file.mimetype;
            
            console.log("File converted to base64 for storage");
        }
        
        // Call the controller to add the post
        await postAdd(req, res);
    } catch (error) {
        console.error("Error in post route:", error);
        res.status(400).json({
            isPostAdded: false,
            error: error.message
        });
    }
});

export default postRouter;