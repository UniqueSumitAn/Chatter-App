const multer = require("multer");

// Use memory storage for Vercel compatibility
const storage = multer.memoryStorage();

// Export Multer instance
const upload = multer({ storage });

module.exports = upload;
