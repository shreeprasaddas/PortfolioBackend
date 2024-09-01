import register from "../authentication/register.js";

const newRegister=async(req,res)=>{
    const {email , password} = req.body;
    const addUser =await register(email,password);
    res.json(addUser);
    
    
}

export default newRegister;