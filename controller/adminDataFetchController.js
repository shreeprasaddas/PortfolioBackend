import getAdminData from "../fetchData/adminLoginData.js";


const getAdmin= async(req,res)=>{
    const data= await getAdminData();
    res.json(data);
}

export default getAdmin;