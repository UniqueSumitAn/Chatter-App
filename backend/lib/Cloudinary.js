const { v2: cloudinary } = require("cloudinary");
const { Readable } = require("stream");

// 🔥 MUST configure Cloudinary here
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Stream upload function
const streamUpload = (buffer, folder = "my_uploads") => {
  return new Promise((resolve, reject) => {
    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "auto" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    readable.pipe(uploadStream);
  });
};

module.exports = streamUpload;
