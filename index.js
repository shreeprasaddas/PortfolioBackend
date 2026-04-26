import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();
import formValidate from './middleware/formValidate.js';
import addFrom from './validation/addForm.js';
import loginRouter from './routes/loginRoute.js';
import loginController from './controller/loginController.js';
import registerRouter from './routes/registerRoute.js';
import newRegister from './controller/registerController.js';
import cookieParser from 'cookie-parser';
import postRouter from './routes/postRoute.js';
import { postAdd, postDelete, postUpdate } from './controller/postController.js';
import loginPageRouter from './routes/loginPageRoute.js';
import loginPageController from './controller/loginPageController.js';
import adminFetchRouter from './routes/adminFetchRoute.js';
import portfolioFetchRoute from './routes/portfolioFetchRoute.js';
import getAdmin from './controller/adminDataFetchController.js';
import postDeleteRouter from './routes/PostDeleteRoute.js';
import updateRouter from './routes/postUpdate.js';
import projectRoutes from './routes/projectRoutes.js';
import contactFormRoutes from './routes/contactFormRoutes.js';
import fileManagementRoutes from './routes/fileManagementRoutes.js';
import solutionRoutes from './routes/solutionRoutes.js';
import configRoutes from './routes/configRoutes.js';
import { seedConfig } from './Schema/configSchema.js';
import { connectDB } from './databaseConnection/database_connection.js';
import cookieValidation from './middleware/cookieValidatin.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const app = express();

// Configure multer for file uploads at /upload endpoint
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(process.cwd(), 'uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 },
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

// Always allow the production frontend + any extra URLs from the env var
const allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://frontend-ten-alpha-64.vercel.app',
    'https://frontend-ten-alpha-64.vercel.app/',
    ...(process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',').map(u => u.trim()) : [])
];

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (e.g. Postman, server-to-server)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        console.warn(`CORS blocked - origin: ${origin}`);
        return callback(new Error(`CORS: origin ${origin} not allowed`), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie']
};

app.use(cors(corsOptions));

// Handle OPTIONS preflight for all routes (important for Vercel serverless)
app.options('*', cors(corsOptions));
app.use(cookieParser());

// Configure body parsers with increased limits
app.use(express.urlencoded({ extended: false, limit: '50mb', parameterLimit: 50000 }));

app.use(express.static('./public'))
app.use(express.static('./uploads'))
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('/tmp'));
}

// Routes that need JSON parsing
app.use("/login", express.json({ limit: '50mb' }), loginRouter, loginController);
app.use("/register", express.json({ limit: '50mb' }), registerRouter, newRegister);
app.use("/login", express.json({ limit: '50mb' }), loginPageRouter, loginPageController);

// Routes that handle file uploads (no JSON parsing)
app.use("/addPost", postRouter, postAdd);
app.use("/deletePost", postDeleteRouter, postDelete);
app.use("/updatePost", updateRouter, postUpdate);
app.use("/projects", projectRoutes);
app.use("/files", fileManagementRoutes);
app.use("/", solutionRoutes);

// Routes that need JSON parsing
app.use("/getAdmin", express.json({ limit: '50mb' }), adminFetchRouter);
app.use("/getPortfolio", express.json({ limit: '50mb' }), portfolioFetchRoute);
app.use("/contact-forms", express.json({ limit: '50mb' }), contactFormRoutes);
app.use("/config", express.json({ limit: '50mb' }), configRoutes);

// Initialize database and seed config
async function initializeApp() {
    try {
        await connectDB();
        await seedConfig();
    } catch (err) {
        console.error("❌ Failed to initialize app:", err.message);
    }
}

initializeApp();

app.get("/api", (req, res) => {
    res.json({ "key": "hello" });
});

app.post("/form", express.json({ limit: '50mb' }), formValidate, async (req, res) => {
    const { name, middle, last, email, phone, adderess, message } = req.body;
    const isFormAdded = await addFrom(name, middle, last, email, phone, adderess, message);
    console.log(isFormAdded);
    res.json({ err: !isFormAdded });
})

// Upload file endpoint (Protected route)
app.post("/upload", cookieValidation, upload.single('file'), async (req, res) => {
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, (err) => {
    if (err) {
        console.log("faild to listen the server");
    }
    else {
        console.log(`Listening on port ${PORT}`);
    }
});

export default app;