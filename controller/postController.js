import porject from "../Schema/projectSchema.js";
import addPost from "../crud operation/postProject/addPost.js";
import updatePost from "../crud operation/postProject/updatePost.js";
import deletePost from "../crud operation/postProject/deletePost.js";

// Add new post
const postAdd = async(req, res) => {
    try {
        const { tittle, link, imgLink, paragraph } = req.body;

        // Check if post already exists
        const isAlreadyExist = await porject.findOne({ tittle: tittle });
        
        if (!isAlreadyExist) {
            console.log("Adding new post with title: " + tittle);
            const postAdded = await addPost(tittle, link, imgLink, paragraph);

            res.json({
                isPostAdded: postAdded,
                message: postAdded ? "Post added successfully" : "Failed to add post"
            });
        } else {
            res.json({
                isPostAdded: false,
                message: "Post with this title already exists"
            });
        }
    } catch (error) {
        console.error("Error adding post:", error);
        res.status(500).json({
            isPostAdded: false,
            error: error.message
        });
    }
}

// Update existing post
const postUpdate = async(req, res) => {
    try {
        const { oldTittle, tittle, link, imgLink, paragraph } = req.body;

        const postUpdated = await updatePost(oldTittle, tittle, link, imgLink, paragraph);

        res.json({
            isUpdated: postUpdated,
            message: postUpdated ? "Post updated successfully" : "Failed to update post"
        });
    } catch (error) {
        console.error("Error updating post:", error);
        res.status(500).json({
            isUpdated: false,
            error: error.message
        });
    }
}

// Delete post (NOTE: On Vercel, image data is stored as base64 in DB, so no file deletion needed)
const postDelete = async (req, res) => {
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

        // Delete from database only (images are base64 in DB, no file deletion needed)
        const postDeleted = await deletePost(tittle);

        res.json({
            isPostDeleted: postDeleted,
            message: postDeleted ? "Post deleted successfully" : "Failed to delete post"
        });
        
    } catch (error) {
        console.error("Delete error:", error);
        res.status(500).json({
            isPostDeleted: false,
            error: error.message
        });
    }
};
    





export{
    postAdd,
    postUpdate,
    postDelete
}