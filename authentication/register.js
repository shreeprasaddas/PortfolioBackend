import login from "../Schema/loginSchema.js";
import { hashConvert,hashCheck } from "../validation/hashConversion.js";


const register= async(emailId,pass)=>{
    const exist= await login.findOne({
        email:emailId
    });
    console.log("pass :"+pass);

    if(!exist){
        const hashPass= await hashConvert(pass);
        if(hashPass){
            try{
                await login.insertMany({
                    email:emailId,
                    userPassword:hashPass
                })
                return({
                    err:false,
                    userExist:false,
                    register:true,
                    validKey:null
                })
    
            }
            catch{
                console.log("failed to register");
                return ({
                    err:true,
                    userExist:false,
                    register:false,
                    validKey:null
                })
            }
        }
        else{
            return ({
                err:true,
                userExist:false,
                register:false,
                validKey:null
            })

        }
        
        
    }
    else{
        console.log("user already exist");
        return ({
            err:false,
            userExist:true,
            register:false,
            validKey:null
        })
    }
}

export default register;

