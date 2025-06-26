import login from "../../Schema/loginSchema.js";

const updateUser= async(userId,newPass)=>{
    let isUpdated;
    try{
        await login.updateOne({email:userId},
            {$set:{
                userPassword:newPass
            }}
        )
        isUpdated= true;
    }
    catch{
        isUpdated= false;  
}

return isUpdated;

}

export default updateUser;