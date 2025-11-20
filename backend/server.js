require("dotenv").config();
const express = require("express");
const http = require("http");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./lib/db");
const userRouter = require("./routes/userRoutes");
const { chat } = require("./controllers/messageController");

const app = express();
const server = http.createServer(app);

// Middlewares
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5173",
  "https://chatter-app-x9lb.vercel.app",
  "https://calm-swan-8b7784.netlify.app",
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Routes
app.use("/user", userRouter);

app.get("/testapi", (req, res) => {
  console.log("hii");
  return res.json({ success: true, message: "server is live" });
});

app.get("/", (req, res) => {
  console.log("server is live");
  return res.json({ success: true, message: "server is live" });
});
const startServer = async () => {
  try {
    await connectDB();  // ⬅️ Wait for MongoDB before starting server
    console.log("Mongo connected. Starting server...");

    chat(server); // start socket after DB connected

    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      console.log("server running on", PORT);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
};

startServer();

module.exports = server;
