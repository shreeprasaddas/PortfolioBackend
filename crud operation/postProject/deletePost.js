import porject from "../../Schema/projectSchema.js";


const deletePost = async(postTitle)=>{
    let isPostDeleted;
    try{
        await porject.deleteOne({tittle:postTitle});
        isPostDeleted= true;
    }
    catch{
        isPostDeleted=false;
    }
    return isPostDeleted;
    
}


export default deletePost;