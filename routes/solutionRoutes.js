import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import solution from '../Schema/solutionSchema.js';
import cookieValidation from '../middleware/cookieValidatin.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = './uploads/';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + file.originalname;
        cb(null, uniqueSuffix);
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB limit
    },
    fileFilter: function (req, file, cb) {
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

// GET all solutions
router.get('/solutions', async (req, res) => {
    try {
        const solutions = await solution.find().sort({ date: -1 });
        res.status(200).json({
            success: true,
            message: 'Solutions fetched successfully',
            data: solutions
        });
    } catch (error) {
        console.error('Error fetching solutions:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching solutions',
            error: error.message
        });
    }
});

// GET solutions with search functionality
router.get('/solutions/search', async (req, res) => {
    try {
        const { q, category, status, page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;
        
        let query = {};
        
        // Search in title, description, and technologies
        if (q) {
            query.$or = [
                { title: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } },
                { technologies: { $in: [new RegExp(q, 'i')] } },
                { category: { $regex: q, $options: 'i' } }
            ];
        }
        
        // Filter by category
        if (category) {
            query.category = { $regex: category, $options: 'i' };
        }
        
        // Filter by status
        if (status) {
            query.status = status;
        }
        
        const solutions = await solution.find(query)
            .sort({ date: -1 })
            .skip(skip)
            .limit(parseInt(limit));
            
        const total = await solution.countDocuments(query);
        
        res.status(200).json({
            success: true,
            message: 'Solutions search completed',
            data: solutions,
            pagination: {
                current: parseInt(page),
                total: Math.ceil(total / limit),
                hasNext: skip + solutions.length < total,
                hasPrev: page > 1
            }
        });
    } catch (error) {
        console.error('Error searching solutions:', error);
        res.status(500).json({
            success: false,
            message: 'Error searching solutions',
            error: error.message
        });
    }
});

// GET single solution by ID
router.get('/solutions/:id', async (req, res) => {
    try {
        const solutionData = await solution.findById(req.params.id);
        if (!solutionData) {
            return res.status(404).json({
                success: false,
                message: 'Solution not found'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Solution fetched successfully',
            data: solutionData
        });
    } catch (error) {
        console.error('Error fetching solution:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching solution',
            error: error.message
        });
    }
});

// POST create new solution (protected)
router.post('/solutions', cookieValidation, upload.single('image'), async (req, res) => {
    try {
        console.log('=== SOLUTION CREATION REQUEST ===');
        console.log('Headers:', req.get('Content-Type'));
        console.log('Body:', req.body);
        console.log('File:', req.file ? req.file.filename : 'No file');
        
        const { title, description, features, technologies, link, category, status } = req.body;
        
        let imgLink = '';
        if (req.file) {
            imgLink = req.file.filename;
        } else if (req.body.imgLink) {
            imgLink = req.body.imgLink;
        }
        
        // Parse arrays if they're strings
        let parsedFeatures = [];
        let parsedTechnologies = [];
        
        if (features) {
            try {
                parsedFeatures = typeof features === 'string' ? JSON.parse(features) : features;
            } catch (e) {
                parsedFeatures = features.split(',').map(f => f.trim());
            }
        }
        
        if (technologies) {
            try {
                parsedTechnologies = typeof technologies === 'string' ? JSON.parse(technologies) : technologies;
            } catch (e) {
                parsedTechnologies = technologies.split(',').map(t => t.trim());
            }
        }
        
        console.log('Creating solution with:', {
            title,
            description,
            features: parsedFeatures,
            technologies: parsedTechnologies,
            imgLink,
            link,
            category,
            status
        });
        
        const newSolution = new solution({
            title,
            description,
            features: parsedFeatures,
            technologies: parsedTechnologies,
            imgLink,
            link,
            category,
            status: status || 'Active'
        });
        
        const savedSolution = await newSolution.save();
        
        res.status(201).json({
            success: true,
            message: 'Solution created successfully',
            data: savedSolution
        });
    } catch (error) {
        console.error('Error creating solution:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating solution',
            error: error.message
        });
    }
});

// PUT update solution (protected)
router.put('/solutions/:id', cookieValidation, upload.single('image'), async (req, res) => {
    try {
        console.log('=== SOLUTION UPDATE REQUEST ===');
        console.log('ID:', req.params.id);
        console.log('Body:', req.body);
        console.log('File:', req.file ? req.file.filename : 'No new file');
        
        const solutionId = req.params.id;
        const { title, description, features, technologies, link, category, status } = req.body;
        
        const existingSolution = await solution.findById(solutionId);
        if (!existingSolution) {
            return res.status(404).json({
                success: false,
                message: 'Solution not found'
            });
        }
        
        let imgLink = existingSolution.imgLink;
        if (req.file) {
            imgLink = req.file.filename;
            // TODO: Delete old image file if it exists
        } else if (req.body.imgLink) {
            imgLink = req.body.imgLink;
        }
        
        // Parse arrays if they're strings
        let parsedFeatures = existingSolution.features;
        let parsedTechnologies = existingSolution.technologies;
        
        if (features !== undefined) {
            try {
                parsedFeatures = typeof features === 'string' ? JSON.parse(features) : features;
            } catch (e) {
                parsedFeatures = features.split(',').map(f => f.trim());
            }
        }
        
        if (technologies !== undefined) {
            try {
                parsedTechnologies = typeof technologies === 'string' ? JSON.parse(technologies) : technologies;
            } catch (e) {
                parsedTechnologies = technologies.split(',').map(t => t.trim());
            }
        }
        
        const updatedSolution = await solution.findByIdAndUpdate(
            solutionId,
            {
                title: title || existingSolution.title,
                description: description || existingSolution.description,
                features: parsedFeatures,
                technologies: parsedTechnologies,
                imgLink,
                link: link !== undefined ? link : existingSolution.link,
                category: category || existingSolution.category,
                status: status || existingSolution.status
            },
            { new: true, runValidators: true }
        );
        
        res.status(200).json({
            success: true,
            message: 'Solution updated successfully',
            data: updatedSolution
        });
    } catch (error) {
        console.error('Error updating solution:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating solution',
            error: error.message
        });
    }
});

// DELETE solution (protected)
router.delete('/solutions/:id', cookieValidation, async (req, res) => {
    try {
        console.log('=== SOLUTION DELETE REQUEST ===');
        console.log('ID:', req.params.id);
        
        const solutionId = req.params.id;
        const solutionToDelete = await solution.findById(solutionId);
        
        if (!solutionToDelete) {
            return res.status(404).json({
                success: false,
                message: 'Solution not found'
            });
        }
        
        // TODO: Delete associated image file if it exists
        
        await solution.findByIdAndDelete(solutionId);
        
        res.status(200).json({
            success: true,
            message: 'Solution deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting solution:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting solution',
            error: error.message
        });
    }
});

export default router;
