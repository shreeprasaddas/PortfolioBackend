import login from "../Schema/loginSchema.js";

const getAdminData= async()=>{
    let noOfUser;
    let Data;
    let adminData;
    try{
        noOfUser=await login.countDocuments({});
        Data= await login.find({}).toArray();
        adminData={
            no_of_user:noOfUser,
            data:Data,
            error:false
        }
        
    }
    catch{

        adminData={
            error:true
        }
    }

    return adminData;
}

export default getAdminData;