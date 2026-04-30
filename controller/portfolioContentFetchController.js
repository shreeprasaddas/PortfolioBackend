import getPortfolioContent from "../fetchData/portfolioContent.js";



const getPortfolio = async(req,res)=>{
    try {
        console.log("[PORTFOLIO FETCH] Starting portfolio fetch request...");
        
        const data = await getPortfolioContent();
        
        if (data.error) {
            console.warn("[PORTFOLIO FETCH WARNING] Portfolio fetch returned error:", data.message);
            console.warn("[PORTFOLIO FETCH WARNING] Returning error response:", data);
            // Return error with 200 status so frontend can handle it gracefully
            return res.status(200).json(data);
        }
        
        console.log(`[PORTFOLIO FETCH] ✅ Successfully fetched ${data.Data?.length || 0} projects`);
        res.json(data);
    } catch (err) {
        console.error("[PORTFOLIO FETCH ERROR] Unexpected error:", err.message);
        console.error("[PORTFOLIO FETCH ERROR] Stack:", err.stack);
        
        // Return error response with 200 status and fallback data
        const errorResponse = {
            error: true,
            message: err.message || "Failed to fetch portfolio",
            Data: [],
            no_of_post: 0
        };
        
        console.error("[PORTFOLIO FETCH ERROR] Returning fallback response:", errorResponse);
        res.status(200).json(errorResponse);
    }
}

export default getPortfolio;