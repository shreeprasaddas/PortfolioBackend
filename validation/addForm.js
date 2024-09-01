import form from "../Schema/formSchema.js";

const addFrom= async (fName,mName,lName,emailId,phNO,adder,msg)=>{
    let isAdded;
    await form.insertMany({
        firstName:fName,
        middleName:mName,
        lastName:lName,
        email:emailId,
        phoneNumber:phNO,
        adderess:adder,
        message:msg
   
        
   }).then(()=>{
       console.log("form insert succesfully");
       isAdded=true;
   })
   .catch(()=>{
       console.log("form insert failed");
       isAdded=false;
   })
   return isAdded;
}

export default addFrom;