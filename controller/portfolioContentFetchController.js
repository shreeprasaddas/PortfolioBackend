import getPortfolioContent from "../fetchData/portfolioContent.js";



const getPortfolio = async(req,res)=>{
    const data = await getPortfolioContent();

    res.json(data);
}

export default getPortfolio;