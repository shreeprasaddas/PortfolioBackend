import porject from "../Schema/projectSchema.js";


const getPortfolioContent= async()=>{
    let no_of_post;
    let data;
    let portfolioContent;

    try{
        console.log("[DB QUERY] Counting project documents...");
        no_of_post = await porject.countDocuments({});
        console.log(`[DB QUERY] Found ${no_of_post} projects`);
        
        console.log("[DB QUERY] Fetching all project data...");
        data = await porject.find({});
        console.log(`[DB QUERY] ✅ Successfully fetched ${data?.length || 0} projects from database`);
        
        portfolioContent = {
            no_of_post: no_of_post,
            Data: data,
            error: false
        };
    }
    catch(err){
        console.error("[DB ERROR] Failed to fetch portfolio content:", err.message);
        console.error("[DB ERROR] Error type:", err.name);
        console.error("[DB ERROR] Stack:", err.stack);
        
        portfolioContent = {
            error: true,
            message: err.message || "Database query failed",
            data: [],
            no_of_post: 0
        };
    }
    
    return portfolioContent;
}

export default getPortfolioContent;