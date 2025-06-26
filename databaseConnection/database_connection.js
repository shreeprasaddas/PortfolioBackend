import mongoose from "mongoose";

// const uri = "mongodb+srv://shreepsd:shreepsd%402227@cluster0.9jzuy.mongodb.net/portfolio";
const uri2 = "mongodb://localhost:27017/portfolio";

const DataBase= mongoose;
await mongoose.connect(uri2).then(()=>{
    console.log("database connection successfully");
})
.catch((error)=>{
    console.log("connecction faliled");
})



// const dataschema= new mongoose.Schema({
//     name:String
// });

// const data= mongoose.model('portfolio',dataschema);

// const Sdata=new data({name:"shree"});
// await Sdata.save().then(()=>{
//     console.log("data seve successfully");
// })
// .catch((error) =>{
//     console.log("failed save data");
// })

export default DataBase;
