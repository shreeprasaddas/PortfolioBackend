import porject from "../../Schema/projectSchema.js";

const addPost= async(tittle, link , imgLink, paragraph)=>{
    let postAdded;
    console.log("tittle :"+tittle);
    try{
        await porject.insertMany({
            tittle:tittle,
            link:link,
            imgLink:imgLink,
            paragraph:paragraph
        })
        postAdded= true;
    }
    catch{
        postAdded= false;

    }
    return postAdded;
}

export default addPost;