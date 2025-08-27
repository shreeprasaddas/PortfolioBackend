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

const app = express();

app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'], // Frontend URLs
    credentials: true, // Allow cookies to be sent
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie']
}));
app.use(cookieParser());

// Configure body parsers with increased limits
app.use(express.urlencoded({ extended: false, limit: '50mb', parameterLimit: 50000 }));

app.use(express.static('./public'))
app.use(express.static('./uploads'))

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

app.get("/api", (req, res) => {
    res.json({ "key": "hello" });
});

// Debug endpoint to check environment (remove in production)
app.get("/debug/env", (req, res) => {
    res.json({ 
        "ADMIN_SECRET_KEY_SET": !!process.env.ADMIN_SECRET_KEY,
        "ADMIN_SECRET_KEY_VALUE": process.env.ADMIN_SECRET_KEY, // REMOVE THIS IN PRODUCTION!
        "SECRET_VALUE": process.env.SECRET, // REMOVE THIS IN PRODUCTION!
        "NODE_ENV": process.env.NODE_ENV || "development",
        "PORT": process.env.PORT || "5000"
    });
});

app.post("/form", express.json({ limit: '50mb' }), formValidate, async (req, res) => {
    const { name, middle, last, email, phone, adderess, message } = req.body;
    const isFormAdded = await addFrom(name, middle, last, email, phone, adderess, message);
    console.log(isFormAdded);
    res.json({ err: !isFormAdded });
})

const PORT = 5000;
app.listen(PORT, (err) => {
    if (err) {
        console.log("faild to listen the server");
    }
    else {
        console.log("listning.........");
    }
})