import porject from "../Schema/projectSchema.js";
import addPost from "../crud operation/postProject/addPost.js";
import updatePost from "../crud operation/postProject/updatePost.js";
import path from 'path';
import deletePost from "../crud operation/postProject/deletePost.js";
import fs from 'fs';


const postAdd= async(req,res)=>{
    const {tittle, link , imgLink, paragraph} =req.body;

    const isAlreadyExist=await porject.findOne({tittle:tittle});
    
    if(!isAlreadyExist){
        console.log("the real image link :"+imgLink)
        const postAdded= await addPost(tittle, link , imgLink, paragraph);

        res.json({
            isPostAdded:postAdded
        })
    }
    else{
        res.json({
            isPostAdded:false
        })
    }
    


}

const postUpdate = async(req,res)=>{
    const {oldTittle,tittle, link , imgLink, paragraph} =req.body;

    const postUpdated= await updatePost(oldTittle,tittle,link,imgLink,paragraph);

    res.json({
        isUpdated:postUpdated
    });
}


const postDelete = async (req, res) => {
    try {
        const { tittle } = req.body;
        console.log("Title to delete:", tittle);

        // 1. First check if post exists
        const post = await porject.findOne({ tittle: tittle });
        
        if (!post) {
            return res.status(404).json({
                isPostDeleted: false,
                error: "Post not found"
            });
        }

        // 2. Store the imgLink before deletion
        const deletedImgLink = post.imgLink;
        
        // 3. Delete from database
        const postDeleted = await deletePost(tittle);

        if (postDeleted) {
            // 4. Use proper path construction
            const filePath = path.join(process.cwd(), 'public', deletedImgLink);
            
            // 5. Use promises version and await
            await fs.promises.unlink(filePath);
            console.log("File deleted successfully");
        }

        res.json({
            isPostDeleted: postDeleted
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