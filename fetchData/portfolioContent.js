import porject from "../Schema/projectSchema.js";


const getPortfolioContent= async()=>{

    let no_of_post;
    let data;
    let portfolioContent;

    try{
        no_of_post=await porject.countDocuments({});
        data=await porject.find({});
        portfolioContent={
            no_of_post:no_of_post,
            Data:data,
            error:false
        }
    }
    catch{
        portfolioContent={
            error:true
        }
    }
    return portfolioContent;
}

export default getPortfolioContent;