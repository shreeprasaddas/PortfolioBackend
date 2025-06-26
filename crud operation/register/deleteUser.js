import login from "../../Schema/loginSchema.js";


const deleteUser= async(userId)=>{
    let UserDeleted;
    try{
        await login.deleteOne({email:userId});
        UserDeleted=true;
    }
    catch{
        UserDeleted=false;
    }

    return UserDeleted;
    
}

export default deleteUser;