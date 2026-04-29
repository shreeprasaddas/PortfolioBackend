import getPortfolioContent from "../fetchData/portfolioContent.js";



const getPortfolio = async(req,res)=>{
    try {
        const data = await getPortfolioContent();
        if (data.error) {
            console.warn("[WARN] Portfolio fetch returned error:", data.message);
            return res.status(500).json(data);
        }
        res.json(data);
    } catch (err) {
        console.error("[ERROR] Portfolio controller error:", err.message);
        res.status(500).json({
            error: true,
            message: err.message,
            data: []
        });
    }
}

export default getPortfolio;