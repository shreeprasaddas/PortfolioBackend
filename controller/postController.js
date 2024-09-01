import porject from "../Schema/projectSchema.js";
import addPost from "../crud operation/postProject/addPost.js";
import updatePost from "../crud operation/postProject/updatePost.js";
import deletePost from "../crud operation/postProject/deletePost.js";


const postAdd= async(req,res)=>{
    const {tittle, link , imgLink, paragraph} =req.body;

    const isAlreadyExist=await porject.findOne({tittle:tittle});
    console.log("path"+imgLink);
    if(!isAlreadyExist){
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


const postDelete= async(req,res)=>{
    const {tittle, link , imgLink, paragraph} =req.body;
    const postDeleted= await deletePost(tittle);
    res.json({
        isPostDeleted:postDeleted
    });
    
}




export{
    postAdd,
    postUpdate,
    postDelete
}