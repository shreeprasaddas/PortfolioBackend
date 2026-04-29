import multer from 'multer';
import cookieValidation from '../middleware/cookieValidatin.js';
import porject from '../Schema/projectSchema.js';
import { Router } from 'express';

const updateRouter = Router();

// Use memory storage for Vercel compatibility (no disk writes)
const storage = multer.memoryStorage();

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 },
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

// Middleware to convert file buffer to base64
const handleFileUpload = (req, res, next) => {
  if (req.file) {
    const base64String = req.file.buffer.toString('base64');
    const dataUri = `data:${req.file.mimetype};base64,${base64String}`;
    req.body.imgLink = dataUri;
    req.body.fileName = req.file.originalname;
    req.body.fileMimeType = req.file.mimetype;
  }
  next();
};

// Update Post Controller
const postUpdate = async (req, res) => {
  try {
    const { oldTittle, tittle, link, paragraph } = req.body;
    const newImgLink = req.body.imgLink;

    // Get existing post
    const existingPost = await porject.findOne({ tittle: oldTittle });
    
    if (!existingPost) {
      return res.status(404).json({ isUpdated: false });
    }

    // Update post data (no need to delete old image on Vercel - it's base64 encoded in DB)
    const updateData = {
      tittle,
      link,
      paragraph,
      imgLink: newImgLink || existingPost.imgLink
    };

    const updatedPost = await porject.findOneAndUpdate(
      { tittle: oldTittle },
      updateData,
      { new: true }
    );

    res.json({
      isUpdated: !!updatedPost
    });

  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ isUpdated: false });
  }
};

// Route setup
updateRouter.post("/", cookieValidation, upload.single("img"), handleFileUpload, postUpdate);

export default updateRouter;

