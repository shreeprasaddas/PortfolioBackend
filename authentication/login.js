import login from "../Schema/loginSchema.js";

const checkUser= async(emailid)=>{
    const result =await login.findOne({
        email:emailid
    });
    if(result){
        return result;
    }
    else{
        return false;
    }
}
export default checkUser;