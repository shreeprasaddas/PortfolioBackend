
const formValidate= (req,res,next)=>{
    const {name,middle,last,email,phone,adderess}= req.body;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if( name.length <= 2 || last.length <= 2 || !emailPattern.test(email) ){
        console.log("form validation failed");
        return res.json({
            formValidationErr:true
          
        })
    }
    else{
        console.log(name.length);
        console.log("form validation success");
         next();
    }
}

export default  formValidate;