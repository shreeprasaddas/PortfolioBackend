import express from "express";
import multer from "multer";
import path from "path";
import project from "../Schema/projectSchema.js";
import cookieValidation from "../middleware/cookieValidatin.js";

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB limit
        fieldSize: 50 * 1024 * 1024  // 50MB field size limit
    },
    fileFilter: function (req, file, cb) {
        // Allow only image files
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});

// Get all projects
router.get("/", async (req, res) => {
    const projects = await project.find();
    res.json(projects);
});

// Search projects
router.get("/search", async (req, res) => {
    try {
        const { query, limit = 10, skip = 0 } = req.query;
        
        if (!query || query.trim() === '') {
            return res.status(400).json({ error: "Search query is required" });
        }

        // Create a case-insensitive search across multiple fields
        const searchRegex = new RegExp(query.trim(), 'i');
        
        const searchConditions = {
            $or: [
                { tittle: { $regex: searchRegex } },
                { paragraph: { $regex: searchRegex } },
                { link: { $regex: searchRegex } }
            ]
        };

        // Execute search with pagination
        const projects = await project
            .find(searchConditions)
            .limit(parseInt(limit))
            .skip(parseInt(skip))
            .sort({ date: -1 }); // Sort by newest first

        // Get total count for pagination
        const totalCount = await project.countDocuments(searchConditions);

        res.json({
            projects,
            totalCount,
            hasMore: totalCount > parseInt(skip) + parseInt(limit),
            query: query.trim()
        });
    } catch (err) {
        console.error("Search error:", err);
        res.status(500).json({ error: "Failed to search projects" });
    }
});

// Add a project (Protected route)
router.post("/", cookieValidation, upload.single('image'), async (req, res) => {
    try {
        console.log("=== PROJECT CREATION REQUEST ===");
        console.log("Headers:", req.headers['content-type']);
        console.log("Body:", req.body);
        console.log("File:", req.file ? req.file.filename : 'No file');
        
        const { tittle, link, paragraph } = req.body;
        
        // Handle image link
        let imgLink = req.body.imgLink; // For base64 or URL images
        if (req.file) {
            // If file was uploaded, use the file path
            imgLink = req.file.filename;
        }
        
        console.log("Creating project with:", { tittle, link, imgLink, paragraph });
        
        const newProject = new project({ tittle, link, imgLink, paragraph });
        await newProject.save();
        res.status(201).json({ 
            message: "Project added successfully",
            project: newProject 
        });
    } catch (err) {
        console.error("Error creating project:", err);
        res.status(400).json({ error: err.message });
    }
});

// Update a project by tittle (Protected route)
router.put("/:tittle", cookieValidation, upload.single('image'), async (req, res) => {
    try {
        const { tittle } = req.params;
        const { tittle: newTittle, link, paragraph } = req.body;
        
        // Handle image link
        let imgLink = req.body.imgLink; // For base64 or URL images
        if (req.file) {
            // If file was uploaded, use the file path
            imgLink = req.file.filename;
        }
        
        console.log("Updating project with:", { newTittle, link, imgLink, paragraph });
        
        const updateData = { tittle: newTittle || tittle, link, paragraph };
        if (imgLink) {
            updateData.imgLink = imgLink;
        }
        
        await project.updateOne(
            { tittle },
            { $set: updateData }
        );
        res.json({ 
            message: "Project updated successfully",
            updatedFields: updateData 
        });
    } catch (err) {
        console.error("Error updating project:", err);
        res.status(400).json({ error: err.message });
    }
});

// Delete a project by tittle (Protected route)
router.delete("/:tittle", cookieValidation, async (req, res) => {
    try {
        const { tittle } = req.params;
        await project.deleteOne({ tittle });
        res.json({ message: "Project deleted" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

export default router;