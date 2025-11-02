const mongoose = require("mongoose");

const connectdb = async () => {
  try {
   
    await mongoose.connect(`${process.env.MONGODB_URI}/CHATTER`);
    console.log("database connected");
;
    
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectdb;
