import cookieValidation from "../middleware/cookieValidatin.js";
import { Router } from "express";
import porject from "../Schema/projectSchema.js";
import express from "express";

const postDeleteRouter = Router();

// Delete Post Handler
const handlePostDelete = async (req, res) => {
    try {
        const { tittle } = req.body;
        console.log("Title to delete:", tittle);

        // Check if post exists
        const post = await porject.findOne({ tittle: tittle });
        
        if (!post) {
            return res.status(404).json({
                isPostDeleted: false,
                error: "Post not found"
            });
        }

        // Delete from database
        const result = await porject.deleteOne({ tittle: tittle });
        
        if (result.deletedCount > 0) {
            console.log("Post deleted successfully");
            res.json({
                isPostDeleted: true
            });
        } else {
            res.json({
                isPostDeleted: false
            });
        }
        
    } catch (error) {
        console.error("Delete error:", error);
        res.status(500).json({
            isPostDeleted: false,
            error: error.message
        });
    }
};

postDeleteRouter.post("/", express.json({ limit: '50mb' }), cookieValidation, handlePostDelete);

export default postDeleteRouter;