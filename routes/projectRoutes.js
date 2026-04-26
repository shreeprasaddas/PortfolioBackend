import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import project from "../Schema/projectSchema.js";
import cookieValidation from "../middleware/cookieValidatin.js";

const router = express.Router();

// Configure multer for MEMORY storage (not disk - suitable for Vercel)
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
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
        console.log("File present:", !!req.file);
        
        const { tittle, link, paragraph } = req.body;
        
        // Handle image link
        let imgLink = req.body.imgLink; // For external URLs
        if (req.file) {
            // Convert file buffer to base64 data URI
            const mimeType = req.file.mimetype;
            const base64String = req.file.buffer.toString('base64');
            imgLink = `data:${mimeType};base64,${base64String}`;
            console.log("Converted image to base64, size:", base64String.length);
        }
        
        console.log("Creating project with:", { tittle, link, paragraph, hasImage: !!imgLink });
        
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
        let imgLink = req.body.imgLink; // For external URLs
        if (req.file) {
            // Convert file buffer to base64 data URI
            const mimeType = req.file.mimetype;
            const base64String = req.file.buffer.toString('base64');
            imgLink = `data:${mimeType};base64,${base64String}`;
            console.log("Converted image to base64, size:", base64String.length);
        }
        
        console.log("Updating project with:", { newTittle, link, paragraph, hasImage: !!imgLink });
        
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