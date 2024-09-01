import porject from "../../Schema/projectSchema.js";


const updatePost= async(postTitle,newTitle, link , imgLink, paragraph)=>{
    let isPostUpdated;
    try{
        await porject.updateOne({tittle:postTitle},{
            $set:{
                tittle:newTitle,
                link:link,
                imgLink:imgLink,
                paragraph:paragraph
                
            }
        });
        isPostUpdated= true;
    }
    catch{
        isPostUpdated=false;

    }
    return isPostUpdated;
}

export default updatePost;