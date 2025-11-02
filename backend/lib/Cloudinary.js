const cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: process.env.CLUDINARYCLOUDNAME,
  api_key: process.env.CLOUDINARYAPIKEY,
  api_secret: process.env.CLOUDINARYAPISECRET,
});
module.exports = cloudinary;
