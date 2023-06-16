require('dotenv').config();


const mongoose=require('mongoose')
mongoose.connect(process.env.LOCAL)
  .then(() => console.log('Connected!'));
  module.exports=mongoose;


