
import bcrypt from 'bcryptjs';

const saltRound= 10;


const hashConvert= async(passInplain)=>{
    let hashPass;
    console.log("plain text :"+ passInplain);
    await bcrypt.hash(passInplain,saltRound)
    .then((hash)=>{
        console.log(hash);
        hashPass=hash;
    })
    .catch(()=>{
        console.log("password hashin failed");
        hashPass=null;
    });
    return hashPass;
}




const hashCheck=async (passInplain,encPass)=>{
    let result;

    await bcrypt.compare(passInplain,encPass).then((hash)=>{
        result=hash;
        console.log(hash);
    })
    .catch(()=>{
        result=null;
    });
    return result;
}

export {
    hashConvert,
    hashCheck
};





