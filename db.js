const mongoose=require('mongoose');
require('dotenv').config({path: './.env.local'});
const uri=process.env.REACT_APP_MONGO_URI;

const connectToMongo=()=>{
  try {
    mongoose.connect(uri);    
    }catch (error) { 
    console.log("could not connect");    
    }

}

module.exports=connectToMongo;