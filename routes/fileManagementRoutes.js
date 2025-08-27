import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
import cookieValidation from "../middleware/cookieValidatin.js";

const router = express.Router();

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(process.cwd(), 'uploads');
        
        // Create uploads directory if it doesn't exist
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        // Create unique filename with timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
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

// Upload single file (Protected route)
router.post("/upload", cookieValidation, upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        
        const fileInfo = {
            filename: req.file.filename,
            originalName: req.file.originalname,
            size: req.file.size,
            path: `/uploads/${req.file.filename}`,
            mimetype: req.file.mimetype,
            uploadedAt: new Date()
        };
        
        res.json({
            message: "File uploaded successfully",
            file: fileInfo
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Upload multiple files (Protected route)
router.post("/upload-multiple", cookieValidation, upload.array('files', 10), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: "No files uploaded" });
        }
        
        const filesInfo = req.files.map(file => ({
            filename: file.filename,
            originalName: file.originalname,
            size: file.size,
            path: `/uploads/${file.filename}`,
            mimetype: file.mimetype,
            uploadedAt: new Date()
        }));
        
        res.json({
            message: `${req.files.length} files uploaded successfully`,
            files: filesInfo
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get list of uploaded files
router.get("/", (req, res) => {
    try {
        const uploadsPath = path.join(process.cwd(), 'uploads');
        
        if (!fs.existsSync(uploadsPath)) {
            return res.json([]);
        }
        
        const files = fs.readdirSync(uploadsPath);
        const fileList = files.map(filename => {
            const filePath = path.join(uploadsPath, filename);
            const stats = fs.statSync(filePath);
            
            return {
                filename: filename,
                size: stats.size,
                path: `/uploads/${filename}`,
                uploadedAt: stats.birthtime,
                modifiedAt: stats.mtime
            };
        });
        
        // Sort by upload date (newest first)
        fileList.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
        
        res.json(fileList);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a file (Protected route)
router.delete("/:filename", cookieValidation, (req, res) => {
    try {
        const { filename } = req.params;
        const filePath = path.join(process.cwd(), 'uploads', filename);
        
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: "File not found" });
        }
        
        fs.unlinkSync(filePath);
        
        res.json({ message: "File deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get file info
router.get("/:filename/info", (req, res) => {
    try {
        const { filename } = req.params;
        const filePath = path.join(process.cwd(), 'uploads', filename);
        
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: "File not found" });
        }
        
        const stats = fs.statSync(filePath);
        
        const fileInfo = {
            filename: filename,
            size: stats.size,
            path: `/uploads/${filename}`,
            uploadedAt: stats.birthtime,
            modifiedAt: stats.mtime,
            isFile: stats.isFile(),
            isDirectory: stats.isDirectory()
        };
        
        res.json(fileInfo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get storage statistics
router.get("/stats/storage", (req, res) => {
    try {
        const uploadsPath = path.join(process.cwd(), 'uploads');
        
        if (!fs.existsSync(uploadsPath)) {
            return res.json({
                totalFiles: 0,
                totalSize: 0,
                averageSize: 0
            });
        }
        
        const files = fs.readdirSync(uploadsPath);
        let totalSize = 0;
        
        files.forEach(filename => {
            const filePath = path.join(uploadsPath, filename);
            const stats = fs.statSync(filePath);
            totalSize += stats.size;
        });
        
        res.json({
            totalFiles: files.length,
            totalSize: totalSize,
            averageSize: files.length > 0 ? Math.round(totalSize / files.length) : 0,
            totalSizeFormatted: formatFileSize(totalSize)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Helper function to format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export default router;
