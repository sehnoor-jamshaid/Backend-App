require('dotenv').config();


const mongoose=require('mongoose')
mongoose.connect(process.env.PROD)
  .then(() => console.log('Connected!'));
  module.exports=mongoose;


