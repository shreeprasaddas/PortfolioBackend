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

const app = express();

// Configure multer for file uploads - use memory storage for Vercel compatibility
const storage = multer.memoryStorage();

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

// Routes that need JSON parsing
app.use("/login", express.json({ limit: '50mb' }), loginRouter, loginController);
app.use("/login/verify", cookieValidation, (req, res) => {
    // Auth verification endpoint — used by frontend during session check
    res.status(200).json({ validUser: true });
});
app.use("/register", express.json({ limit: '50mb' }), registerRouter, newRegister);

// Routes that handle file uploads - these routes already handle multer internally
app.use("/addPost", postRouter, express.json({ limit: '50mb' }), postAdd);
app.use("/deletePost", express.json({ limit: '50mb' }), postDeleteRouter, postDelete);
app.use("/updatePost", updateRouter, express.json({ limit: '50mb' }), postUpdate);
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
        const dbConnection = await connectDB();
        if (dbConnection) {
            await seedConfig();
            console.log("✅ App initialization complete with database");
        } else {
            console.warn("⚠️ App running without database connection - some features may not work");
        }
    } catch (err) {
        console.error("❌ Error during initialization:", err.message);
        console.warn("⚠️ Continuing without full initialization...");
    }
}

initializeApp();

// Health check endpoint (should work even without DB)
app.get("/", (req, res) => {
    res.status(200).json({ 
        status: "Backend server is running",
        timestamp: new Date().toISOString(),
        version: "1.0.0"
    });
});

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
        
        // Convert file buffer to base64
        const base64String = req.file.buffer.toString('base64');
        const dataUri = `data:${req.file.mimetype};base64,${base64String}`;
        
        const fileInfo = {
            filename: req.file.originalname,
            size: req.file.size,
            mimetype: req.file.mimetype,
            dataUri: dataUri,
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