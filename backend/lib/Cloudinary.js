const { v2: cloudinary } = require("cloudinary");
const { Readable } = require("stream");

// Upload from buffer using stream
const streamUpload = (buffer, folder = "my_uploads") => {
  return new Promise((resolve, reject) => {
    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);

    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "auto" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    readable.pipe(stream);
  });
};

module.exports = streamUpload;
