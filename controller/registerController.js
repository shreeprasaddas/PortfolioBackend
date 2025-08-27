import register from "../authentication/register.js";

const newRegister=async(req,res)=>{
    const {email , password, secretKey} = req.body;
    const addUser =await register(email,password,secretKey);
    res.json(addUser);
    
    
}

export default newRegister;