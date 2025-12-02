const mongoose=require("mongoose")
const DB=env.DATABASE;

mongoose.connect(DB).then(()=>{
    console.log('Connection Successful')
}).catch((err)=>{
    console.error(err)
});