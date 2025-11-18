const multer = require("multer");
const path = require("path");
const fs = require("fs");
const os = require("os");

// Use Vercel writable temp directory
const uploadPath = path.join(os.tmpdir(), "uploads");

// Ensure the temp folder exists
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

// Export multer instance
const upload = multer({ storage });

module.exports = upload;
