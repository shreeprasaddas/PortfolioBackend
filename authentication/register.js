import login from "../Schema/loginSchema.js";
import { hashConvert,hashCheck } from "../validation/hashConversion.js";


const register= async(emailId,pass,secretKey=null)=>{
    // Check secret key - REQUIRED for registration
    const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || "shree123";
    
    console.log("Attempting registration with secret key...");
    console.log("ADMIN_SECRET_KEY from process.env:", process.env.ADMIN_SECRET_KEY);
    console.log("Final ADMIN_SECRET_KEY to use:", ADMIN_SECRET_KEY);
    console.log("Provided secret key:", secretKey);
    console.log("Are they equal?", secretKey === ADMIN_SECRET_KEY);
    
    // Secret key is REQUIRED
    if(!secretKey){
        return({
            err:true,
            userExist:false,
            register:false,
            validKey:false,
            message:"Secret key is required for admin registration"
        });
    }
    
    // Validate secret key
    if(secretKey !== ADMIN_SECRET_KEY){
        return({
            err:true,
            userExist:false,
            register:false,
            validKey:false,
            message:"Invalid secret key. Contact system administrator."
        });
    }
    
    console.log("Secret key validated successfully");

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
                    validKey:true,
                    message:"Admin account created successfully"
                })
    
            }
            catch{
                console.log("failed to register");
                return ({
                    err:true,
                    userExist:false,
                    register:false,
                    validKey:true,
                    message:"Failed to create admin account. Please try again."
                })
            }
        }
        else{
            return ({
                err:true,
                userExist:false,
                register:false,
                validKey:true,
                message:"Password encryption failed. Please try again."
            })

        }
        
        
    }
    else{
        console.log("user already exist");
        return ({
            err:false,
            userExist:true,
            register:false,
            validKey:true,
            message:"An admin account with this email already exists"
        })
    }
}

export default register;

