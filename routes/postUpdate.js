import multer from 'multer';
import fs from 'fs/promises';
import path from 'path';
import cookieValidation from '../middleware/cookieValidatin.js';

import { Router } from 'express';

const updateRouter = Router();
// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

// Middleware to handle file path
const handleFileUpload = (req, res, next) => {
  if (req.file) {
    req.body.imgLink = req.file.path.replace(/\\/g, '/'); // Convert to forward slashes
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

    // Delete old image if new image is uploaded
    if (newImgLink && existingPost.imgLink) {
      const oldFilePath = path.join(process.cwd(), 'public', existingPost.imgLink);
      await fs.unlink(oldFilePath).catch(err => console.error('Error deleting old image:', err));
    }

    // Update post data
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
updateRouter.post("/",cookieValidation,upload.single("img"),handleFileUpload,postUpdate);

export default updateRouter;

